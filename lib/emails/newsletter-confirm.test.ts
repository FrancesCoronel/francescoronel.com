import { describe, expect, it } from "vitest";
import { newsletterConfirmEmail } from "./newsletter-confirm";

const CONFIRM_URL = "https://francescoronel.com/api/newsletter/confirm?token=abc.def";

describe("newsletterConfirmEmail", () => {
  it("links the confirm button and the fallback text to the confirm URL", () => {
    const { subject, text, html } = newsletterConfirmEmail(CONFIRM_URL);
    expect(subject).toBe("Confirm your subscription 📬");
    expect(text).toContain(CONFIRM_URL);
    expect(html.split(`href="${CONFIRM_URL}"`)).toHaveLength(3);
    expect(html).toContain("Confirm subscription</a>");
  });

  it("escapes the URL before putting it in the HTML", () => {
    const { html } = newsletterConfirmEmail(`https://x.test/?a=1&b="<i>"`);
    expect(html).toContain("https://x.test/?a=1&amp;b=&quot;&lt;i&gt;&quot;");
    expect(html).not.toContain("<i>");
  });

  it("uses design system colors and has no em dashes", () => {
    const { text, html } = newsletterConfirmEmail(CONFIRM_URL);
    for (const token of ["#f9f5f3", "#253137", "#ca2e55"]) expect(html).toContain(token);
    expect(html + text).not.toContain("—");
  });
});
