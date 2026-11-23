import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { confirmTokenKey, createConfirmToken } from "@/lib/newsletter-token";
import NewsletterConfirmedPage, { metadata } from "./page";

type Params = { status?: string | string[]; token?: string | string[] };

async function render(params: string | string[] | Params = {}) {
  const searchParams: Params = typeof params === "string" || Array.isArray(params) ? { status: params } : params;
  const page = await NewsletterConfirmedPage({ searchParams: Promise.resolve(searchParams) });
  return renderToStaticMarkup(page);
}

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re-key");
  vi.stubEnv("NEWSLETTER_CONFIRM_SECRET", "");
});

describe("app/newsletter/confirmed/page", () => {
  it("exports noindex metadata", () => {
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/newsletter/confirmed");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("confirms the subscription and says what to expect", async () => {
    const html = await render();
    expect(html).toContain("Subscription Confirmed");
    expect(html).toContain("You&#x27;re In 🎉");
    expect(html).toContain("What to Expect 📬");
    expect(html.match(/<li /g)).toHaveLength(3);
    expect(html).toContain('href="/posts"');
    expect(html).not.toContain('href="/#newsletter"');
  });

  it("treats unknown statuses as success", async () => {
    for (const status of ["nope", ["invalid", "error"]]) {
      expect(await render(status)).toContain("Subscription Confirmed");
    }
  });

  it("asks for a click before subscribing a valid token", async () => {
    const token = createConfirmToken("reader+news@example.com", confirmTokenKey()!);
    const html = await render({ token });
    expect(html).toContain("One Last Step");
    expect(html).toContain("Confirm Your Subscription ✉️");
    expect(html).toContain("reader+news@example.com");
    expect(html).toContain('<form action="/api/newsletter/confirm" method="post">');
    expect(html).toContain(`<input type="hidden" name="token" value="${token}"/>`);
    expect(html).toContain("Yes, subscribe me");
    expect(html).toContain("What to Expect 📬");
    expect(html).not.toContain("Subscription Confirmed");
  });

  it("shows the invalid state right away for bad or expired tokens", async () => {
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    for (const token of ["garbage", createConfirmToken("a@example.com", confirmTokenKey()!, eightDaysAgo)]) {
      const html = await render({ token });
      expect(html).toContain("Link Expired");
      expect(html).not.toContain("<form");
    }
  });

  it("shows the error state for a token when confirming isn't configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const html = await render({ token: "anything" });
    expect(html).toContain("Something Went Wrong");
    expect(html).not.toContain("<form");
  });

  it("ignores the token once a status is set, and empty or repeated tokens", async () => {
    const token = createConfirmToken("a@example.com", confirmTokenKey()!);
    expect(await render({ status: "error", token })).toContain("Something Went Wrong");
    expect(await render({ token: "" })).toContain("Subscription Confirmed");
    expect(await render({ token: [token, token] })).toContain("Subscription Confirmed");
  });

  it("explains an invalid or expired link and links back to the signup", async () => {
    const html = await render("invalid");
    expect(html).toContain("Link Expired");
    expect(html).toContain("That Link Didn&#x27;t Work 🔗");
    expect(html).toContain('href="/#newsletter"');
    expect(html).toContain('href="/contact"');
    expect(html).not.toContain("What to Expect");
  });

  it("explains a failure on our side", async () => {
    const html = await render("error");
    expect(html).toContain("Something Went Wrong");
    expect(html).toContain("Let&#x27;s Try That Again 🔁");
    expect(html).toContain('href="/#newsletter"');
  });

  it("stays out of site search and has no em dashes", async () => {
    const token = createConfirmToken("a@example.com", confirmTokenKey()!);
    for (const params of [{}, { token }, { status: "invalid" }, { status: "error" }]) {
      const html = await render(params);
      expect(html).toContain('data-pagefind-ignore="all"');
      expect(html).not.toContain("—");
    }
  });
});
