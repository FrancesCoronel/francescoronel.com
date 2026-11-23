import { NextResponse } from "next/server";
import { confirmTokenKey, verifyConfirmToken } from "@/lib/newsletter-token";

// Second half of the newsletter double opt-in: the link in the confirmation
// email (sent by POST /api/newsletter) lands here. A valid token adds the
// contact to Resend and the newsletter segment, then everyone ends up on
// /newsletter/confirmed, with ?status=invalid or ?status=error when it failed.

const RESEND_API = "https://api.resend.com";

function redirectTo(request: Request, status?: "invalid" | "error") {
  const url = new URL("/newsletter/confirmed", new URL(request.url).origin);
  if (status) url.searchParams.set("status", status);
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

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const apiKey = process.env.RESEND_API_KEY;
  const key = confirmTokenKey();
  if (!apiKey || !key) return redirectTo(request, "error");

  const email = verifyConfirmToken(token, key);
  if (!email) return redirectTo(request, "invalid");

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
    return redirectTo(request, "error");
  }

  // Already a contact (maybe one who unsubscribed, or clicked the link twice):
  // subscribe them again and make sure they're in the segment
  const contactPath = `/contacts/${encodeURIComponent(email)}`;
  const updated = await resend(contactPath, "PATCH", { unsubscribed: false });
  if (!updated.ok) return redirectTo(request, "error");

  if (segmentId) {
    const added = await resend(`${contactPath}/segments/${encodeURIComponent(segmentId)}`, "POST");
    if (!added.ok && !alreadyExists(added, await readMessage(added))) {
      return redirectTo(request, "error");
    }
  }

  return redirectTo(request);
}
