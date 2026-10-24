import { NextResponse } from "next/server";

// Simple in-memory rate limiter: max 3 requests per IP per 60 seconds
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    }),
  });

  if (res.ok) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📬 New newsletter subscriber: *${email}*`,
        }),
      }).catch(() => {});
    }
    return NextResponse.json({ success: true });
  }

  const data = await res.json().catch(() => ({}));

  // 409 or an "already exists" message — treat as success
  if (res.status === 409 || (typeof data?.message === "string" && data.message.toLowerCase().includes("already exists"))) {
    return NextResponse.json({ success: true, alreadySubscribed: true });
  }

  return NextResponse.json(
    { error: data?.message || "Failed to subscribe" },
    { status: res.status }
  );
}
