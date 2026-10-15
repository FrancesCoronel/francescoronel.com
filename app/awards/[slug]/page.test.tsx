import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getAwardBySlug, getAwards } from "@/lib/content";
import AwardPage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getAwardBySlug: vi.fn(actual.getAwardBySlug) };
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

afterEach(() => {
  vi.mocked(getAwardBySlug).mockReset();
});

describe("app/awards/[slug]/page", () => {
  it("generates a static param for every award", async () => {
    const result = await generateStaticParams();
    expect(result).toHaveLength(getAwards().length);
    expect(result).toContainEqual({ slug: "latinos-40-under-40" });
  });

  it("builds metadata with the award image as the OG image", async () => {
    const award = getAwardBySlug("latinos-40-under-40")!;
    const meta = await generateMetadata(params("latinos-40-under-40"));
    expect(meta.title).toBe(award.title);
    expect(meta.description).toBe(award.description);
    expect(meta.alternates?.canonical).toBe("https://francescoronel.com/awards/latinos-40-under-40");
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: award.image }),
    ]);
  });

  it("falls back to the default OG image when the award has no image", async () => {
    const meta = await generateMetadata(params("ricardo-salinas-scholar"));
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
    ]);
  });

  it("returns empty metadata for an unknown award", async () => {
    expect(await generateMetadata(params("does-not-exist"))).toEqual({});
  });

  it("renders the award with its image and external link", async () => {
    const award = getAwardBySlug("latinos-40-under-40")!;
    const html = renderToStaticMarkup(await AwardPage(params("latinos-40-under-40")));
    expect(html).toContain('href="/about#awards"');
    expect(html).toContain("Recognition");
    expect(html).toContain("Latinos 40 Under 40™ Class of 2025 for San Francisco/Silicon Valley 🏆");
    expect(html).toContain("May 15, 2025");
    expect(html).toContain(`alt="${award.title}"`);
    expect(html).toContain(`href="${award.url}"`);
    expect(html).toContain("Learn more");
  });

  it("omits the image and link when the award has neither", async () => {
    vi.mocked(getAwardBySlug).mockReturnValue({
      title: "Plain Award",
      slug: "plain-award",
      organization: "Some Org",
      date: "2020-01-02",
      description: "No frills.",
      image: "",
      url: "",
    });
    const html = renderToStaticMarkup(await AwardPage(params("plain-award")));
    expect(html).toContain("Plain Award 🏆");
    expect(html).toContain("Some Org");
    expect(html).toContain("No frills.");
    expect(html).not.toContain('alt="Plain Award"');
    expect(html).not.toContain("Learn more");
  });

  it("calls notFound for an unknown award", async () => {
    await expect(AwardPage(params("does-not-exist"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
