import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getAllBlogPosts, getAwards, getBlogPostsByCategory, getTestimonials } from "@/lib/content";
import { YEARS_OF_EXPERIENCE } from "@/lib/metadata";
import ContactPage, { metadata } from "./page";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getAllBlogPosts: vi.fn(actual.getAllBlogPosts) };
});

afterEach(() => {
  vi.mocked(getAllBlogPosts).mockReset();
});

/** Mirrors the page's rounding so the assertions follow the real content */
const roundDown = (n: number) =>
  n >= 1000 ? Math.floor(n / 1000) * 1000 : n >= 100 ? Math.floor(n / 100) * 100 : Math.floor(n / 10) * 10;

function statFor(html: string, label: string) {
  const match = html.match(new RegExp(`>([^<]+)</p><p[^>]*>${label}</p>`));
  return match?.[1];
}

describe("app/contact/page", () => {
  it("exports metadata for the contact page", () => {
    expect(metadata.title).toBe("Contact");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/contact");
  });

  it("renders rounded impact stats from the real content", () => {
    const html = renderToStaticMarkup(<ContactPage />);
    expect(html).toContain("Contact 📨");
    expect(statFor(html, "Mentoring sessions")).toBe("500+");
    expect(statFor(html, "Blog posts")).toBe(`${roundDown(getAllBlogPosts().length)}+`);
    expect(statFor(html, "Speaking events")).toBe(`${roundDown(getBlogPostsByCategory("speaking").length)}+`);
    expect(statFor(html, "Years of experience")).toBe(`${YEARS_OF_EXPERIENCE}+`);
    expect(statFor(html, "Awards &amp; recognition")).toBe(`${roundDown(getAwards().length)}+`);
    expect(statFor(html, "Testimonials")).toBe(`${roundDown(getTestimonials().length)}+`);
    // 27 awards rounds to the nearest ten, not the nearest hundred
    expect(statFor(html, "Awards &amp; recognition")).toBe("20+");
  });

  it("rounds counts of a thousand or more down to the nearest thousand", () => {
    vi.mocked(getAllBlogPosts).mockReturnValue(
      new Array(1234).fill(null) as unknown as ReturnType<typeof getAllBlogPosts>,
    );
    const html = renderToStaticMarkup(<ContactPage />);
    expect(statFor(html, "Blog posts")).toBe("1000+");
  });

  it("links each stat card and every social profile", () => {
    const html = renderToStaticMarkup(<ContactPage />);
    for (const href of ["/mentoring", "/posts", "/speaking", "/about#experience", "/awards", "/testimonials"]) {
      expect(html).toContain(`href="${href}"`);
    }
    for (const label of ["LinkedIn", "GitHub", "Bluesky", "YouTube", "Discord", "Reddit", "Product Hunt"]) {
      expect(html).toContain(`aria-label="${label}"`);
    }
    expect(html).toContain("Send me a message 💌");
    expect(html).toContain("<form");
  });
});
