import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getTestimonialBySlug, getTestimonials } from "@/lib/content";
import TestimonialPage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getTestimonialBySlug: vi.fn(actual.getTestimonialBySlug) };
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

afterEach(() => {
  vi.mocked(getTestimonialBySlug).mockReset();
});

describe("app/testimonials/[slug]/page", () => {
  it("generates a static param for every testimonial", async () => {
    const result = await generateStaticParams();
    expect(result).toHaveLength(getTestimonials().length);
    expect(result[0]).toEqual({ slug: "glenda-robson" });
  });

  it("builds noindex metadata including the organization", async () => {
    const t = getTestimonialBySlug("esteban-ordonez")!;
    const meta = await generateMetadata(params("esteban-ordonez"));
    expect(meta.title).toBe("Testimonial: Mentor at Fullstack Academy");
    expect(meta.description).toBe(`${t.quote.slice(0, 160)}...`);
    expect(meta.alternates?.canonical).toBe("https://francescoronel.com/testimonials/esteban-ordonez");
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("leaves the organization out of the title when there is none", async () => {
    const meta = await generateMetadata(params("adilene-constante"));
    expect(meta.title).toBe("Testimonial: Software Engineer");
  });

  it("returns empty metadata for an unknown slug", async () => {
    expect(await generateMetadata(params("nobody"))).toEqual({});
  });

  it("links a known organization and shows both neighbours", async () => {
    const all = getTestimonials();
    const i = all.findIndex((t) => t.slug === "esteban-ordonez");
    const html = renderToStaticMarkup(await TestimonialPage(params("esteban-ordonez")));
    expect(html).toContain("Mentor at ");
    expect(html).toContain('href="/organizations/fullstack-academy"');
    expect(html).toContain(`href="/testimonials/${all[i - 1].slug}"`);
    expect(html).toContain(`href="/testimonials/${all[i + 1].slug}"`);
    // The name is rendered client-side only, so SSR output is an empty heading
    expect(html).toMatch(/<h1 class="[^"]*" aria-hidden="true"><\/h1>/);
  });

  it("splits the quote into paragraphs on blank lines and --- separators", async () => {
    const t = getTestimonialBySlug("glenda-robson")!;
    const expected = t.quote.split(/\n{2,}|---/).map((p) => p.trim()).filter(Boolean);
    const html = renderToStaticMarkup(await TestimonialPage(params("glenda-robson")));
    const blockquote = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)![1];
    expect(blockquote.match(/<p /g)).toHaveLength(expected.length);
    expect(expected.length).toBeGreaterThan(1);
  });

  it("shows an unlinked organization and no previous link for the first testimonial", async () => {
    const html = renderToStaticMarkup(await TestimonialPage(params("glenda-robson")));
    expect(html).toContain("Web Developer at Self-Employed");
    expect(html).not.toContain("← Previous");
    expect(html).toContain("Next →");
  });

  it("omits the organization and next link for the last testimonial without an org", async () => {
    const all = getTestimonials();
    const last = all[all.length - 1];
    vi.mocked(getTestimonialBySlug).mockReturnValue({
      ...last,
      organization: "",
      image: "/images/testimonials/wen.jpg",
    });
    const html = renderToStaticMarkup(await TestimonialPage(params(last.slug)));
    expect(html).toContain(`>${last.role}</p>`);
    expect(html).not.toContain(" at ");
    expect(html).toContain(`alt="${last.name}"`);
    expect(html).toContain("← Previous");
    expect(html).not.toContain("Next →");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(TestimonialPage(params("nobody"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
