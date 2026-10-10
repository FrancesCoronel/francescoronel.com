import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getAwards,
  getCategories,
  getEducation,
  getExperiences,
  getOrganizations,
  getTags,
} from "@/lib/content";
import sitemap from "./sitemap";

const base = "https://francescoronel.com";

describe("sitemap", () => {
  const entries = sitemap();
  const byUrl = new Map(entries.map((e) => [e.url, e]));

  it("lists static pages with the home page at top priority", () => {
    expect(entries[0]).toMatchObject({ url: base, priority: 1.0, changeFrequency: "weekly" });
    expect(byUrl.get(`${base}/about`)).toMatchObject({ priority: 0.8, changeFrequency: "weekly" });
    expect(byUrl.has(`${base}/now`)).toBe(true);
  });

  it("lists every post, ranking projects above blog posts", () => {
    const posts = getAllPosts();
    const post = posts.find((p) => p.postType === "post")!;
    const project = posts.find((p) => p.postType === "project")!;
    expect(byUrl.get(`${base}/posts/${post.slug}`)).toEqual({
      url: `${base}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
    expect(byUrl.get(`${base}/posts/${project.slug}`)).toMatchObject({ priority: 0.7 });
  });

  it("lists taxonomy, experience, education, award and organization pages", () => {
    const expected = [
      ...getCategories().map((c) => [`${base}/categories/${c.slug}`, 0.5]),
      ...getTags().map((t) => [`${base}/tags/${t.slug}`, 0.4]),
      ...getExperiences().map((e) => [`${base}/experience/${e.slug}`, 0.5]),
      ...getEducation().map((e) => [`${base}/education/${e.slug}`, 0.5]),
      ...getAwards().map((a) => [`${base}/awards/${a.slug}`, 0.5]),
      ...getOrganizations().map((o) => [`${base}/organizations/${o.slug}`, 0.5]),
    ];
    for (const [url, priority] of expected) {
      expect(byUrl.get(url as string)?.priority).toBe(priority);
    }
    expect(entries).toHaveLength(13 + getAllPosts().length + expected.length);
  });
});
