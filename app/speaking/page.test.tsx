import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getBlogPostsByCategory, getOrganizations, getTestimonials } from "@/lib/content";
import type { Organization, Testimonial } from "@/lib/types";
import SpeakingPage, { metadata } from "./page";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return {
    ...actual,
    getOrganizations: vi.fn(actual.getOrganizations),
    getTestimonials: vi.fn(actual.getTestimonials),
  };
});

afterEach(() => {
  vi.mocked(getOrganizations).mockReset();
  vi.mocked(getTestimonials).mockReset();
});

const testimonial = (slug: string, quote: string): Testimonial => ({
  name: slug,
  slug,
  role: "Engineer",
  organization: "",
  quote,
  image: "",
  featured: false,
});

describe("app/speaking/page", () => {
  it("exports metadata for the speaking page", () => {
    expect(metadata.title).toBe("Speaking");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/speaking");
  });

  it("links featured talks to their blog posts, with topics", () => {
    const html = renderToStaticMarkup(<SpeakingPage />);
    expect(html).toContain("Featured Talks 🎤");
    expect(html).toContain('href="/blog/speaking-at-dreamforce-exploring-ai-agents-in-slack"');
    expect(html).toContain("Exploring AI Agents in Slack");
    expect(html).toContain(">Future of Work</span>");
  });

  it("links a talk without a post to the organization's website", () => {
    const stanford = getOrganizations().find((o) => o.slug === "stanford-university")!;
    const html = renderToStaticMarkup(<SpeakingPage />);
    expect(html).toContain(`href="${stanford.url}"`);
  });

  it("matches orgs by name when the slug differs and falls back to the org page", () => {
    const dreamforce: Organization = {
      name: "Dreamforce",
      slug: "dreamforce-conf",
      logo: "/images/organizations/dreamforce.png",
      url: "https://dreamforce.example",
      type: "conference",
      description: "",
    };
    vi.mocked(getOrganizations).mockReturnValue([dreamforce]);
    const html = renderToStaticMarkup(<SpeakingPage />);
    // Matched by name: logo is used
    expect(html).toContain("dreamforce.png");
    // Stanford has no org entry and no post, so it links to the internal org page
    expect(html).toContain('href="/organizations/stanford-university"');
  });

  it("lists past speaking events with a count", () => {
    const count = getBlogPostsByCategory("speaking").length;
    const html = renderToStaticMarkup(<SpeakingPage />);
    expect(html).toContain(`Past Events 📅 <span class="text-base font-normal text-navy-600 dark:text-white/60 sm:text-lg">(${count})</span>`);
  });

  it("shows speaking-related testimonials when there are at least three", () => {
    vi.mocked(getTestimonials).mockReturnValue([
      testimonial("one", "Great talk"),
      testimonial("two", "Wonderful panel"),
      testimonial("plain", "Nice person"),
      testimonial("three", "Excellent keynote"),
    ]);
    const html = renderToStaticMarkup(<SpeakingPage />);
    expect(html).toContain("What Attendees Say");
    for (const slug of ["one", "two", "three"]) expect(html).toContain(`href="/testimonials/${slug}"`);
    expect(html).not.toContain('href="/testimonials/plain"');
  });

  it("falls back to the first three testimonials otherwise", () => {
    vi.mocked(getTestimonials).mockReturnValue([
      testimonial("a", "Kind"),
      testimonial("b", "Helpful"),
      testimonial("c", "Great talk"),
      testimonial("d", "Smart"),
    ]);
    const html = renderToStaticMarkup(<SpeakingPage />);
    for (const slug of ["a", "b", "c"]) expect(html).toContain(`href="/testimonials/${slug}"`);
    expect(html).not.toContain('href="/testimonials/d"');
  });
});
