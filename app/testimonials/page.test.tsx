import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getTestimonials } from "@/lib/content";
import TestimonialsPage, { metadata } from "./page";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getTestimonials: vi.fn(actual.getTestimonials) };
});

afterEach(() => {
  vi.mocked(getTestimonials).mockReset();
});

describe("app/testimonials/page", () => {
  it("exports noindex metadata for the testimonials index", () => {
    expect(metadata.title).toBe("Testimonials");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/testimonials");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders the testimonials list", () => {
    const html = renderToStaticMarkup(<TestimonialsPage />);
    expect(html).toContain("Testimonials ✅");
    expect(html).toContain("Reviews");
    expect(html).toContain("Web Developer");
    expect(html).not.toContain("Testimonials coming soon.");
  });

  it("shows a placeholder when there are no testimonials", () => {
    vi.mocked(getTestimonials).mockReturnValue([]);
    const html = renderToStaticMarkup(<TestimonialsPage />);
    expect(html).toContain("Testimonials coming soon.");
  });
});
