import { describe, expect, it } from "vitest";
import { CHAR_LIMITS, DEFAULT_SERVICES, buildAssets, buildText } from "./crosspost-social.js";

describe("crosspost-social", () => {
  it("defaults to LinkedIn and Substack", () => {
    expect(DEFAULT_SERVICES).toBe("linkedin,substack");
  });

  it("keeps Substack notes within 500 characters", () => {
    const text = buildText("substack", {
      title: "A title",
      intro: "word ".repeat(200),
      url: "https://www.francescoronel.com/posts/a-title",
    });
    expect(CHAR_LIMITS.substack).toBe(500);
    expect(text.length).toBeLessThanOrEqual(500);
    expect(text.startsWith("A title\n\n")).toBe(true);
    expect(text.endsWith("\n\nhttps://www.francescoronel.com/posts/a-title")).toBe(true);
  });

  it("attaches the featured image as a full URL with the title as alt text", () => {
    expect(buildAssets({ featuredImage: "/images/blog/a.jpg", title: "A title" })).toEqual([
      {
        image: {
          url: "https://www.francescoronel.com/images/blog/a.jpg",
          metadata: { altText: "A title" },
        },
      },
    ]);
  });

  it("keeps full image URLs unchanged", () => {
    const [asset] = buildAssets({ featuredImage: "https://cdn.example.com/a.png", title: "T" });
    expect(asset.image.url).toBe("https://cdn.example.com/a.png");
  });

  it("sends no assets without a featured image", () => {
    expect(buildAssets({ featuredImage: "", title: "T" })).toEqual([]);
    expect(buildAssets({ featuredImage: undefined, title: "T" })).toEqual([]);
  });
});
