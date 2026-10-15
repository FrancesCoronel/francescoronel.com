import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import EssaysPage, { metadata } from "./page";
import { getBlogPostsByCategory } from "@/lib/content";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getBlogPostsByCategory: vi.fn(actual.getBlogPostsByCategory) };
});

afterEach(() => {
  vi.mocked(getBlogPostsByCategory).mockReset();
});

describe("app/essays/page", () => {
  it("exports metadata for the essays listing", () => {
    expect(metadata.title).toBe("Essays");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/essays");
  });

  it("renders the header, essay count and every essay", () => {
    const essays = getBlogPostsByCategory("essays");
    const html = renderToStaticMarkup(<EssaysPage />);
    expect(html).toContain("Essays 🌳");
    expect(html).toContain(`${essays.length} essays`);
    expect(html).toContain('href="/posts"');
    for (const essay of essays) {
      expect(html).toContain(`href="/posts/${encodeURIComponent(essay.slug)}"`);
    }
  });

  it("uses the singular label when there is one essay", () => {
    const [first] = getBlogPostsByCategory("essays");
    vi.mocked(getBlogPostsByCategory).mockReturnValue([first]);
    const html = renderToStaticMarkup(<EssaysPage />);
    expect(html).toContain("1 essay<");
  });
});
