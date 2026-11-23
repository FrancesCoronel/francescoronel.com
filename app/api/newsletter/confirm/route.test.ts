import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { confirmTokenKey, createConfirmToken } from "@/lib/newsletter-token";
import { GET } from "./route";

const ORIGIN = "https://preview-1.vercel.app";
const CONFIRMED = `${ORIGIN}/newsletter/confirmed`;

function resendResponse(status: number, json: () => Promise<unknown> = async () => ({})) {
  return { status, ok: status >= 200 && status < 300, json } as unknown as Response;
}

function tokenFor(email: string, now = Date.now()) {
  return createConfirmToken(email, confirmTokenKey()!, now);
}

function confirm(token: string | null) {
  const url = new URL("/api/newsletter/confirm", ORIGIN);
  if (token !== null) url.searchParams.set("token", token);
  return GET(new Request(url));
}

function expectRedirect(res: Response, location: string) {
  expect(res.status).toBe(303);
  expect(res.headers.get("location")).toBe(location);
}

const authHeaders = { Authorization: "Bearer re-key", "Content-Type": "application/json" };

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re-key");
  vi.stubEnv("RESEND_SEGMENT_ID", "seg-1");
  vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", "");
  vi.stubEnv("SLACK_WEBHOOK_URL", "");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("GET /api/newsletter/confirm", () => {
  it("creates the contact in the segment, pings Slack and shows the confirmed page", async () => {
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.test/abc");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(resendResponse(201))
      .mockRejectedValueOnce(new Error("slack down"));
    vi.stubGlobal("fetch", fetchMock);

    const res = await confirm(tokenFor("new@example.com"));
    expectRedirect(res, CONFIRMED);
    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://api.resend.com/contacts", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ email: "new@example.com", unsubscribed: false, segments: [{ id: "seg-1" }] }),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, "https://hooks.slack.test/abc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "📬 New newsletter subscriber: *new@example.com*" }),
    });
  });

  it("leaves out the segment when none is configured", async () => {
    vi.stubEnv("RESEND_SEGMENT_ID", "");
    const fetchMock = vi.fn().mockResolvedValue(resendResponse(201));
    vi.stubGlobal("fetch", fetchMock);

    expectRedirect(await confirm(tokenFor("a@example.com")), CONFIRMED);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: "a@example.com", unsubscribed: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("skips the Slack ping for resend.dev test addresses", async () => {
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.test/abc");
    const fetchMock = vi.fn().mockResolvedValue(resendResponse(201));
    vi.stubGlobal("fetch", fetchMock);

    expectRedirect(await confirm(tokenFor("delivered+e2e-1@Resend.dev")), CONFIRMED);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("resubscribes an existing contact and adds it to the segment", async () => {
    for (const exists of [
      resendResponse(409),
      resendResponse(400, async () => ({ message: "Contact Already Exists." })),
    ]) {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(exists)
        .mockResolvedValueOnce(resendResponse(200))
        .mockResolvedValueOnce(resendResponse(201));
      vi.stubGlobal("fetch", fetchMock);

      expectRedirect(await confirm(tokenFor("old+news@example.com")), CONFIRMED);
      expect(fetchMock).toHaveBeenNthCalledWith(2, "https://api.resend.com/contacts/old%2Bnews%40example.com", {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ unsubscribed: false }),
      });
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        "https://api.resend.com/contacts/old%2Bnews%40example.com/segments/seg-1",
        { method: "POST", headers: authHeaders },
      );
    }
  });

  it("treats a contact that's already in the segment as confirmed", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(resendResponse(409))
        .mockResolvedValueOnce(resendResponse(200))
        .mockResolvedValueOnce(resendResponse(409)),
    );
    expectRedirect(await confirm(tokenFor("old@example.com")), CONFIRMED);
  });

  it("only updates an existing contact when no segment is configured", async () => {
    vi.stubEnv("RESEND_SEGMENT_ID", "");
    const fetchMock = vi.fn().mockResolvedValueOnce(resendResponse(409)).mockResolvedValueOnce(resendResponse(200));
    vi.stubGlobal("fetch", fetchMock);
    expectRedirect(await confirm(tokenFor("old@example.com")), CONFIRMED);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shows the error state when Resend fails", async () => {
    const cases = [
      // creating the contact fails outright (and with a body that isn't JSON)
      [resendResponse(500, async () => { throw new Error("not json"); })],
      [resendResponse(422, async () => ({ message: { code: 1 } }))],
      // the contact exists but can't be updated
      [resendResponse(409), resendResponse(500)],
      // the contact exists but can't be added to the segment
      [resendResponse(409), resendResponse(200), resendResponse(500, async () => ({ message: "boom" }))],
    ];
    for (const responses of cases) {
      const fetchMock = vi.fn();
      for (const r of responses) fetchMock.mockResolvedValueOnce(r);
      vi.stubGlobal("fetch", fetchMock);
      expectRedirect(await confirm(tokenFor("a@example.com")), `${CONFIRMED}?status=error`);
    }
  });

  it("shows the invalid state for missing, tampered and expired tokens", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    for (const token of [null, "", "garbage", `${tokenFor("a@example.com")}x`, tokenFor("a@example.com", eightDaysAgo)]) {
      expectRedirect(await confirm(token), `${CONFIRMED}?status=invalid`);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects tokens signed for another key", async () => {
    const token = tokenFor("a@example.com");
    vi.stubEnv("RESEND_API_KEY", "rotated-key");
    vi.stubGlobal("fetch", vi.fn());
    expectRedirect(await confirm(token), `${CONFIRMED}?status=invalid`);
  });

  it("shows the error state when Resend is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", "s");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expectRedirect(await confirm("anything"), `${CONFIRMED}?status=error`);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
