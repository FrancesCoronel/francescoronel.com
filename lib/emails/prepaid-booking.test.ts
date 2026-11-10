import { describe, expect, it } from "vitest";
import { BOOKING_URL, prepaidBookingEmail } from "./prepaid-booking";

describe("prepaidBookingEmail", () => {
  it("greets by first name and links to the booking page", () => {
    const { subject, text, html } = prepaidBookingEmail("  Ada   Lovelace ");
    expect(subject).toBe("Book your mentoring sessions 🗓️");
    expect(text).toContain("Hi Ada,");
    expect(text).toContain(BOOKING_URL);
    expect(html).toContain("Hi Ada,");
    expect(html).toContain(`href="${BOOKING_URL}"`);
  });

  it("falls back to a generic greeting without a name", () => {
    for (const name of [null, undefined, "", "   "]) {
      const { text, html } = prepaidBookingEmail(name);
      expect(text).toContain("Hi there,");
      expect(html).toContain("Hi there,");
      expect(html).not.toContain("Hi ,");
    }
  });

  it("escapes names before putting them in the HTML", () => {
    const { text, html } = prepaidBookingEmail(`<b>"Ada"&co</b> Lovelace`);
    expect(text).toContain(`Hi <b>"Ada"&co</b>,`);
    expect(html).toContain("Hi &lt;b&gt;&quot;Ada&quot;&amp;co&lt;/b&gt;,");
    expect(html).not.toContain("<b>");
  });

  it("uses design system colors and has no em dashes", () => {
    const { text, html } = prepaidBookingEmail("Ada");
    for (const token of ["#f9f5f3", "#253137", "#ca2e55", "#9e2b25"]) expect(html).toContain(token);
    expect(html + text).not.toContain("—");
  });
});
