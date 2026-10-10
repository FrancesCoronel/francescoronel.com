import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TagPage, { generateMetadata, generateStaticParams } from "./page";
import { getBlogPostsByTag, getTags } from "@/lib/content";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

const multiTag = getTags().find((t) => (t.count ?? 0) > 1)!;

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
      expect(meta.description).toBe("Blog posts tagged with AI.");
      expect(meta.alternates?.canonical).toBe("https://francescoronel.com/tags/ai");
    });
  });

  describe("page", () => {
    it("calls notFound for an unknown tag", async () => {
      await expect(TagPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("uses the singular label for a tag with one post", async () => {
      const html = renderToStaticMarkup(await TagPage(params("ai")));
      const [post] = getBlogPostsByTag("ai");
      expect(html).toContain("1 post tagged with AI.");
      expect(html).toContain(`href="/posts/${encodeURIComponent(post.slug)}"`);
    });

    it("uses the plural label for a tag with several posts", async () => {
      const html = renderToStaticMarkup(await TagPage(params(multiTag.slug)));
      expect(html).toContain(`${multiTag.count} posts tagged with ${multiTag.name}.`);
    });
  });
});
