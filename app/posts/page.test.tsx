import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PostsListingPage, { metadata } from "./page";
import { getAllPosts } from "@/lib/content";

describe("app/posts/page", () => {
  it("exports metadata for the posts listing", () => {
    expect(metadata.title).toBe("Posts");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/posts");
  });

  it("renders the header and the first page of posts", () => {
    const html = renderToStaticMarkup(<PostsListingPage />);
    expect(html).toContain("Writing &amp; Work");
    expect(html).toContain("Posts ✍🏽");
    expect(html).toContain("newsletter-cta.webp");
    const [newest] = getAllPosts();
    expect(html).toContain(`href="/posts/${encodeURIComponent(newest.slug)}"`);
    expect(html).toContain(newest.title.replace(/&/g, "&amp;"));
  });
});
