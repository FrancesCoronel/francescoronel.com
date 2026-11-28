import { NextResponse } from "next/server";
import { confirmTokenKey, verifyConfirmToken } from "@/lib/newsletter-token";

// Second half of the newsletter double opt-in. The link in the confirmation
// email (sent by POST /api/newsletter) opens /newsletter/confirmed?token=...,
// which asks for an explicit click. That page's form POSTs the token here, and
// only the POST adds the contact to Resend and the newsletter segment.
//
// GET only redirects: mail providers' link scanners prefetch every URL in an
// email, so a GET that subscribed would sign people up without them clicking.
// It stays for links sent before the email pointed at the page directly.

const RESEND_API = "https://api.resend.com";

type Outcome = "invalid" | "error";

function redirectTo(request: Request, params: { status?: Outcome; token?: string } = {}) {
  const url = new URL("/newsletter/confirmed", new URL(request.url).origin);
  if (params.status) url.searchParams.set("status", params.status);
  if (params.token) url.searchParams.set("token", params.token);
  // 303 so the browser follows with a plain GET
  return NextResponse.redirect(url, 303);
}

async function readMessage(res: Response): Promise<string> {
  const data = await res.json().catch(() => null);
  return typeof data?.message === "string" ? data.message : "";
}

function alreadyExists(res: Response, message: string) {
  return res.status === 409 || message.toLowerCase().includes("already exists");
}

/** Side-effect free: sends old links (and scanners) to the click-to-confirm page. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  return redirectTo(request, token ? { token } : { status: "invalid" });
}

/**
 * Subscribes the address in the signed token from the confirm page's form.
 * No CSRF token is needed: the request only acts on a valid, unexpired token
 * signed by this site for one address, so a forged POST can at most confirm
 * an address whose owner already holds that link.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const raw = form?.get("token");
  const token = typeof raw === "string" ? raw : "";

  const apiKey = process.env.RESEND_API_KEY;
  const key = confirmTokenKey();
  if (!apiKey || !key) return redirectTo(request, { status: "error" });

  const email = verifyConfirmToken(token, key);
  if (!email) return redirectTo(request, { status: "invalid" });

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const resend = (path: string, method: string, body?: unknown) =>
    fetch(`${RESEND_API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

  const created = await resend("/contacts", "POST", {
    email,
    unsubscribed: false,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  });

  if (created.ok) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    // resend.dev is Resend's test domain (used by e2e/newsletter-live.spec.ts)
    const isTestAddress = email.toLowerCase().endsWith("@resend.dev");
    if (webhookUrl && !isTestAddress) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📬 New newsletter subscriber: *${email}*`,
        }),
      }).catch(() => {});
    }
    return redirectTo(request);
  }

  if (!alreadyExists(created, await readMessage(created))) {
    return redirectTo(request, { status: "error" });
  }

  // Already a contact (maybe one who unsubscribed, or confirmed twice):
  // subscribe them again and make sure they're in the segment
  const contactPath = `/contacts/${encodeURIComponent(email)}`;
  const updated = await resend(contactPath, "PATCH", { unsubscribed: false });
  if (!updated.ok) return redirectTo(request, { status: "error" });

  if (segmentId) {
    const added = await resend(`${contactPath}/segments/${encodeURIComponent(segmentId)}`, "POST");
    if (!added.ok && !alreadyExists(added, await readMessage(added))) {
      return redirectTo(request, { status: "error" });
    }
  }

  return redirectTo(request);
}
