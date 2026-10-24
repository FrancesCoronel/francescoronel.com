import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/metadata";
import { BlogPostJsonLd, BreadcrumbJsonLd, PersonJsonLd, WebSiteJsonLd } from "./json-ld";

function readJsonLd(element: ReactElement) {
  const html = renderToStaticMarkup(element);
  const match = html.match(/^<script type="application\/ld\+json">(.*)<\/script>$/);
  expect(match).not.toBeNull();
  return JSON.parse(match![1]);
}

describe("PersonJsonLd", () => {
  it("describes Frances as a Person with employer, alumni and profiles", () => {
    const data = readJsonLd(<PersonJsonLd />);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Frances Coronel",
      url: "https://francescoronel.com",
      jobTitle: "Senior Software Engineer, Agentic SDLC",
      worksFor: { name: "Slack", parentOrganization: { name: "Salesforce" } },
    });
    expect(data.alumniOf.map((a: { name: string }) => a.name)).toEqual(["Cornell Tech", "Hampton University"]);
    expect(data.sameAs).toEqual(
      expect.arrayContaining([
        "https://github.com/FrancesCoronel",
        "https://linkedin.com/in/francescoronel",
        "https://twitter.com/FrancesCoronel",
      ]),
    );
  });
});

describe("BlogPostJsonLd", () => {
  it("describes a blog post with its image", () => {
    const data = readJsonLd(
      <BlogPostJsonLd title="Hello" description="Desc" date="2024-01-01" slug="hello" image="https://x.y/a.png" />,
    );
    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Hello",
      description: "Desc",
      datePublished: "2024-01-01",
      dateModified: "2024-01-01",
      url: "https://francescoronel.com/posts/hello",
      author: { "@type": "Person", name: "Frances Coronel", url: "https://francescoronel.com" },
      publisher: { "@type": "Person", name: "Frances Coronel", url: "https://francescoronel.com" },
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://francescoronel.com/posts/hello" },
      image: "https://x.y/a.png",
    });
  });

  it("omits the image and keywords when none are given", () => {
    const data = readJsonLd(<BlogPostJsonLd title="Hi" description="D" date="2024-01-01" slug="hi" keywords={[]} />);
    expect(data).not.toHaveProperty("image");
    expect(data).not.toHaveProperty("keywords");
  });

  it("uses the updated date for dateModified and joins keywords", () => {
    const data = readJsonLd(
      <BlogPostJsonLd title="Hi" description="D" date="2024-01-01" updated="2024-06-01" slug="hi" keywords={["ai", "career"]} />,
    );
    expect(data).toMatchObject({ datePublished: "2024-01-01", dateModified: "2024-06-01", keywords: "ai, career" });
  });
});

describe("BreadcrumbJsonLd", () => {
  it("numbers breadcrumb items from 1", () => {
    const data = readJsonLd(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://francescoronel.com" },
          { name: "Posts", url: "https://francescoronel.com/posts" },
        ]}
      />,
    );
    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://francescoronel.com" },
        { "@type": "ListItem", position: 2, name: "Posts", item: "https://francescoronel.com/posts" },
      ],
    });
  });
});

describe("WebSiteJsonLd", () => {
  it("describes the website", () => {
    expect(readJsonLd(<WebSiteJsonLd />)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Frances Coronel",
      url: "https://francescoronel.com",
      author: { "@type": "Person", name: "Frances Coronel" },
      description: siteConfig.description,
    });
  });
});
