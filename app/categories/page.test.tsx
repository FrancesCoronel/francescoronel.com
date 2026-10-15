import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CategoriesPage, { metadata } from "./page";
import * as content from "@/lib/content";
import type { Category } from "@/lib/types";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getCategories: vi.fn(actual.getCategories) };
});

afterEach(() => {
  vi.mocked(content.getCategories).mockReset();
});

const cat = (slug: string, count: number | undefined, extra: Partial<Category> = {}): Category => ({
  name: slug.toUpperCase(),
  slug,
  color: "#000",
  description: "",
  count,
  ...extra,
});

describe("app/categories/page", () => {
  it("exports metadata for the categories index", () => {
    expect(metadata.title).toBe("Categories");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/categories");
  });

  it("renders real categories with counts, images and descriptions, skipping empty ones", () => {
    const html = renderToStaticMarkup(<CategoriesPage />);
    expect(html).toContain("Categories 📂");
    expect(html).toContain('href="/categories/speaking"');
    expect(html).toContain('href="/categories/community"');
    // "uncategorized" has zero posts in the real content
    expect(html).not.toContain('href="/categories/uncategorized"');
    // Sorted by count: portfolio (most posts) comes before speaking
    expect(html.indexOf('href="/categories/portfolio"')).toBeLessThan(
      html.indexOf('href="/categories/speaking"'),
    );
  });

  it("sorts uncategorized last regardless of count and drops undefined counts", () => {
    vi.mocked(content.getCategories).mockReturnValue([
      cat("alpha", 2),
      cat("uncategorized", 50),
      cat("beta", 5, { image: "/beta.png", description: "Beta things" }),
      cat("ghost", undefined),
      cat("gamma", 3),
    ]);
    const html = renderToStaticMarkup(<CategoriesPage />);
    const order = ["beta", "gamma", "alpha", "uncategorized"].map((s) =>
      html.indexOf(`href="/categories/${s}"`),
    );
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html).not.toContain("/categories/ghost");
    expect(html).toContain('src="/beta.png"');
    expect(html).toContain("Beta things");
  });

  it("keeps uncategorized last when it is compared as the first argument", () => {
    vi.mocked(content.getCategories).mockReturnValue([
      cat("uncategorized", 1),
      cat("alpha", 1),
    ]);
    const html = renderToStaticMarkup(<CategoriesPage />);
    expect(html.indexOf("/categories/alpha")).toBeLessThan(html.indexOf("/categories/uncategorized"));
  });
});
