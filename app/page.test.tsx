import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage, { metadata } from "./page";
import * as content from "@/lib/content";
import { getMultipleRepoStars } from "@/lib/github";
import { YEARS_OF_EXPERIENCE } from "@/lib/metadata";
import type { Education, Project, WorkExperience } from "@/lib/types";

vi.mock("@/lib/github", () => ({
  getMultipleRepoStars: vi.fn(async (repos: Record<string, string>) =>
    Object.fromEntries(Object.keys(repos).map((slug) => [slug, 1234])),
  ),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return {
    ...actual,
    getAllBlogPosts: vi.fn(actual.getAllBlogPosts),
    getBlogPostsByCategory: vi.fn(actual.getBlogPostsByCategory),
    getExperiences: vi.fn(actual.getExperiences),
    getEducation: vi.fn(actual.getEducation),
    getProjects: vi.fn(actual.getProjects),
    getAwards: vi.fn(actual.getAwards),
    getTestimonials: vi.fn(actual.getTestimonials),
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

const render = async () => renderToStaticMarkup(await HomePage());

const experience = (title: string, company: string, extra: Partial<WorkExperience> = {}): WorkExperience => ({
  title,
  slug: title.toLowerCase().replace(/\s+/g, "-"),
  company,
  companyLogo: "",
  companyUrl: "",
  location: "",
  startDate: "2020-01-01",
  endDate: null,
  description: "",
  highlights: [],
  skills: [],
  ...extra,
});

const education = (degree: string, extra: Partial<Education> = {}): Education => ({
  institution: "Test U",
  slug: degree.toLowerCase().replace(/\s+/g, "-"),
  degree,
  field: "",
  logo: "",
  url: "",
  startDate: "2010-01-01",
  endDate: "2014-01-01",
  description: "",
  honors: [],
  ...extra,
});

const project = (slug: string, extra: Partial<Project> = {}): Project => ({
  title: `Project ${slug}`,
  slug,
  tagline: `Tagline ${slug}`,
  description: "",
  highlights: [],
  skills: [],
  logo: "",
  url: "",
  startDate: "2020-01-01",
  endDate: null,
  category: "open-source",
  ...extra,
});

describe("app/page (home)", () => {
  it("exports profile metadata for the home page", () => {
    expect(metadata.openGraph).toEqual(expect.objectContaining({ type: "profile" }));
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/");
  });

  it("renders every section from real content", async () => {
    const html = await render();
    const [latest] = content.getAllBlogPosts();
    expect(html).toContain("Latest Posts ✍🏽");
    expect(html).toContain(`href="/posts/${encodeURIComponent(latest.slug)}"`);
    expect(html).toContain("Experience 💼");
    expect(html).toContain("Degrees 🎓");
    expect(html).toContain('href="/education/');
    expect(html).toContain("Featured Projects ⭐");
    const latinaDev = content.getProjects().find((p) => p.slug === "latina-dev")!;
    expect(html).toContain(`aria-label="${latinaDev.title}"`);
    expect(html).toContain("1,234");
    expect(html).toContain(">Active</span>");
    expect(html).toContain(`${YEARS_OF_EXPERIENCE}+`);
    expect(getMultipleRepoStars).toHaveBeenCalledWith({
      "latina-dev": "Latina-Dev/latina-dev",
      "apprenticeships-me": "FrancesCoronel/apprenticeships",
      "hire-me": "FrancesCoronel/hire-me",
    });
  });

  it("filters out non-core roles and links experience to known organizations", async () => {
    vi.mocked(content.getExperiences).mockReturnValue([
      experience("Mentor", "Slack"),
      experience("Managing Partner", "Slack"),
      experience("Ambassador", "Slack"),
      experience("Instructor", "Slack"),
      experience("Curriculum Developer", "Slack"),
      experience("Engineer", "Slack", { companyLogo: "/slack.png" }),
      experience("Builder", "Nowhere Inc"),
    ]);
    const html = await render();
    expect(html).toContain("Engineer");
    expect(html).toContain("Builder");
    expect(html).not.toContain("Managing Partner");
    expect(html).not.toContain("Curriculum Developer");
    expect(html).toContain('href="/organizations/slack"');
    expect(html).toContain('href="/experience/engineer"');
    expect(html).toContain('href="/experience/builder"');
  });

  it("shows only bachelor and master degrees with optional logo and description", async () => {
    vi.mocked(content.getEducation).mockReturnValue([
      education("Bachelor of Science", { logo: "/bs.png", description: "Undergrad years" }),
      education("Master of Science"),
      education("Certificate in Things"),
    ]);
    const html = await render();
    expect(html).toContain('href="/education/bachelor-of-science"');
    expect(html).toContain('href="/education/master-of-science"');
    expect(html).not.toContain("Certificate in Things");
    expect(html).toContain("Undergrad years");
    expect(html.match(/alt="Test U"/g)).toHaveLength(1);
  });

  it("renders featured projects without logo, stars or active status", async () => {
    vi.mocked(getMultipleRepoStars).mockResolvedValue({ "latina-dev": 0 });
    vi.mocked(content.getProjects).mockReturnValue([
      project("latina-dev", { emoji: "🦙", github: "x/latina-dev" }),
      project("hire-me", { status: "archived" }),
    ]);
    const html = await render();
    expect(getMultipleRepoStars).toHaveBeenCalledWith({ "latina-dev": "x/latina-dev" });
    expect(html).toContain("🦙");
    expect(html).toContain('<span class="text-xl">🛠️</span>');
    expect(html).toContain('aria-label="Project hire-me"');
    expect(html).not.toContain("apprenticeships-me");
    expect(html).not.toContain(">Active</span>");
    expect(html).not.toContain("fill-current text-horchata-500");
  });

  it("hides empty sections and rounds small stat counts down to tens and thousands", async () => {
    const posts = content.getAllBlogPosts();
    vi.mocked(content.getAllBlogPosts).mockReturnValue([]);
    vi.mocked(content.getExperiences).mockReturnValue([]);
    vi.mocked(content.getEducation).mockReturnValue([]);
    vi.mocked(content.getProjects).mockReturnValue([]);
    vi.mocked(content.getBlogPostsByCategory).mockReturnValue(posts.slice(0, 15));
    vi.mocked(content.getAwards).mockReturnValue(Array(1500).fill(content.getAwards()[0]));
    vi.mocked(content.getTestimonials).mockReturnValue([]);
    const html = await render();
    expect(html).not.toContain("Latest Posts");
    expect(html).not.toContain("View all positions");
    expect(html).not.toContain("Degrees 🎓");
    expect(html).not.toContain("Featured Projects");
    expect(html).toContain("Impact at a Glance 📊");
    expect(html).toMatch(/>0\+<\/p><p[^>]*>Blog posts/);
    expect(html).toMatch(/>10\+<\/p><p[^>]*>Speaking events/);
    expect(html).toMatch(/>1000\+<\/p><p[^>]*>Awards &amp; recognition/);
  });
});
