import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TagPage, { generateMetadata, generateStaticParams } from "./page";
import { getExperiencesBySkill, getPostsByTag, getTags } from "@/lib/content";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

const tags = getTags();
const postsOf = (slug: string) => getPostsByTag(slug).length;
const rolesOf = (slug: string) => getExperiencesBySkill(slug).length;
// Real content: a tag with one post and no roles, one with several posts, one with both, one with roles only
const onePostTag = tags.find((t) => postsOf(t.slug) === 1 && rolesOf(t.slug) === 0)!;
const multiTag = tags.find((t) => postsOf(t.slug) > 1 && rolesOf(t.slug) === 0)!;
const mixedTag = tags.find((t) => postsOf(t.slug) > 1 && rolesOf(t.slug) === 1)!;
const rolesOnlyTag = tags.find((t) => postsOf(t.slug) === 0 && rolesOf(t.slug) > 1)!;

describe("app/tags/[slug]/page", () => {
  it("generates a param for every tag", async () => {
    const result = await generateStaticParams();
    expect(result).toHaveLength(getTags().length);
    expect(result).toContainEqual({ slug: "ai" });
  });

  describe("generateMetadata", () => {
    it("returns an empty object for an unknown tag", async () => {
      expect(await generateMetadata(params("nope"))).toEqual({});
    });

    it("builds metadata for a known tag", async () => {
      const meta = await generateMetadata(params("ai"));
      expect(meta.title).toBe("AI");
      expect(meta.description).toBe("Posts, projects and roles tagged with AI.");
      expect(meta.alternates?.canonical).toBe("https://francescoronel.com/tags/ai");
    });
  });

  describe("page", () => {
    it("calls notFound for an unknown tag", async () => {
      await expect(TagPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("uses the singular label for a tag with one post", async () => {
      const html = renderToStaticMarkup(await TagPage(params(onePostTag.slug)));
      const [post] = getPostsByTag(onePostTag.slug);
      expect(html).toContain(`1 post tagged with ${onePostTag.name}.`);
      expect(html).toContain(`href="/posts/${encodeURIComponent(post.slug)}"`);
      expect(html).not.toContain("Where I Used It");
    });

    it("uses the plural label for a tag with several posts", async () => {
      const html = renderToStaticMarkup(await TagPage(params(multiTag.slug)));
      expect(html).toContain(`${multiTag.count} posts tagged with ${multiTag.name}.`);
    });

    it("lists roles under the posts for a tag that has both", async () => {
      const html = renderToStaticMarkup(await TagPage(params(mixedTag.slug)));
      const [role] = getExperiencesBySkill(mixedTag.slug);
      expect(html).toContain(`${postsOf(mixedTag.slug)} posts and 1 role tagged with ${mixedTag.name}.`);
      expect(html).toContain(`href="/experience/${role.slug}"`);
      // Roles follow the posts section, so they take the light background
      expect(html).toContain('<section class="bg-horchata-50 py-16');
    });

    it("gives a skill with roles but no posts its own tag page", async () => {
      expect(await generateStaticParams()).toContainEqual({ slug: rolesOnlyTag.slug });
      const html = renderToStaticMarkup(await TagPage(params(rolesOnlyTag.slug)));
      expect(html).toContain(`${rolesOf(rolesOnlyTag.slug)} roles tagged with ${rolesOnlyTag.name}.`);
      expect(html).toContain("Where I Used It");
      // No posts section above it, so the roles section is the dark one
      expect(html).not.toContain('<section class="bg-horchata-50 py-16');
    });
  });
});
