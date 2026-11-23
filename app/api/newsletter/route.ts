import { NextResponse } from "next/server";
import { newsletterConfirmEmail } from "@/lib/emails/newsletter-confirm";
import { confirmTokenKey, createConfirmToken } from "@/lib/newsletter-token";

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
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const key = confirmTokenKey();
  if (!apiKey || !from || !key) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  // Double opt-in: nothing is stored yet. The contact is only created when the
  // link in this email is opened (app/api/newsletter/confirm/route.ts). The
  // link uses this request's origin so preview deployments confirm against
  // themselves.
  const confirmUrl = new URL("/api/newsletter/confirm", new URL(request.url).origin);
  confirmUrl.searchParams.set("token", createConfirmToken(email, key));

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      ...newsletterConfirmEmail(confirmUrl.toString()),
    }),
  });

  if (res.ok) {
    return NextResponse.json({ success: true, pending: true });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(
    { error: data?.message || "Failed to subscribe" },
    { status: res.status }
  );
}
