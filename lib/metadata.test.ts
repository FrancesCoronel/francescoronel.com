import { describe, expect, it, vi } from "vitest";
import { buildMetadata, siteConfig, YEARS_OF_EXPERIENCE } from "./metadata";

describe("siteConfig", () => {
  it("computes years of experience from 2017", () => {
    expect(YEARS_OF_EXPERIENCE).toBe(new Date().getFullYear() - 2017);
  });

  it("reads the GA4 id from the environment, defaulting to empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST123");
    vi.resetModules();
    const withId = await import("./metadata");
    expect(withId.siteConfig.ga4MeasurementId).toBe("G-TEST123");

    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "");
    vi.resetModules();
    const withoutId = await import("./metadata");
    expect(withoutId.siteConfig.ga4MeasurementId).toBe("");
  });
});

describe("buildMetadata", () => {
  it("returns site defaults when called without options", () => {
    const meta = buildMetadata();
    expect(meta.metadataBase).toEqual(new URL("https://francescoronel.com"));
    expect(meta.title).toEqual({ default: "Frances Coronel", template: "%s | Frances Coronel" });
    expect(meta.description).toBe(siteConfig.description);
    expect(meta.alternates).toBeUndefined();
    expect(meta.openGraph).toEqual({
      type: "website",
      locale: "en_US",
      url: "https://francescoronel.com",
      siteName: "Frances Coronel",
      title: "Frances Coronel",
      description: siteConfig.description,
      images: [
        {
          url: "https://francescoronel.com/images/og/home.jpg",
          width: 1200,
          height: 630,
          alt: "Frances Coronel",
        },
      ],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      creator: "@faborel",
      title: "Frances Coronel",
    });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it("uses page-specific values when provided", () => {
    const meta = buildMetadata({
      title: "My Post",
      description: "About my post",
      path: "/posts/my-post",
      ogImage: "https://example.com/og.png",
      ogType: "article",
      publishedTime: "2024-01-01",
      robots: { index: false, follow: false },
    });
    const image = { url: "https://example.com/og.png", width: 1200, height: 630, alt: "My Post" };
    expect(meta.title).toBe("My Post");
    expect(meta.description).toBe("About my post");
    expect(meta.alternates).toEqual({ canonical: "https://francescoronel.com/posts/my-post" });
    expect(meta.openGraph).toEqual({
      type: "article",
      locale: "en_US",
      url: "https://francescoronel.com/posts/my-post",
      siteName: "Frances Coronel",
      title: "My Post",
      description: "About my post",
      images: [image],
      publishedTime: "2024-01-01",
    });
    expect(meta.twitter).toMatchObject({ title: "My Post", description: "About my post", images: [image] });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
