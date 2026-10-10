import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getEducation, getEducationBySlug } from "@/lib/content";
import EducationPage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getEducationBySlug: vi.fn(actual.getEducationBySlug) };
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

afterEach(() => {
  vi.mocked(getEducationBySlug).mockReset();
});

describe("app/education/[slug]/page", () => {
  it("generates a static param for every education entry", async () => {
    const result = await generateStaticParams();
    expect(result).toHaveLength(getEducation().length);
    expect(result).toContainEqual({ slug: "cornell-tech" });
  });

  it("builds metadata from degree, institution and logo", async () => {
    const edu = getEducationBySlug("cornell-tech")!;
    const meta = await generateMetadata(params("cornell-tech"));
    expect(meta.title).toBe(`${edu.degree} at ${edu.institution}`);
    expect(meta.description).toBe(edu.description);
    expect(meta.alternates?.canonical).toBe("https://francescoronel.com/education/cornell-tech");
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: edu.logo })]);
  });

  it("uses the default OG image when the entry has no logo", async () => {
    const meta = await generateMetadata(params("elc-peer-group-2025"));
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
    ]);
  });

  it("returns empty metadata for an unknown slug", async () => {
    expect(await generateMetadata(params("nope"))).toEqual({});
  });

  it("renders logo, linked organization, honors and institution link", async () => {
    const edu = getEducationBySlug("cornell-tech")!;
    const html = renderToStaticMarkup(await EducationPage(params("cornell-tech")));
    expect(html).toContain('href="/about#education"');
    expect(html).toContain(`alt="${edu.institution}"`);
    expect(html).toContain('href="/organizations/cornell-tech"');
    expect(html).toContain("Honors &amp; Activities 🎖️");
    expect(html.match(/rounded-full bg-horchata-400/g)).toHaveLength(edu.honors.length);
    expect(html).toContain(`href="${edu.url}"`);
    expect(html).toContain("Visit institution");
  });

  it("renders a plain institution label and no honors when data is missing", async () => {
    const html = renderToStaticMarkup(await EducationPage(params("elc-peer-group-2025")));
    expect(html).toContain("Peer Group Program — Engineering Leadership");
    expect(html).toContain(
      '<span class="rounded-full bg-horchata-100 px-3 py-1 text-sm font-medium text-navy-700 dark:bg-navy-800 dark:text-horchata-300">ELC (Engineering Leadership Community)</span>',
    );
    expect(html).not.toContain("Honors &amp; Activities");
    expect(html).not.toContain('alt="ELC (Engineering Leadership Community)"');
  });

  it("omits the institution link when there is no url", async () => {
    vi.mocked(getEducationBySlug).mockReturnValue({
      institution: "Nowhere College",
      slug: "nowhere",
      degree: "BA",
      field: "Things",
      logo: "",
      url: "",
      startDate: "2010-01-01",
      endDate: "2012-01-01",
      description: "Studied things.",
      honors: [],
    });
    const html = renderToStaticMarkup(await EducationPage(params("nowhere")));
    expect(html).toContain("Studied things.");
    expect(html).not.toContain("Visit institution");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(EducationPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
