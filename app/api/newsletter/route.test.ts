import { afterEach, describe, expect, it, vi } from "vitest";
import { confirmTokenKey, verifyConfirmToken } from "@/lib/newsletter-token";
import { POST } from "./route";

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `10.0.0.${ipCounter}`;
}

function subscribeRequest(body: unknown, ip: string | null = nextIp()) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (ip) headers["x-forwarded-for"] = `${ip}, 192.168.0.1`;
  return new Request("https://francescoronel.com/api/newsletter", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function resendResponse(status: number, json: () => Promise<unknown> = async () => ({})) {
  return { status, ok: status >= 200 && status < 300, json } as unknown as Response;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("POST /api/newsletter", () => {
  it("rejects missing, non-string and malformed emails", async () => {
    for (const body of [{}, null, { email: 42 }, { email: "not-an-email" }, { email: "   " }]) {
      const res = await POST(subscribeRequest(body));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Valid email required" });
    }
  });

  it("returns 500 when Resend is not configured", async () => {
    for (const [apiKey, from] of [["", "news@example.com"], ["re-key", ""]]) {
      vi.stubEnv("RESEND_API_KEY", apiKey);
      vi.stubEnv("RESEND_FROM", from);
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const res = await POST(subscribeRequest({ email: "a@example.com" }, null));
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Newsletter not configured" });
      expect(fetchMock).not.toHaveBeenCalled();
    }
  });

  it("emails a signed confirmation link instead of creating the contact", async () => {
    vi.stubEnv("RESEND_API_KEY", "re-key");
    vi.stubEnv("RESEND_FROM", "Frances <news@example.com>");
    vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", "");
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.test/abc");
    const fetchMock = vi.fn().mockResolvedValue(resendResponse(200, async () => ({ id: "email-1" })));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(subscribeRequest({ email: "  new@example.com " }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, pending: true });

    // Only the confirmation email: no contact, no Slack ping yet
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Authorization: "Bearer re-key", "Content-Type": "application/json" });
    const sent = JSON.parse(init.body);
    expect(sent.from).toBe("Frances <news@example.com>");
    expect(sent.to).toEqual(["new@example.com"]);
    expect(sent.subject).toBe("Confirm your subscription 📬");

    // The link points back at this deployment and carries a token for the address
    const link = sent.text.match(/https:\/\/\S+/)[0];
    const confirmUrl = new URL(link);
    expect(confirmUrl.origin + confirmUrl.pathname).toBe("https://francescoronel.com/newsletter/confirmed");
    const token = confirmUrl.searchParams.get("token")!;
    expect(verifyConfirmToken(token, confirmTokenKey()!)).toBe("new@example.com");
    expect(sent.html).toContain(link.replace(/&/g, "&amp;"));
  });

  it("builds the confirm link from the request's own origin", async () => {
    vi.stubEnv("RESEND_API_KEY", "re-key");
    vi.stubEnv("RESEND_FROM", "news@example.com");
    const fetchMock = vi.fn().mockResolvedValue(resendResponse(200));
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("https://preview-123.vercel.app/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": nextIp() },
      body: JSON.stringify({ email: "p@example.com" }),
    });
    await POST(req);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.text).toContain("https://preview-123.vercel.app/newsletter/confirmed?token=");
  });

  it("passes through Resend errors with their message or a fallback", async () => {
    vi.stubEnv("RESEND_API_KEY", "re-key");
    vi.stubEnv("RESEND_FROM", "news@example.com");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(resendResponse(422, async () => ({ message: "Invalid `to` field" })))
        .mockResolvedValueOnce(resendResponse(400, async () => ({ message: { code: 1 } })))
        .mockResolvedValueOnce(resendResponse(502, async () => { throw new Error("not json"); }))
        .mockResolvedValueOnce(resendResponse(500, async () => null)),
    );

    const results = [];
    for (let i = 0; i < 4; i++) {
      const res = await POST(subscribeRequest({ email: "x@example.com" }));
      results.push([res.status, await res.json()]);
    }
    expect(results).toEqual([
      [422, { error: "Invalid `to` field" }],
      [400, { error: { code: 1 } }],
      [502, { error: "Failed to subscribe" }],
      [500, { error: "Failed to subscribe" }],
    ]);
  });

  it("rate limits after three requests per IP per minute, then resets", async () => {
    vi.useFakeTimers({ now: new Date("2024-01-01T00:00:00Z"), toFake: ["Date"] });
    const ip = nextIp();
    for (let i = 0; i < 3; i++) {
      const res = await POST(subscribeRequest({}, ip));
      expect(res.status).toBe(400);
    }
    const limited = await POST(subscribeRequest({}, ip));
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: "Too many requests. Please try again later." });

    vi.setSystemTime(new Date("2024-01-01T00:01:01Z"));
    const afterWindow = await POST(subscribeRequest({}, ip));
    expect(afterWindow.status).toBe(400);
  });
});
