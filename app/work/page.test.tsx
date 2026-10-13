import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getBlogPostsByCategory, getProjects } from "@/lib/content";
import { getMultipleRepoStars } from "@/lib/github";
import type { Project } from "@/lib/types";
import WorkPage, { metadata } from "./page";

vi.mock("@/lib/github", () => ({
  getMultipleRepoStars: vi.fn(async () => ({})),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getProjects: vi.fn(actual.getProjects) };
});

afterEach(() => {
  vi.mocked(getProjects).mockReset();
  vi.mocked(getMultipleRepoStars).mockReset();
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

describe("app/work/page", () => {
  it("exports metadata for the work page", () => {
    expect(metadata.title).toBe("Work");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/work");
  });

  it("requests stars for every project with a GitHub repo", async () => {
    vi.mocked(getMultipleRepoStars).mockResolvedValue({});
    await WorkPage();
    const withRepo = getProjects().filter((p) => p.github);
    const [repos] = vi.mocked(getMultipleRepoStars).mock.calls[0];
    expect(Object.keys(repos)).toHaveLength(withRepo.length);
    expect(repos["latina-dev"]).toBe("Latina-Dev/latina-dev");
  });

  it("renders featured projects and portfolio posts without a stars bar when nothing is tracked", async () => {
    vi.mocked(getMultipleRepoStars).mockResolvedValue({ "latina-dev": null });
    const html = renderToStaticMarkup(await WorkPage());
    expect(html).toContain("Work 🛠️");
    for (const slug of ["latina-dev", "apprenticeships-me", "hire-me"]) {
      expect(html).toContain(`href="/posts/${slug}"`);
    }
    expect(html).not.toContain("total GitHub stars");
    expect(html).not.toContain(" stars</div>");
    expect(html).toContain(`(${getBlogPostsByCategory("portfolio").length})`);
  });

  it("totals stars across repos and shows per-project counts", async () => {
    vi.mocked(getMultipleRepoStars).mockResolvedValue({
      "latina-dev": 1200,
      "hire-me": 34,
      "apprenticeships-me": null,
    });
    const html = renderToStaticMarkup(await WorkPage());
    expect(html).toContain('<span class="font-semibold text-navy-700 dark:text-white/80">1,234</span>total GitHub stars');
    expect(html).toContain('<span class="font-semibold text-navy-700 dark:text-white/80">2</span>repos tracked');
    expect(html).toContain("</svg>1,200 stars</div>");
    expect(html).toContain("</svg>34 stars</div>");
  });

  it("renders logo, placeholder, status and category variants for featured projects", async () => {
    vi.mocked(getMultipleRepoStars).mockResolvedValue({});
    vi.mocked(getProjects).mockReturnValue([
      project({ slug: "latina-dev", title: "Latina Dev", logo: "/images/p/latina.png", category: "open-source", status: "active" }),
      project({ slug: "hire-me", title: "Hire Me", category: "mystery" as Project["category"], status: "archived" }),
      project({ slug: "not-featured", title: "Not Featured" }),
    ]);
    const html = renderToStaticMarkup(await WorkPage());
    expect(html).toContain('alt="Latina Dev"');
    expect(html).toContain('dark:bg-navy-700">🛠️</div>');
    expect(html).toContain(">Open Source</span>");
    expect(html).toContain('dark:text-horchata-300">mystery</span>');
    expect(html.match(/>Active<\/span>/g)).toHaveLength(1);
    expect(html).not.toContain("Not Featured");
  });
});
