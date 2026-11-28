import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  CONFIRM_TOKEN_TTL_SECONDS,
  confirmTokenKey,
  createConfirmToken,
  verifyConfirmToken,
} from "./newsletter-token";

const key = Buffer.from("test-secret");
const NOW = Date.UTC(2026, 0, 1);

describe("newsletter confirm tokens", () => {
  it("round-trips a valid token to its email", () => {
    const token = createConfirmToken("ada@example.com", key, NOW);
    expect(token).toMatch(/^[\w-]+\.[\w-]+$/);
    expect(verifyConfirmToken(token, key, NOW)).toBe("ada@example.com");
    expect(verifyConfirmToken(token, key, NOW + (CONFIRM_TOKEN_TTL_SECONDS - 1) * 1000)).toBe("ada@example.com");
  });

  it("rejects an expired token", () => {
    const token = createConfirmToken("ada@example.com", key, NOW);
    expect(verifyConfirmToken(token, key, NOW + CONFIRM_TOKEN_TTL_SECONDS * 1000)).toBeNull();
  });

  it("rejects a token signed with another key", () => {
    const token = createConfirmToken("ada@example.com", Buffer.from("other"), NOW);
    expect(verifyConfirmToken(token, key, NOW)).toBeNull();
  });

  it("rejects tampered payloads and signatures", () => {
    const token = createConfirmToken("ada@example.com", key, NOW);
    const [, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ email: "eve@example.com", exp: NOW / 1000 + 60 })).toString("base64url");
    expect(verifyConfirmToken(`${forged}.${signature}`, key, NOW)).toBeNull();
    expect(verifyConfirmToken(`${token.slice(0, -1)}${token.endsWith("A") ? "B" : "A"}`, key, NOW)).toBeNull();
    expect(verifyConfirmToken(`${token}x`, key, NOW)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    for (const token of ["", "abc", ".", "a.", ".b", "a.b.c"]) {
      expect(verifyConfirmToken(token, key, NOW)).toBeNull();
    }
  });

  it("rejects correctly signed payloads that aren't a valid confirmation", () => {
    const signed = (raw: string) => {
      const payload = Buffer.from(raw).toString("base64url");
      return `${payload}.${createHmac("sha256", key).update(payload).digest("base64url")}`;
    };
    const exp = NOW / 1000 + 60;
    expect(verifyConfirmToken(signed("not json"), key, NOW)).toBeNull();
    expect(verifyConfirmToken(signed("null"), key, NOW)).toBeNull();
    expect(verifyConfirmToken(signed(JSON.stringify({ email: "nope", exp })), key, NOW)).toBeNull();
    expect(verifyConfirmToken(signed(JSON.stringify({ email: 1, exp })), key, NOW)).toBeNull();
    expect(verifyConfirmToken(signed(JSON.stringify({ email: "a@b.co", exp: "soon" })), key, NOW)).toBeNull();
    expect(verifyConfirmToken(signed(JSON.stringify({ email: "a@b.co", exp })), key, NOW)).toBe("a@b.co");
  });

  it("prefers NEWSLETTER_CONFIRM_SECRET and otherwise derives a key from RESEND_API_KEY", () => {
    expect(confirmTokenKey({ NEWSLETTER_CONFIRM_SECRET: "s", RESEND_API_KEY: "re" })).toEqual(Buffer.from("s"));
    const derived = confirmTokenKey({ RESEND_API_KEY: "re" });
    expect(derived).toHaveLength(32);
    expect(derived).not.toEqual(Buffer.from("re"));
    expect(derived).toEqual(confirmTokenKey({ RESEND_API_KEY: "re" }));
    expect(derived).not.toEqual(confirmTokenKey({ RESEND_API_KEY: "other" }));
    expect(confirmTokenKey({})).toBeNull();
    expect(confirmTokenKey({ NEWSLETTER_CONFIRM_SECRET: "", RESEND_API_KEY: "" })).toBeNull();
  });
});
