import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Signed, stateless tokens for the newsletter double opt-in. The confirmation
// link carries the address and an expiry, signed with HMAC-SHA256, so nothing
// has to be stored between the signup and the click.
//
// Format: base64url(JSON {email, exp}) + "." + base64url(HMAC-SHA256(payload))
// exp is in Unix seconds.

export const CONFIRM_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

interface TokenPayload {
  email: string;
  exp: number;
}

/**
 * The HMAC key: NEWSLETTER_CONFIRM_SECRET when set, otherwise derived from
 * RESEND_API_KEY so no extra env var is required. Rotating either one voids
 * the links already sent. Returns null when neither is set.
 */
export function confirmTokenKey(env: Record<string, string | undefined> = process.env): Buffer | null {
  if (env.NEWSLETTER_CONFIRM_SECRET) return Buffer.from(env.NEWSLETTER_CONFIRM_SECRET);
  if (env.RESEND_API_KEY) {
    return createHash("sha256").update(`newsletter-confirm:${env.RESEND_API_KEY}`).digest();
  }
  return null;
}

function sign(payload: string, key: Buffer): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Makes a token confirming `email`, valid for CONFIRM_TOKEN_TTL_SECONDS from `now` (ms). */
export function createConfirmToken(email: string, key: Buffer, now = Date.now()): string {
  const body: TokenPayload = { email, exp: Math.floor(now / 1000) + CONFIRM_TOKEN_TTL_SECONDS };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

/** Returns the email a token confirms, or null if it's malformed, tampered with or expired. */
export function verifyConfirmToken(token: string, key: Buffer, now = Date.now()): string | null {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [payload, signature] = parts;

  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  let body: Partial<TokenPayload>;
  try {
    body = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (typeof body?.email !== "string" || !body.email.includes("@")) return null;
  if (typeof body.exp !== "number" || body.exp * 1000 <= now) return null;
  return body.email;
}
