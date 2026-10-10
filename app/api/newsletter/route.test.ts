import { afterEach, describe, expect, it, vi } from "vitest";
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

function buttondownResponse(status: number, json: () => Promise<unknown> = async () => ({})) {
  return { status, json } as unknown as Response;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("POST /api/newsletter", () => {
  it("rejects missing, non-string and malformed emails", async () => {
    for (const body of [{}, { email: 42 }, { email: "not-an-email" }]) {
      const res = await POST(subscribeRequest(body));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Valid email required" });
    }
  });

  it("returns 500 when Buttondown is not configured", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "");
    const res = await POST(subscribeRequest({ email: "a@example.com" }, null));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Newsletter not configured" });
  });

  it("subscribes the email and pings Slack on success", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "bd-key");
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.test/abc");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(buttondownResponse(201))
      .mockRejectedValueOnce(new Error("slack down"));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(subscribeRequest({ email: "new@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: { Authorization: "Token bd-key", "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: "new@example.com" }),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, "https://hooks.slack.test/abc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "📬 New newsletter subscriber: *new@example.com*" }),
    });
  });

  it("skips the Slack ping when no webhook is configured", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "bd-key");
    vi.stubEnv("SLACK_WEBHOOK_URL", "");
    const fetchMock = vi.fn().mockResolvedValue(buttondownResponse(201));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(subscribeRequest({ email: "quiet@example.com" }));
    expect(await res.json()).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("treats 409 and 'already subscribed' 400s as success", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "bd-key");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(buttondownResponse(409))
        .mockResolvedValueOnce(buttondownResponse(400, async () => ({ detail: "This email is Already Subscribed." }))),
    );

    for (let i = 0; i < 2; i++) {
      const res = await POST(subscribeRequest({ email: "dup@example.com" }));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true, alreadySubscribed: true });
    }
  });

  it("passes through other errors with their detail or a fallback message", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "bd-key");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(buttondownResponse(400, async () => ({ detail: "Email is invalid" })))
        .mockResolvedValueOnce(buttondownResponse(400, async () => ({ detail: { code: 1 } })))
        .mockResolvedValueOnce(buttondownResponse(502, async () => { throw new Error("not json"); }))
        .mockResolvedValueOnce(buttondownResponse(500, async () => null)),
    );

    const results = [];
    for (let i = 0; i < 4; i++) {
      const res = await POST(subscribeRequest({ email: "x@example.com" }));
      results.push([res.status, await res.json()]);
    }
    expect(results).toEqual([
      [400, { error: "Email is invalid" }],
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
