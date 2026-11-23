import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import NewsletterConfirmedPage, { metadata } from "./page";

async function render(status?: string | string[]) {
  const page = await NewsletterConfirmedPage({ searchParams: Promise.resolve(status === undefined ? {} : { status }) });
  return renderToStaticMarkup(page);
}

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
    for (const status of [undefined, "invalid", "error"]) {
      const html = await render(status);
      expect(html).toContain('data-pagefind-ignore="all"');
      expect(html).not.toContain("—");
    }
  });
});
