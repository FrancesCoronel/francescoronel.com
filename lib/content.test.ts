import fs from "fs";
import os from "os";
import path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

type ContentModule = typeof import("./content");

// lib/content.ts resolves its content dir from process.cwd() at import time and
// caches results in module state, so each fixture gets a fresh module instance.
async function loadContent(root: string): Promise<ContentModule> {
  vi.resetModules();
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(root);
  try {
    return await import("./content");
  } finally {
    cwd.mockRestore();
  }
}

function writeFiles(root: string, files: Record<string, string>) {
  for (const [rel, body] of Object.entries(files)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  }
}

const json = (value: unknown) => JSON.stringify(value);

let tmp: string;

beforeAll(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-test-"));
});

afterAll(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("content loaders with a fixture content directory", () => {
  let root: string;
  let content: ContentModule;

  beforeAll(async () => {
    root = path.join(tmp, "full");
    writeFiles(root, {
      "content/posts/alpha.mdx": [
        "---",
        "title: Alpha",
        "slug: alpha-custom",
        "date: 2024-03-01",
        "excerpt: Hand-written excerpt",
        "featuredImage: /images/alpha.png",
        "categories: [web]",
        "tags: [react]",
        "organizations: [acme]",
        "skills: [typescript]",
        "externalUrl: https://example.com/alpha",
        "source: webflow",
        "---",
        "Alpha body text.",
      ].join("\n"),
      "content/posts/beta.mdx": [
        "---",
        "title: Beta",
        "date: 2022-01-01",
        "type: project",
        "logo: /images/beta-logo.png",
        "tagline: Beta tagline",
        "highlights: [Fast]",
        "emoji: 🚀",
        "projectUrl: https://beta.example.com",
        "startDate: 2021-06-01",
        "endDate: 2022-01-01",
        "projectCategory: side-project",
        "status: complete",
        "github: someone/beta",
        "organization: acme",
        "---",
        "## A *heading*",
        "",
        "Some **bold** text with `code` and a [link](https://x.y).",
      ].join("\n"),
      "content/posts/gamma.mdx": ["---", "title: Gamma", "date: 2020-01-01", "---", ""].join("\n"),
      "content/posts/secret.mdx": ["---", "title: Secret", "date: 2023-01-01", "draft: true", "---", "Hidden"].join("\n"),
      "content/posts/notes.txt": "not a post",
      "content/projects.json": json([
        {
          title: "Old Project",
          slug: "proj-old",
          tagline: "Old tagline",
          description: "",
          highlights: [],
          skills: ["python"],
          logo: "",
          url: "https://old.example.com",
          startDate: "2010-01-01",
          endDate: "2011-01-01",
          category: "hackathon",
        },
        {
          title: "New Project",
          slug: "proj-new",
          tagline: "New tagline",
          description: "New description",
          highlights: ["Shipped"],
          skills: ["react"],
          logo: "/images/new.png",
          emoji: "✨",
          url: "https://new.example.com",
          startDate: "2025-01-01",
          endDate: null,
          category: "open-source",
          status: "active",
          github: "someone/new",
          organization: "acme",
        },
        {
          title: "Beta Project",
          slug: "beta",
          tagline: "Dup",
          description: "Duplicate of an MDX post",
          highlights: [],
          skills: [],
          logo: "",
          url: "",
          startDate: "2021-06-01",
          endDate: null,
          category: "side-project",
        },
      ]),
      "content/categories.json": json([
        { name: "Web", slug: "web", color: "#000", description: "Web", image: "/images/web.png" },
        { name: "Design", slug: "design", color: "#111", description: "Design" },
      ]),
      "content/tags.json": json([
        { name: "React", slug: "react" },
        { name: "Vue", slug: "vue" },
      ]),
      "content/organizations.json": json([
        { name: "Other Org", slug: "other", logo: "", url: "", type: "community", description: "" },
        { name: "Acme Corp", slug: "acme", logo: "", url: "", type: "employer", description: "" },
        { name: "Quiet Org", slug: "quiet", logo: "", url: "", type: "community", description: "" },
      ]),
      "content/experience.json": json([
        { title: "Engineer", slug: "eng-old", company: "Acme Corp", startDate: "2015-01-01", endDate: "2016-01-01" },
        { title: "Lead", slug: "lead-new", company: "Other Org", startDate: "2020-01-01", endDate: null },
      ]),
      "content/education.json": json([
        { institution: "acme corp", slug: "acme-academy", startDate: "2010-01-01", endDate: "2012-01-01" },
        { institution: "State U", slug: "state-u", startDate: "2013-01-01", endDate: "2015-01-01" },
      ]),
      "content/awards.json": json([
        { title: "Older Award", slug: "older", organization: "ACME CORP", date: "2018-01-01" },
        { title: "Newer Award", slug: "newer", organization: "Other Org", date: "2021-01-01" },
      ]),
      "content/testimonials.json": json([
        { name: "Pat", slug: "pat", organization: "Acme Corp", quote: "Great" },
        { name: "Sam", slug: "sam", organization: "Elsewhere", quote: "Nice" },
      ]),
      "content/skills.json": "{ not valid json",
    });
    // A directory with a .mdx name exists but cannot be read as a file
    fs.mkdirSync(path.join(root, "content/posts/folder.mdx"), { recursive: true });
    content = await loadContent(root);
  });

  it("lists .mdx slugs only", () => {
    expect(content.getBlogSlugs().sort()).toEqual(
      ["alpha", "beta", "folder", "gamma", "secret"],
    );
  });

  it("parses a fully specified post", () => {
    const post = content.getBlogPost("alpha");
    expect(post).toMatchObject({
      slug: "alpha-custom",
      title: "Alpha",
      excerpt: "Hand-written excerpt",
      featuredImage: "/images/alpha.png",
      categories: ["web"],
      tags: ["react"],
      organizations: ["acme"],
      skills: ["typescript"],
      externalUrl: "https://example.com/alpha",
      source: "webflow",
      postType: "post",
      readingTime: "1 min read",
    });
    expect(post?.content.trim()).toBe("Alpha body text.");
  });

  it("derives defaults and project fields from sparse frontmatter", () => {
    const post = content.getBlogPost("beta");
    expect(post).toMatchObject({
      slug: "beta",
      excerpt: "A heading Some bold text with code and a linkhttps://x.y.",
      featuredImage: "/images/beta-logo.png",
      categories: [],
      tags: [],
      organizations: [],
      skills: [],
      postType: "project",
      tagline: "Beta tagline",
      highlights: ["Fast"],
      logo: "/images/beta-logo.png",
      emoji: "🚀",
      projectUrl: "https://beta.example.com",
      projectCategory: "side-project",
      status: "complete",
      github: "someone/beta",
      organization: "acme",
    });
  });

  it("falls back to empty excerpt and image when there is nothing to use", () => {
    const post = content.getBlogPost("gamma");
    expect(post?.excerpt).toBe("");
    expect(post?.featuredImage).toBe("");
  });

  it("hides drafts unless asked for them", () => {
    expect(content.getBlogPost("secret")).toBeNull();
    expect(content.getBlogPost("secret", { includeDrafts: true })?.title).toBe("Secret");
  });

  it("returns null for missing, unreadable and unparseable posts", () => {
    expect(content.getBlogPost("does-not-exist")).toBeNull();
    expect(content.getBlogPost("folder")).toBeNull();
  });

  it("returns published posts newest first and caches the result", () => {
    const posts = content.getAllBlogPosts();
    expect(posts.map((p) => p.title)).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(content.getAllBlogPosts()).toBe(posts);
  });

  it("filters posts by category, the uncategorized bucket and tag", () => {
    expect(content.getBlogPostsByCategory("web").map((p) => p.title)).toEqual(["Alpha"]);
    expect(content.getBlogPostsByCategory("uncategorized").map((p) => p.title)).toEqual(["Beta", "Gamma"]);
    expect(content.getBlogPostsByTag("react").map((p) => p.title)).toEqual(["Alpha"]);
    expect(content.getBlogPostsByTag("vue")).toEqual([]);
  });

  it("loads JSON data, caching it and treating invalid JSON as empty", () => {
    expect(content.getTestimonials().map((t) => t.slug)).toEqual(["pat", "sam"]);
    expect(content.getTestimonials()).toBe(content.getTestimonials());
    expect(content.getOrganizations()).toHaveLength(3);
    expect(content.getSkills()).toEqual([]);
  });

  it("sorts dated collections newest first", () => {
    expect(content.getAwards().map((a) => a.slug)).toEqual(["newer", "older"]);
    expect(content.getExperiences().map((e) => e.slug)).toEqual(["lead-new", "eng-old"]);
    expect(content.getEducation().map((e) => e.slug)).toEqual(["state-u", "acme-academy"]);
    expect(content.getProjects().map((p) => p.slug)).toEqual(["proj-new", "beta", "proj-old"]);
  });

  it("adds post counts and an Uncategorized bucket to categories", () => {
    expect(content.getCategories()).toEqual([
      expect.objectContaining({ slug: "web", count: 1 }),
      expect.objectContaining({ slug: "design", count: 0 }),
      expect.objectContaining({ slug: "uncategorized", name: "Uncategorized", count: 2 }),
    ]);
    expect(content.getCategoryMaps()).toEqual({ categoryImages: { web: "/images/web.png" } });
  });

  it("adds post counts to tags", () => {
    expect(content.getTags()).toEqual([
      { name: "React", slug: "react", count: 1 },
      { name: "Vue", slug: "vue", count: 0 },
    ]);
  });

  it("orders organizations by how many posts reference them", () => {
    expect(content.getOrganizationsByActivity().map((o) => o.slug)).toEqual(["acme", "other", "quiet"]);
    expect(content.EXCLUDED_FROM_FEATURED_ORGS.has("accenture")).toBe(true);
  });

  it("looks up single records by slug and organization by name", () => {
    expect(content.getExperienceBySlug("eng-old")?.title).toBe("Engineer");
    expect(content.getEducationBySlug("state-u")?.institution).toBe("State U");
    expect(content.getAwardBySlug("older")?.title).toBe("Older Award");
    expect(content.getCategoryBySlug("uncategorized")?.count).toBe(2);
    expect(content.getTagBySlug("react")?.count).toBe(1);
    expect(content.getTestimonialBySlug("sam")?.name).toBe("Sam");
    expect(content.getOrganizationBySlug("acme")?.name).toBe("Acme Corp");
    expect(content.getProjectBySlug("proj-old")?.title).toBe("Old Project");
    expect(content.getOrganizationByName("ACME corp")?.slug).toBe("acme");
    expect(content.getExperienceBySlug("nope")).toBeUndefined();
    expect(content.getOrganizationByName("Nobody")).toBeUndefined();
  });

  it("resolves a post from MDX first, then projects, then null", () => {
    expect(content.getPost("beta")?.title).toBe("Beta");
    expect(content.getPost("proj-new")).toMatchObject({
      slug: "proj-new",
      date: "2025-01-01",
      excerpt: "New description",
      featuredImage: "/images/new.png",
      categories: ["open-source"],
      tags: ["react"],
      organizations: ["acme"],
      readingTime: "",
      content: "",
      postType: "project",
      projectUrl: "https://new.example.com",
      projectCategory: "open-source",
      status: "active",
      github: "someone/new",
    });
    expect(content.getPost("proj-old")).toMatchObject({
      excerpt: "Old tagline",
      featuredImage: "",
      organizations: [],
    });
    expect(content.getPost("missing")).toBeNull();
  });

  it("lists MDX slugs plus project slugs that have no MDX file", () => {
    expect(content.getPostSlugs().sort()).toEqual(
      ["alpha", "beta", "folder", "gamma", "proj-new", "proj-old", "secret"],
    );
  });

  it("merges MDX posts and JSON-only projects by date and caches the result", () => {
    const all = content.getAllPosts();
    expect(all.map((p) => p.slug)).toEqual(["proj-new", "alpha-custom", "beta", "gamma", "proj-old"]);
    expect(content.getAllPosts()).toBe(all);
  });

  it("collects everything tied to an organization", () => {
    const result = content.getContentByOrganization("acme");
    expect(result?.org.name).toBe("Acme Corp");
    expect(result?.posts.map((p) => p.title)).toEqual(["Alpha"]);
    expect(result?.experiences.map((e) => e.slug)).toEqual(["eng-old"]);
    expect(result?.testimonials.map((t) => t.slug)).toEqual(["pat"]);
    expect(result?.awards.map((a) => a.slug)).toEqual(["older"]);
    expect(result?.education.map((e) => e.slug)).toEqual(["acme-academy"]);
    expect(result?.projects.map((p) => p.slug)).toEqual(["proj-new"]);
    expect(content.getContentByOrganization("missing")).toBeNull();
  });
});

describe("content loaders with an empty content directory", () => {
  it("returns empty results when no posts or data files exist", async () => {
    const root = path.join(tmp, "empty");
    fs.mkdirSync(root, { recursive: true });
    const content = await loadContent(root);
    expect(content.getBlogSlugs()).toEqual([]);
    expect(content.getBlogPost("anything")).toBeNull();
    expect(content.getAllBlogPosts()).toEqual([]);
    expect(content.getProjects()).toEqual([]);
    expect(content.getCategories()).toEqual([
      expect.objectContaining({ slug: "uncategorized", count: 0 }),
    ]);
  });

  it("returns null when frontmatter cannot be parsed", async () => {
    const root = path.join(tmp, "broken");
    writeFiles(root, {
      "content/posts/broken.mdx": ["---", "title: [unclosed", "---", "Body"].join("\n"),
    });
    const content = await loadContent(root);
    expect(content.getBlogPost("broken")).toBeNull();
    // A second parse of the same text must fail too, not come back as an empty post
    expect(content.getBlogPost("broken")).toBeNull();
  });

  it("keeps remaining MDX posts when there are no projects to merge", async () => {
    const root = path.join(tmp, "posts-only");
    writeFiles(root, {
      "content/posts/one.mdx": ["---", "title: One", "date: 2020-01-01", "---", "One"].join("\n"),
      "content/posts/two.mdx": ["---", "title: Two", "date: 2021-01-01", "---", "Two"].join("\n"),
    });
    const content = await loadContent(root);
    expect(content.getAllPosts().map((p) => p.slug)).toEqual(["two", "one"]);
  });
});

describe("content loaders with the real site content", () => {
  let content: ContentModule;

  beforeAll(async () => {
    vi.resetModules();
    content = await import("./content");
  });

  it("loads published posts sorted newest first", () => {
    const posts = content.getAllBlogPosts();
    expect(posts.length).toBeGreaterThan(100);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });

  it("includes every MDX slug and project in the unified lists", () => {
    const slugs = content.getPostSlugs();
    expect(slugs).toEqual(expect.arrayContaining(content.getBlogSlugs()));
    const project = content.getProjects()[0];
    expect(content.getPost(project.slug)?.title).toBeTruthy();
    expect(content.getAllPosts().length).toBeGreaterThanOrEqual(content.getAllBlogPosts().length);
  });

  it("finds content for each organization with matching slugs", () => {
    const org = content.getOrganizationsByActivity()[0];
    const result = content.getContentByOrganization(org.slug);
    expect(result?.org).toEqual(org);
    expect(result?.posts.every((p) => p.organizations.some((o) => o.toLowerCase() === org.slug))).toBe(true);
  });
});
