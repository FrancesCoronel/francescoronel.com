import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MentoringThankYouPage, { metadata } from "./page";

describe("app/mentoring/thank-you/page", () => {
  it("exports noindex metadata for the booking confirmation", () => {
    expect(metadata.title).toBe("Thank You for Booking");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/mentoring/thank-you");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("confirms the booking and lists the next steps", () => {
    const html = renderToStaticMarkup(<MentoringThankYouPage />);
    expect(html).toContain("Booking Confirmed");
    expect(html).toContain("Thank You 🎉");
    expect(html).toContain("What Happens Next 🗓️");
    expect(html.match(/<li /g)).toHaveLength(3);
    expect(html).toContain("Check your inbox");
  });

  it("links back to mentoring and contact, and stays out of site search", () => {
    const html = renderToStaticMarkup(<MentoringThankYouPage />);
    expect(html).toContain('href="/mentoring"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('data-pagefind-ignore="all"');
    expect(html).not.toContain("—");
  });
});
