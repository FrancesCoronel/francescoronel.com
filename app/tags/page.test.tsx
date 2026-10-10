import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TagsPage, { metadata } from "./page";
import * as content from "@/lib/content";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getTags: vi.fn(actual.getTags) };
});

afterEach(() => {
  vi.mocked(content.getTags).mockReset();
});

describe("app/tags/page", () => {
  it("exports metadata for the tags index", () => {
    expect(metadata.title).toBe("Tags");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/tags");
  });

  it("renders real tags that have posts and hides empty ones", () => {
    const html = renderToStaticMarkup(<TagsPage />);
    expect(html).toContain("Tags 🏷️");
    expect(html).toContain('href="/tags/ai"');
    expect(html).not.toContain('href="/tags/personal-life"');
  });

  it("sorts by count descending and treats a missing count as zero", () => {
    vi.mocked(content.getTags).mockReturnValue([
      { name: "Few", slug: "few", count: 1 },
      { name: "None", slug: "none" },
      { name: "Many", slug: "many", count: 9 },
    ]);
    const html = renderToStaticMarkup(<TagsPage />);
    expect(html.indexOf('href="/tags/many"')).toBeLessThan(html.indexOf('href="/tags/few"'));
    expect(html).toContain(">9</span>");
    expect(html).not.toContain("/tags/none");
  });
});
