import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getExperienceBySlug, getExperiences } from "@/lib/content";
import ExperiencePage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getExperienceBySlug: vi.fn(actual.getExperienceBySlug) };
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

afterEach(() => {
  vi.mocked(getExperienceBySlug).mockReset();
});

describe("app/experience/[slug]/page", () => {
  it("generates a static param for every experience", async () => {
    const result = await generateStaticParams();
    expect(result).toHaveLength(getExperiences().length);
    expect(result).toContainEqual({ slug: "slack-lists" });
  });

  it("builds metadata from title, company and logo", async () => {
    const exp = getExperienceBySlug("slack-lists")!;
    const meta = await generateMetadata(params("slack-lists"));
    expect(meta.title).toBe(`${exp.title} at ${exp.company}`);
    expect(meta.description).toBe(exp.description);
    expect(meta.alternates?.canonical).toBe("https://francescoronel.com/experience/slack-lists");
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: exp.companyLogo })]);
  });

  it("uses the default OG image when there is no company logo", async () => {
    vi.mocked(getExperienceBySlug).mockReturnValue({
      ...getExperiences()[0],
      companyLogo: "",
    });
    const meta = await generateMetadata(params("whatever"));
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
    ]);
  });

  it("returns empty metadata for an unknown slug", async () => {
    expect(await generateMetadata(params("nope"))).toEqual({});
  });

  it("renders a full experience with org link, highlights and skills", async () => {
    const exp = getExperienceBySlug("slack-lists")!;
    const html = renderToStaticMarkup(await ExperiencePage(params("slack-lists")));
    expect(html).toContain('href="/about"');
    expect(html).toContain(`alt="${exp.company}"`);
    expect(html).toContain('href="/organizations/slack"');
    expect(html).toContain(` · ${exp.location}`);
    expect(html).toContain("Overview");
    expect(html).toContain("Highlights");
    for (const skill of exp.skills) expect(html).toContain(`>${skill}</span>`);
  });

  it("renders the company as plain text when it has no organization page", async () => {
    const html = renderToStaticMarkup(await ExperiencePage(params("springboard-2023")));
    expect(html).toContain("Software Engineering Mentor");
    expect(html).toContain(">Springboard</p>");
    expect(html).not.toContain('href="/organizations/springboard"');
  });

  it("hides optional sections when the experience is sparse", async () => {
    vi.mocked(getExperienceBySlug).mockReturnValue({
      title: "Consultant",
      slug: "sparse",
      company: "Unknown Co",
      companyLogo: "",
      companyUrl: "",
      location: "",
      startDate: "2019-01-01",
      endDate: null,
      description: "",
      highlights: [],
      skills: [],
    });
    const html = renderToStaticMarkup(await ExperiencePage(params("sparse")));
    expect(html).toContain("Consultant");
    expect(html).not.toContain('alt="Unknown Co"');
    expect(html).not.toContain(" · ");
    expect(html).not.toContain("Overview");
    expect(html).not.toContain(">Highlights<");
    expect(html).not.toContain(">Skills<");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(ExperiencePage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
