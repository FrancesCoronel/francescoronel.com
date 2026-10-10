import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getBlogPostsByCategory, getProjects } from "@/lib/content";
import type { Project } from "@/lib/types";
import PortfolioPage, { metadata } from "./page";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return {
    ...actual,
    getBlogPostsByCategory: vi.fn(actual.getBlogPostsByCategory),
    getProjects: vi.fn(actual.getProjects),
  };
});

afterEach(() => {
  vi.mocked(getBlogPostsByCategory).mockReset();
  vi.mocked(getProjects).mockReset();
});

const project = (overrides: Partial<Project>): Project => ({
  title: "Project",
  slug: "project",
  tagline: "A project",
  description: "",
  highlights: [],
  skills: [],
  logo: "",
  url: "",
  startDate: "2020-01-01",
  endDate: null,
  category: "side-project",
  ...overrides,
});

describe("app/portfolio/page", () => {
  it("exports metadata for the portfolio page", () => {
    expect(metadata.title).toBe("Portfolio");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/portfolio");
  });

  it("shows the six most recent projects and the portfolio post count", () => {
    const projects = getProjects();
    const count = getBlogPostsByCategory("portfolio").length;
    const html = renderToStaticMarkup(<PortfolioPage />);
    expect(html).toContain("Portfolio 🗂️");
    expect(html).toContain('href="/projects"');
    for (const p of projects.slice(0, 6)) expect(html).toContain(`href="/posts/${p.slug}"`);
    expect(html.match(/group flex flex-col overflow-hidden rounded-2xl/g)).toHaveLength(6);
    expect(html).toContain(`${count} items`);
  });

  it("renders each project card variant", () => {
    vi.mocked(getProjects).mockReturnValue([
      project({ slug: "with-image", title: "With Image", featuredImage: "/images/p/hero.png", category: "podcast", status: "active" }),
      project({ slug: "with-logo", title: "With Logo", logo: "/images/p/logo.png", category: "hackathon" }),
      project({ slug: "with-emoji", title: "With Emoji", emoji: "🎉", category: "open-source" }),
      project({ slug: "bare", title: "Bare", category: "mystery" as Project["category"] }),
    ]);
    const html = renderToStaticMarkup(<PortfolioPage />);
    expect(html).toContain('alt="With Image"');
    expect(html).toContain('alt="With Logo"');
    expect(html).toContain('<span class="text-5xl">🎉</span>');
    expect(html).toContain('<span class="text-5xl">🛠️</span>');
    expect(html).toContain(">Podcast</span>");
    expect(html).toContain(">Hackathon</span>");
    expect(html).toContain(">Open Source</span>");
    // Unknown categories show their raw name with side-project styling
    expect(html).toContain('bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300">mystery</span>');
    expect(html.match(/>Active<\/span>/g)).toHaveLength(1);
  });

  it("uses the singular label for a single portfolio post", () => {
    const [first] = getBlogPostsByCategory("portfolio");
    vi.mocked(getBlogPostsByCategory).mockReturnValue([first]);
    const html = renderToStaticMarkup(<PortfolioPage />);
    expect(html).toContain(">1 item</p>");
  });
});
