import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prepaidBookingEmail } from "@/lib/emails/prepaid-booking";

// Stripe payment links that sell prepaid mentoring packages. Buyers of these
// get the booking link by email, in case they close the tab before the
// post-payment redirect to cal.com lands.
const PREPAID_PAYMENT_LINK_IDS = new Set([
  "plink_1QvPnbJOE15tvMHYLh2vRdgo", // 3 x 1-Hour Mentoring Calls
  "plink_1QvPpCJOE15tvMHYKP5LdkZ0", // 6 x 1-Hour Mentoring Calls
]);

const REPLY_TO = "hello@francescoronel.com";
const SIGNATURE_TOLERANCE_SECONDS = 300;

// Resend remembers an Idempotency-Key for 24 hours, but Stripe keeps retrying a
// failed delivery for up to three days. Past this age a retry could no longer be
// deduplicated, so the event is acknowledged without sending: a buyer missing
// the email (they were also redirected to the booking page) beats a duplicate.
const MAX_EVENT_AGE_SECONDS = 23 * 60 * 60;

// Fired when a checkout is paid right away, or when a delayed payment method clears
const PAID_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

interface CheckoutSession {
  payment_link?: string | null;
  payment_status?: string;
  customer_details?: { email?: string | null; name?: string | null } | null;
}

interface StripeEvent {
  id: string;
  type: string;
  created: number;
  data: { object: CheckoutSession };
}

/** Checks the `Stripe-Signature` header: `t=<unix seconds>,v1=<hex hmac>[,v1=...]`. */
function isValidSignature(payload: string, header: string, secret: string): boolean {
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [key, value] = part.trim().split("=");
    if (key === "t") timestamp = value ?? "";
    if (key === "v1" && value) signatures.push(value);
  }

  const seconds = Number(timestamp);
  if (!timestamp || !Number.isFinite(seconds)) return false;
  if (Math.abs(Date.now() / 1000 - seconds) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = Buffer.from(
    createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex")
  );
  return signatures.some((signature) => {
    const given = Buffer.from(signature);
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!secret || !apiKey || !from) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!isValidSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEvent;
  const session = event.data.object;
  const email = session.customer_details?.email;
  const isPrepaidPurchase =
    PAID_EVENTS.has(event.type) &&
    session.payment_status === "paid" &&
    !!session.payment_link &&
    PREPAID_PAYMENT_LINK_IDS.has(session.payment_link);

  if (!isPrepaidPurchase || !email) {
    return NextResponse.json({ received: true, sent: false });
  }

  // `created` is when Stripe first generated the event; it stays the same across retries
  if (Date.now() / 1000 - event.created > MAX_EVENT_AGE_SECONDS) {
    return NextResponse.json({ received: true, sent: false, reason: "event too old" });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Stripe retries deliveries; this keeps a retry from sending a second email
      // for as long as Resend remembers the key (see MAX_EVENT_AGE_SECONDS)
      "Idempotency-Key": `prepaid-booking/${event.id}`,
    },
    body: JSON.stringify({
      from,
      to: [email],
      reply_to: REPLY_TO,
      ...prepaidBookingEmail(session.customer_details?.name),
    }),
  });

  if (!res.ok) {
    // A non-2xx response makes Stripe retry the delivery later
    return NextResponse.json({ error: "Failed to send booking email" }, { status: 502 });
  }

  return NextResponse.json({ received: true, sent: true });
}
