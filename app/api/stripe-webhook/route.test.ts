import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const SECRET = "whsec_test";
const PREPAID_LINK = "plink_1QvPnbJOE15tvMHYLh2vRdgo";

function sign(payload: string, timestamp = Math.floor(Date.now() / 1000), secret = SECRET) {
  const digest = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

function event(session: Record<string, unknown>, type = "checkout.session.completed") {
  return JSON.stringify({ id: "evt_123", type, data: { object: session } });
}

function paidSession(overrides: Record<string, unknown> = {}) {
  return {
    payment_link: PREPAID_LINK,
    payment_status: "paid",
    customer_details: { email: "mentee@example.com", name: "Ada Lovelace" },
    ...overrides,
  };
}

function webhookRequest(payload: string, signature: string | null = sign(payload)) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (signature) headers["stripe-signature"] = signature;
  return new Request("https://francescoronel.com/api/stripe-webhook", {
    method: "POST",
    headers,
    body: payload,
  });
}

function stubFetch(status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({ status, ok: status >= 200 && status < 300 });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", SECRET);
  vi.stubEnv("RESEND_API_KEY", "re-key");
  vi.stubEnv("RESEND_FROM", "Frances Coronel <hello@francescoronel.com>");
});

describe("POST /api/stripe-webhook", () => {
  it("returns 500 when a required env var is missing", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
    const res = await POST(webhookRequest(event(paidSession())));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Webhook not configured" });
  });

  it("rejects missing, forged, malformed and stale signatures", async () => {
    const fetchMock = stubFetch();
    const payload = event(paidSession());
    const stale = Math.floor(Date.now() / 1000) - 3600;
    const signatures = [
      null,
      sign(payload, undefined, "whsec_wrong"),
      "v1=abc",
      "t,v1=abc",
      "t=not-a-number,v1=abc",
      sign(payload, stale),
    ];
    for (const signature of signatures) {
      const res = await POST(webhookRequest(payload, signature));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid signature" });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("emails the booking link to a prepaid package buyer", async () => {
    const fetchMock = stubFetch();
    const res = await POST(webhookRequest(event(paidSession())));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true, sent: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toEqual({
      Authorization: "Bearer re-key",
      "Content-Type": "application/json",
      "Idempotency-Key": "prepaid-booking/evt_123",
    });
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      from: "Frances Coronel <hello@francescoronel.com>",
      to: ["mentee@example.com"],
      reply_to: "hello@francescoronel.com",
      subject: "Book your mentoring sessions 🗓️",
    });
    expect(body.text).toContain("Hi Ada,");
    expect(body.text).toContain("https://cal.com/francescoronel/mentoring-hour-prepaid");
    expect(body.html).toContain('<a href="https://cal.com/francescoronel/mentoring-hour-prepaid">');
  });

  it("also sends when a delayed payment clears", async () => {
    const fetchMock = stubFetch();
    const payload = event(paidSession(), "checkout.session.async_payment_succeeded");
    const res = await POST(webhookRequest(payload));
    expect(await res.json()).toEqual({ received: true, sent: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("greets buyers without a name instead of leaving a blank", async () => {
    const fetchMock = stubFetch();
    const session = paidSession({ customer_details: { email: "mentee@example.com", name: null } });
    await POST(webhookRequest(event(session)));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain("Hi there,");
    expect(body.text).not.toContain("Hi ,");
  });

  it("acknowledges but skips payments that are not paid prepaid packages", async () => {
    const fetchMock = stubFetch();
    const payloads = [
      event(paidSession({ payment_link: "plink_other" })),
      event(paidSession({ payment_link: null })),
      event(paidSession({ payment_status: "unpaid" })),
      event(paidSession({ customer_details: null })),
      event(paidSession(), "payment_intent.succeeded"),
    ];
    for (const payload of payloads) {
      const res = await POST(webhookRequest(payload));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ received: true, sent: false });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 so Stripe retries when Resend fails", async () => {
    stubFetch(500);
    const res = await POST(webhookRequest(event(paidSession())));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Failed to send booking email" });
  });
});
