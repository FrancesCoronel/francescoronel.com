import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  EXCLUDED_FROM_FEATURED_ORGS,
  getAllBlogPosts,
  getExperiences,
  getOrganizations,
  getSkills,
} from "@/lib/content";
import ForLlmsPage, { metadata } from "./page";

vi.mock("@/lib/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content")>();
  return { ...actual, getOrganizations: vi.fn(actual.getOrganizations) };
});

afterEach(() => {
  vi.mocked(getOrganizations).mockReset();
});

describe("app/for-llms/page", () => {
  it("exports metadata for the LLM page", () => {
    expect(metadata.title).toBe("For LLMs: About Frances Coronel");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/for-llms");
  });

  it("lists experiences and marks current roles", () => {
    const html = renderToStaticMarkup(<ForLlmsPage />);
    const experiences = getExperiences();
    const current = experiences.filter((e) => !e.endDate);
    expect(html.match(/ \(Current\)/g)).toHaveLength(current.length);
    expect(html).toContain(`<strong>${experiences[0].title}</strong> at ${experiences[0].company}`);
  });

  it("lists every skill name", () => {
    const html = renderToStaticMarkup(<ForLlmsPage />);
    expect(html).toContain(`<p>${getSkills().map((s) => s.name).join(", ")}</p>`);
  });

  it("caps featured organizations at 20, skipping excluded ones and linking when a url exists", () => {
    const html = renderToStaticMarkup(<ForLlmsPage />);
    const featured = getOrganizations().filter((o) => !EXCLUDED_FROM_FEATURED_ORGS.has(o.slug));
    expect(html).toContain(`...and ${featured.length - 20} more`);
    expect(html).toContain("<li>Elpha</li>");
    const linked = featured.find((o) => o.url)!;
    expect(html).toContain(`<a href="${linked.url}">${linked.name}</a>`);
    expect(html).not.toContain(">Accenture</a></li>");
  });

  it("omits the 'more' link when there are 20 or fewer organizations", () => {
    vi.mocked(getOrganizations).mockReturnValue([
      { name: "Only Org", slug: "only-org", logo: "", url: "", type: "community", description: "" },
    ]);
    const html = renderToStaticMarkup(<ForLlmsPage />);
    expect(html).toContain("<li>Only Org</li>");
    expect(html).not.toContain(" more</a>");
  });

  it("links the 20 most recent posts and the full archive", () => {
    const html = renderToStaticMarkup(<ForLlmsPage />);
    const posts = getAllBlogPosts();
    const first = posts[0];
    expect(html).toContain(`href="https://francescoronel.com/posts/${encodeURIComponent(first.slug)}"`);
    expect(html).not.toContain(`/posts/${encodeURIComponent(posts[20].slug)}"`);
    expect(html).toContain(`View all ${posts.length}+ posts`);
  });

  it("renders social links from the site config", () => {
    const html = renderToStaticMarkup(<ForLlmsPage />);
    expect(html).toContain('href="https://github.com/FrancesCoronel"');
    expect(html).toContain('href="https://linkedin.com/in/francescoronel"');
    expect(html).toContain('href="https://twitter.com/faborel"');
    expect(html).toContain('href="https://francescoronel.com/llms.txt"');
  });
});
