import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PostPage, { generateMetadata, generateStaticParams } from "./page";
import * as content from "@/lib/content";
import { getRepoData, type RepoData } from "@/lib/github";
import type { Organization, Post } from "@/lib/types";
import nailedItEpisodes from "@/content/nailed-it-episodes.json";
import nailedItContestants from "@/content/nailed-it-contestants.json";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/github", () => ({
  getRepoData: vi.fn(async () => null),
}));

// Append an episode without a guest judge so the empty-cell fallback is exercised
vi.mock("@/content/nailed-it-episodes.json", async (importOriginal) => {
  const actual = await importOriginal<{ default: Record<string, unknown>[] }>();
  return {
    default: [
      ...actual.default,
      { name: "Judge-less Episode", season: 9, episode: 1, guestJudge: "", contestants: [], round1Challenge: "", round1Prize: "", round2Challenge: "" },
    ],
  };
});

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return {
    ...actual,
    getPost: vi.fn(actual.getPost),
    getAllPosts: vi.fn(actual.getAllPosts),
    getOrganizationBySlug: vi.fn(actual.getOrganizationBySlug),
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const render = async (slug: string) => renderToStaticMarkup(await PostPage(params(slug)));

/** Serves a synthetic post for its slug and falls through to real content for everything else */
function servePost(post: Post) {
  const real = vi.mocked(content.getPost).getMockImplementation()!;
  vi.mocked(content.getPost).mockImplementation((slug) => (slug === post.slug ? post : real(slug)));
}

const basePost: Post = {
  slug: "synthetic-post",
  title: "Synthetic Post",
  date: "2024-01-15",
  excerpt: "",
  featuredImage: "",
  categories: [],
  tags: [],
  organizations: [],
  skills: [],
  readingTime: "1 min read",
  content: "Just a paragraph.",
  postType: "post",
};

const baseProject: Post = {
  ...basePost,
  slug: "synthetic-project",
  title: "Synthetic Project",
  postType: "project",
  tagline: "A tagline",
};

const repo = (extra: Partial<RepoData> = {}): RepoData => ({
  stars: 0,
  forks: 0,
  openIssues: 0,
  language: null,
  topics: [],
  pushedAt: null,
  ...extra,
});

describe("app/posts/[slug]/page", () => {
  it("generates params for every blog post and JSON-only project", async () => {
    const result = await generateStaticParams();
    expect(result).toEqual(content.getPostSlugs().map((slug) => ({ slug })));
    expect(result).toContainEqual({ slug: "wordpress-website" });
  });

  describe("generateMetadata", () => {
    it("returns an empty object for an unknown slug", async () => {
      expect(await generateMetadata(params("nope"))).toEqual({});
    });

    it("uses the project logo as the og image", async () => {
      const meta = await generateMetadata(params("slack-lists-files-column"));
      expect(meta.alternates?.canonical).toBe("https://francescoronel.com/posts/slack-lists-files-column");
      expect(meta.openGraph).toEqual(expect.objectContaining({ type: "website" }));
      expect(meta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "/images/organizations/slack.png" }),
      ]);
    });

    it("falls back to the default image for a project without a logo", async () => {
      const meta = await generateMetadata(params("wordpress-website"));
      expect(meta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
      ]);
    });

    it("builds article metadata with the featured image for a blog post", async () => {
      const post = content.getPost("reflecting-on-2025-looking-ahead-to-2026")!;
      const meta = await generateMetadata(params(post.slug));
      expect(meta.title).toBe(post.title);
      expect(meta.openGraph).toEqual(
        expect.objectContaining({ type: "article", publishedTime: post.date }),
      );
      expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: post.featuredImage })]);
    });

    it("uses the default image for a blog post without a featured image", async () => {
      const meta = await generateMetadata(params("techquerias-job-board"));
      expect(meta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
      ]);
    });
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(PostPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
  });

  describe("blog post layout", () => {
    it("renders a rich post with MDX, categories, tags, organizations, TOC and related posts", async () => {
      const slug = "reflecting-on-2025-looking-ahead-to-2026";
      const post = content.getPost(slug)!;
      const html = await render(slug);
      expect(html).toContain(`<time dateTime="${post.date}">`);
      expect(html).toContain(post.readingTime);
      expect(html).toContain("xl:grid xl:grid-cols-[minmax(0,1fr)_220px]");
      expect(html).toContain('<aside class="hidden xl:block">');
      expect(html).toContain(`href="/categories/${post.categories[0]}"`);
      expect(html).toContain(`href="/tags/${post.tags[0]}"`);
      expect(html).toContain('href="/organizations/sourcegraph"');
      expect(html).toContain("/_next/image?url=");
      expect(html).toContain("Related Posts");
      expect(html).toContain("Written by");
      // MDX compiled into real headings with ids from rehype-slug
      expect(html).toMatch(/<h2 class="[^"]*" id="[^"]+">/);
      expect(html).not.toContain("whitespace-pre-wrap font-mono");
    });

    it("treats a missing featured image as no image", async () => {
      servePost({ ...basePost, featuredImage: undefined as unknown as string });
      const html = await render(basePost.slug);
      expect(html).not.toContain("mx-auto mb-10");
    });

    it("falls back to raw text when MDX fails to compile", async () => {
      servePost({ ...basePost, content: "Broken {expression without end" });
      const html = await render(basePost.slug);
      expect(html).toContain('<div class="whitespace-pre-wrap font-mono text-sm leading-relaxed">Broken {expression without end</div>');
    });

    it("renders a minimal post without excerpt, categories, tags, image, orgs, TOC or related posts", async () => {
      servePost(basePost);
      vi.mocked(content.getAllPosts).mockReturnValue([{ ...basePost, date: "1990-01-01" }]);
      const html = await render(basePost.slug);
      expect(html).toContain("Just a paragraph.");
      expect(html).not.toContain("xl:grid-cols-[minmax(0,1fr)_220px]");
      expect(html).not.toContain("<aside");
      expect(html).not.toContain('href="/categories/');
      expect(html).not.toContain("Tags 🏷️");
      expect(html).not.toContain("Organizations 🏢");
      expect(html).not.toContain("Related Posts");
      expect(html).not.toContain("mx-auto mb-10");
    });

    it("prefixes protocol-relative images and uses <img> for unoptimizable hosts", async () => {
      const orgs: Record<string, Organization> = {
        relative: { name: "Relative Org", slug: "relative", logo: "//example.com/logo.png", url: "", type: "community", description: "" },
        local: { name: "Local Org", slug: "local", logo: "/images/organizations/slack.png", url: "", type: "community", description: "" },
      };
      vi.mocked(content.getOrganizationBySlug).mockImplementation((slug) => orgs[slug]);
      servePost({
        ...basePost,
        excerpt: "An excerpt",
        featuredImage: "//example.com/featured.jpg",
        categories: ["community", "speaking"],
        organizations: ["relative", "local", "missing"],
      });
      const html = await render(basePost.slug);
      expect(html).toContain("An excerpt");
      expect(html).toContain('<img src="https://example.com/featured.jpg" alt="" class="mx-auto mb-10 max-w-full rounded-xl"/>');
      expect(html).toContain('<img src="https://example.com/logo.png" alt="" class="h-8 w-8 rounded object-contain"/>');
      expect(html).toContain("Local Org");
      expect(html).not.toContain("/organizations/missing");
      // "community" has no category image, "speaking" does
      expect(html).toMatch(/>Community<\/a>/);
      expect(html).toMatch(/>Speaking<img/);
    });

    it("links prev/next posts around the current one", async () => {
      const all = content.getAllPosts();
      const first = await render(all[0].slug);
      expect(first).toContain(`/posts/${all[1].slug}`);
      const last = await render(all[all.length - 1].slug);
      expect(last).toContain(`/posts/${all[all.length - 2].slug}`);
    });
  });

  describe("project layout", () => {
    it("omits the next link when the project is the last post", async () => {
      const all = content.getAllPosts();
      const project = { ...baseProject };
      servePost(project);
      vi.mocked(content.getAllPosts).mockReturnValue([all[0], project]);
      const html = await render(project.slug);
      expect(html).toContain(`/posts/${all[0].slug}`);
    });

    it("renders a fully populated project with GitHub data", async () => {
      vi.mocked(getRepoData).mockResolvedValue(
        repo({ stars: 1500, forks: 12, openIssues: 3, language: "TypeScript", topics: ["nextjs", "a11y"], pushedAt: "2024-03-10T00:00:00Z" }),
      );
      servePost({
        ...baseProject,
        logo: "/images/organizations/slack.png",
        projectCategory: "open-source",
        status: "active",
        startDate: "2020-01-01",
        endDate: "2021-06-01",
        projectUrl: "https://example.com",
        github: "owner/repo",
        excerpt: "Different overview",
        highlights: ["Did a thing", "GitHub: should be hidden"],
        skills: ["React", "C++"],
        organization: "slack",
      });
      const html = await render(baseProject.slug);
      expect(getRepoData).toHaveBeenCalledWith("owner/repo");
      expect(html).toContain(">Open Source</span>");
      expect(html).toContain(">Active</span>");
      expect(html).toContain('href="https://example.com"');
      expect(html).toContain('<span class="font-mono text-xs">repo</span>');
      expect(html).toContain("1,500");
      expect(html).toContain("Different overview");
      expect(html).toContain("Did a thing");
      expect(html).not.toContain("should be hidden");
      expect(html).toContain("Written in TypeScript");
      expect(html).toContain("1,500 stars on GitHub");
      expect(html).toContain("12 forks");
      expect(html).toContain("3 open issues");
      expect(html).toContain("Last updated March 2024");
      expect(html).toContain(">nextjs</span>");
      expect(html).toContain('href="/projects?skill=C%2B%2B"');
      expect(html).toContain('href="/organizations/slack"');
      expect(html).toContain(">Slack</span>");
    });

    it("renders a sparse project with emoji fallback and no GitHub stats", async () => {
      vi.mocked(getRepoData).mockResolvedValue(repo({ openIssues: 1 }));
      servePost({
        ...baseProject,
        excerpt: baseProject.tagline!,
        projectCategory: "mystery" as Post["projectCategory"],
        github: "norepo",
        organization: "not-an-org",
      });
      const html = await render(baseProject.slug);
      expect(html).toContain("🛠️");
      expect(html).toContain(">mystery</span>");
      expect(html).toContain('<span class="font-mono text-xs">norepo</span>');
      expect(html).toContain("1 open issue<");
      expect(html).not.toContain("Overview");
      expect(html).not.toContain("stars on GitHub");
      expect(html).not.toContain("Written in");
      expect(html).not.toContain("Skills &amp; Tags");
      expect(html).toContain(">not-an-org</span>");
    });

    it("renders a project without GitHub, category, highlights or organization", async () => {
      servePost({ ...baseProject, emoji: "🧪", excerpt: "" });
      const html = await render(baseProject.slug);
      expect(getRepoData).not.toHaveBeenCalled();
      expect(html).toContain("🧪");
      expect(html).not.toContain("GitHub 🐙");
      expect(html).not.toContain("Highlights");
      expect(html).not.toContain("Organization 🏢");
      expect(html).not.toContain("View Project");
    });

    it("renders a project whose GitHub lookup fails", async () => {
      servePost({ ...baseProject, github: "owner/gone", startDate: "2019-01-01" });
      const html = await render(baseProject.slug);
      expect(html).toContain("GitHub 🐙");
      expect(html).toContain(">owner/gone</span>");
      expect(html).not.toContain("divide-x divide-y");
    });

    it("renders the Nailed It! episode and contestant tables", async () => {
      const html = await render("nailed-it-tracker");
      expect(html).toContain(`${nailedItEpisodes.length} total`);
      expect(html).toContain(`${nailedItContestants.length} total`);
      expect(html).toContain(nailedItEpisodes[0].name);
      expect(html).toContain("Judge-less Episode");
      expect(html).toContain("✓");
    });

    it("renders a real JSON project with zeroed GitHub stats", async () => {
      vi.mocked(getRepoData).mockResolvedValue(repo());
      const html = await render("wordpress-website");
      expect(html).toContain("divide-x divide-y");
      expect(html).not.toContain("open issue");
      expect(html).not.toContain(">stars</span>");
      expect(html).toContain("📝");
      expect(html).toContain('href="https://github.com/FrancesCoronel/wordpress-website"');
    });
  });
});
