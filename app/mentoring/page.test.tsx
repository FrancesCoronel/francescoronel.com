import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getTestimonials } from "@/lib/content";
import type { Testimonial } from "@/lib/types";
import MentoringPage, { metadata } from "./page";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getTestimonials: vi.fn(actual.getTestimonials) };
});

afterEach(() => {
  vi.mocked(getTestimonials).mockReset();
});

const testimonial = (slug: string, role: string, quote: string): Testimonial => ({
  name: slug,
  slug,
  role,
  organization: "",
  quote,
  image: "",
  featured: false,
});

describe("app/mentoring/page", () => {
  it("exports metadata for the mentoring page", () => {
    expect(metadata.title).toBe("Mentoring");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/mentoring");
  });

  it("summarises session totals from the mentoring data", () => {
    const html = renderToStaticMarkup(<MentoringPage />);
    expect(html).toContain("Mentoring 💬");
    expect(html).toContain("561+ sessions and 260+ hours in.");
  });

  it("renders both pricing tiers and flags the featured one", () => {
    const html = renderToStaticMarkup(<MentoringPage />);
    expect(html).toContain('href="https://cal.com/francescoronel/mentoring"');
    expect(html).toContain('href="https://cal.com/francescoronel/mentoring-hour"');
    expect(html.match(/Most Popular/g)).toHaveLength(1);
    expect(html).toContain("$30");
    expect(html).toContain("$65");
    expect(html).not.toContain("line-through");
  });

  it("renders help topics, expertise areas and the refund policy", () => {
    const html = renderToStaticMarkup(<MentoringPage />);
    expect(html).toContain("How I Can Help 🚀");
    expect(html).toContain("Negotiate confidently");
    expect(html).toContain("Software Engineering Careers 💻");
    expect(html).toContain("Web performance optimization");
    expect(html).toContain("Refund Policy 📋");
  });

  it("shows up to six mentoring-related testimonials", () => {
    const mentoring = getTestimonials()
      .filter((t) => /mentor|career|guidance/.test(t.quote.toLowerCase()))
      .slice(0, 6);
    expect(mentoring.length).toBeGreaterThanOrEqual(3);
    const html = renderToStaticMarkup(<MentoringPage />);
    expect(html).toContain("What Mentees Say 💬");
    for (const t of mentoring) expect(html).toContain(`href="/testimonials/${t.slug}"`);
  });

  it("falls back to the first testimonials when fewer than three mention mentoring", () => {
    vi.mocked(getTestimonials).mockReturnValue([
      testimonial("a", "Role A", "Great mentor"),
      testimonial("b", "Role B", "Lovely person"),
      testimonial("c", "Role C", "Very kind"),
    ]);
    const html = renderToStaticMarkup(<MentoringPage />);
    for (const slug of ["a", "b", "c"]) expect(html).toContain(`href="/testimonials/${slug}"`);
  });
});
