import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage, { metadata } from "./page";
import * as content from "@/lib/content";
import skills from "@/content/skills.json";
import * as skillIcon from "@/components/ui/skill-icon";
import type { Testimonial } from "@/lib/types";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return {
    ...actual,
    getTestimonials: vi.fn(actual.getTestimonials),
    getEducation: vi.fn(actual.getEducation),
    getAwards: vi.fn(actual.getAwards),
  };
});

vi.mock("@/components/ui/skill-icon", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/skill-icon")>();
  return { ...actual, getSkillUrl: vi.fn(actual.getSkillUrl) };
});

afterEach(() => {
  vi.resetAllMocks();
});

const { getSkillUrl: actualGetSkillUrl } = await vi.importActual<typeof import("@/components/ui/skill-icon")>(
  "@/components/ui/skill-icon",
);

const render = () => renderToStaticMarkup(<AboutPage />);

describe("app/about/page", () => {
  it("exports metadata for the about page", () => {
    expect(metadata.title).toBe("About");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/about");
  });

  it("renders the header, bio, timelines and stats", () => {
    const html = render();
    expect(html).toContain("About 👩🏽‍💻");
    expect(html).toContain('href="https://linkedin.com/in/francescoronel"');
    expect(html).toContain("Short Bio");
    expect(html).toContain('id="experience"');
    expect(html).toContain('id="education"');
    expect(html).toContain('id="awards"');
    expect(html).toContain("Impact at a Glance 📊");
    expect(html).toContain('href="#experience"');
    // Experiences of type "project" are not part of the timeline
    const projectExp = content.getExperiences().find((e) => e.type === "project");
    if (projectExp) expect(html).not.toContain(`href="/experience/${projectExp.slug}"`);
    const employment = content.getExperiences().find((e) => e.type !== "project")!;
    expect(html).toContain(`href="/experience/${employment.slug}"`);
  });

  it("renders skills as internal links, external links or plain chips", () => {
    const internal = skills.find((s) => actualGetSkillUrl(s.slug)?.startsWith("/"))!;
    const external = skills.find((s) => actualGetSkillUrl(s.slug)?.startsWith("http"))!;
    const plain = skills.find((s) => s !== internal && s !== external)!;
    vi.mocked(skillIcon.getSkillUrl).mockImplementation((slug) =>
      slug === plain.slug ? null : actualGetSkillUrl(slug),
    );
    const html = render();
    expect(html).toContain(`href="${actualGetSkillUrl(internal.slug)}"`);
    expect(html).toContain(`href="${actualGetSkillUrl(external.slug)}" target="_blank" rel="noopener noreferrer"`);
    const chip = html.slice(html.indexOf("cursor-default"));
    expect(chip.slice(0, chip.indexOf("inline-flex"))).toContain(`${plain.name.replace(/&/g, "&amp;")}</span>`);
    expect(html.match(/cursor-default/g)).toHaveLength(1);
  });

  it("links education to organizations only when the institution is known", () => {
    vi.mocked(content.getEducation).mockReturnValue([
      {
        institution: "Cornell Tech",
        slug: "known-degree",
        degree: "",
        field: "",
        logo: "",
        url: "",
        startDate: "2019-01-01",
        endDate: "2020-01-01",
        description: "",
        honors: [],
      },
      {
        institution: "Mystery Academy",
        slug: "mystery",
        degree: "Diploma",
        field: "",
        logo: "",
        url: "",
        startDate: "2000-01-01",
        endDate: "2001-01-01",
        description: "",
        honors: [],
      },
    ]);
    const html = render();
    expect(html).toContain('href="/organizations/cornell-tech"');
    expect(html).toContain('href="/education/known-degree"');
    expect(html).toContain("Mystery Academy");
    expect(html).toContain("Diploma");
  });

  it("falls back to the first testimonials when none are featured", () => {
    const real = content.getTestimonials();
    expect(real.some((t) => t.featured)).toBe(false);
    const html = render();
    expect(html).toContain(`href="/testimonials/${real[0].slug}"`);
    expect(html).not.toContain(`href="/testimonials/${real[3].slug}"`);
  });

  it("shows only featured testimonials when some are featured", () => {
    const real = content.getTestimonials();
    const list: Testimonial[] = real.slice(0, 5).map((t, i) => ({ ...t, featured: i === 4 }));
    vi.mocked(content.getTestimonials).mockReturnValue(list);
    const html = render();
    expect(html).toContain(`href="/testimonials/${list[4].slug}"`);
    expect(html).not.toContain(`href="/testimonials/${list[0].slug}"`);
  });

  it("rounds large stat counts down to the nearest thousand", () => {
    const [t] = content.getTestimonials();
    vi.mocked(content.getTestimonials).mockReturnValue(
      Array.from({ length: 1234 }, (_, i) => ({ ...t, slug: `t-${i}`, featured: false })),
    );
    const html = render();
    expect(html).toMatch(/>1000\+<\/p><p[^>]*>Testimonials/);
  });

  it("gives awards without a matching organization an empty logo", () => {
    const [award] = content.getAwards();
    vi.mocked(content.getAwards).mockReturnValue([
      { ...award, slug: "orphan-award", title: "Orphan Award", organization: "No Such Org" },
    ]);
    const html = render();
    expect(html).toContain("Orphan Award");
  });
});
