import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import OrganizationDetailPage, { generateMetadata, generateStaticParams } from "./page";
import * as content from "@/lib/content";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getContentByOrganization: vi.fn(actual.getContentByOrganization) };
});

afterEach(() => {
  vi.mocked(content.getContentByOrganization).mockReset();
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const render = async (slug: string) =>
  renderToStaticMarkup(await OrganizationDetailPage(params(slug)));

const DARK = "border-y border-horchata-200 bg-horchata-100 py-16 md:py-20";
const LIGHT = "bg-white py-16 md:py-20 dark:bg-navy-900";

/** Returns the class attribute of the <section> that contains the given heading text */
function sectionClassFor(html: string, heading: string): string {
  const at = html.indexOf(heading);
  const start = html.lastIndexOf("<section", at);
  return html.slice(start, html.indexOf(">", start));
}

describe("app/organizations/[slug]/page", () => {
  it("generates a param for every organization", () => {
    const result = generateStaticParams();
    expect(result).toHaveLength(content.getOrganizations().length);
    expect(result).toContainEqual({ slug: "slack" });
  });

  describe("generateMetadata", () => {
    it("returns a not-found title for an unknown organization", async () => {
      expect(await generateMetadata(params("nope"))).toEqual({ title: "Organization Not Found" });
    });

    it("uses the org description and logo", async () => {
      const org = content.getOrganizationBySlug("slack")!;
      const meta = await generateMetadata(params("slack"));
      expect(meta.title).toBe(org.name);
      expect(meta.description).toBe(org.description);
      expect(meta.alternates?.canonical).toBe("https://francescoronel.com/organizations/slack");
      expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: org.logo })]);
    });

    it("falls back to a generated description and the default image", async () => {
      const org = content.getOrganizationBySlug("builtin")!;
      vi.mocked(content.getContentByOrganization).mockReturnValueOnce({
        ...content.getContentByOrganization("builtin")!,
        org: { ...org, description: "" },
      });
      const meta = await generateMetadata(params("builtin"));
      expect(meta.description).toBe(
        `Everything related to ${org.name}: blog posts, experience, testimonials, and more.`,
      );
      expect(meta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "https://francescoronel.com/images/og/home.jpg" }),
      ]);
    });
  });

  describe("page", () => {
    it("calls notFound for an unknown organization", async () => {
      await expect(OrganizationDetailPage(params("nope"))).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("renders Slack with experience, projects, posts and testimonials in alternating sections", async () => {
      const html = await render("slack");
      const { experiences, projects, posts, testimonials } = content.getContentByOrganization("slack")!;
      expect(html).toContain("BreadcrumbList");
      expect(html).toContain("Visit website");
      expect(html).toContain(`href="/experience/${experiences[0].slug}"`);
      expect(html).toContain(experiences[0].location);
      expect(html).toContain(`href="/posts/${projects[0].slug}"`);
      expect(html).toContain(`href="/posts/${encodeURIComponent(posts[0].slug)}"`);
      expect(html).toContain(`href="/testimonials/${testimonials[0].slug}"`);
      expect(html).not.toContain("Education 🎓");
      expect(html).not.toContain("Awards 🏆");
      expect(html).not.toContain("No associated content found yet");
      expect(sectionClassFor(html, "Experience 💼")).toContain(DARK);
      expect(sectionClassFor(html, "Projects 🛠️")).toContain(LIGHT);
      expect(sectionClassFor(html, "Blog Posts ✍🏽")).toContain(DARK);
      expect(sectionClassFor(html, "Testimonials 💬")).toContain(LIGHT);
    });

    it("renders education and awards sections for Hampton University", async () => {
      const html = await render("hampton-university");
      const { education, awards } = content.getContentByOrganization("hampton-university")!;
      expect(html).toContain(`href="/education/${education[0].slug}"`);
      expect(html).toContain(`href="/awards/${awards[0].slug}"`);
      expect(html).toContain(awards[0].date);
      expect(sectionClassFor(html, "Education 🎓")).toContain(DARK);
      expect(sectionClassFor(html, "Awards 🏆")).toContain(DARK);
    });

    it("shows the education field when present", async () => {
      const html = await render("jacobs-university-bremen");
      const [edu] = content.getContentByOrganization("jacobs-university-bremen")!.education;
      expect(html).toContain(edu.field);
    });

    it("shows an initial and empty state for an org without logo or content", async () => {
      vi.mocked(content.getContentByOrganization).mockReturnValueOnce({
        org: { ...content.getOrganizationBySlug("elpha")!, logo: "", description: "" },
        posts: [],
        experiences: [],
        testimonials: [],
        awards: [],
        education: [],
        projects: [],
      });
      const html = await render("elpha");
      expect(html).toContain(">E</div>");
      expect(html).toContain("No associated content found yet for Elpha.");
      expect(html).not.toContain("Visit website");
      expect(html).not.toContain("Experience 💼");
    });

    it("omits optional experience and project fields", async () => {
      const real = content.getContentByOrganization("slack")!;
      vi.mocked(content.getContentByOrganization).mockReturnValueOnce({
        ...real,
        experiences: [{ ...real.experiences[0], location: "", description: "" }],
        projects: [
          { ...real.projects[0], emoji: "🧪" },
          { ...real.projects[1], emoji: undefined },
        ],
      });
      const html = await render("slack");
      expect(html).not.toContain(real.experiences[0].location);
      expect(html).not.toContain(real.experiences[0].description);
      expect(html).toContain("🧪");
      expect(html).toContain("🛠️</div>");
    });

    it("links prev/next around the current org and omits them at the ends", async () => {
      const orgs = content.getOrganizations();
      const first = await render(orgs[0].slug);
      expect(first).toContain(`href="/organizations/${orgs[1].slug}"`);
      const last = await render(orgs[orgs.length - 1].slug);
      expect(last).toContain(`href="/organizations/${orgs[orgs.length - 2].slug}"`);
    });
  });
});
