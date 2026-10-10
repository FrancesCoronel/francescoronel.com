import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CategoryPage, { generateMetadata, generateStaticParams } from "./page";
import * as content from "@/lib/content";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getBlogPostsByCategory: vi.fn(actual.getBlogPostsByCategory) };
});

afterEach(() => {
  vi.mocked(content.getBlogPostsByCategory).mockReset();
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("app/categories/[slug]/page", () => {
  it("generates a param for every category, including uncategorized", async () => {
    const result = await generateStaticParams();
    expect(result).toContainEqual({ slug: "speaking" });
    expect(result).toContainEqual({ slug: "uncategorized" });
    expect(result).toHaveLength(content.getCategories().length);
  });

  describe("generateMetadata", () => {
    it("returns an empty object for an unknown category", async () => {
      expect(await generateMetadata(params("nope"))).toEqual({});
    });

    it("uses a fallback description and the category image", async () => {
      const meta = await generateMetadata(params("speaking"));
      expect(meta.title).toBe("Speaking");
      expect(meta.description).toBe("Blog posts in the Speaking category.");
      expect(meta.alternates?.canonical).toBe("https://francescoronel.com/categories/speaking");
      const image = content.getCategoryBySlug("speaking")!.image;
      expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: image })]);
    });

    it("uses the category description and default image when it has no image", async () => {
      const meta = await generateMetadata(params("community"));
      expect(meta.description).toBe(content.getCategoryBySlug("community")!.description);
      expect(meta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
      ]);
    });
  });

  describe("page", () => {
    it("calls notFound for an unknown category", async () => {
      await expect(CategoryPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("renders a category with an image, fallback description and post list", async () => {
      const html = renderToStaticMarkup(await CategoryPage(params("speaking")));
      const posts = content.getBlogPostsByCategory("speaking");
      expect(html).toContain("Speaking");
      expect(html).toContain("Blog posts in the Speaking category.");
      expect(html).toContain(`${posts.length} posts`);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain(`href="/posts/${encodeURIComponent(posts[0].slug)}"`);
    });

    it("renders a category without an image using its own description", async () => {
      const html = renderToStaticMarkup(await CategoryPage(params("community")));
      expect(html).toContain(content.getCategoryBySlug("community")!.description);
      expect(html).not.toContain('class="inline-block h-10 w-10 object-contain"');
    });

    it("uses the singular label when there is exactly one post", async () => {
      const [one] = content.getAllBlogPosts();
      vi.mocked(content.getBlogPostsByCategory).mockReturnValue([one]);
      const html = renderToStaticMarkup(await CategoryPage(params("speaking")));
      expect(html).toContain("1 post<");
      expect(html).toContain(`href="/posts/${encodeURIComponent(one.slug)}"`);
    });
  });
});
