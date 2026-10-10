import { describe, expect, it } from "vitest";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/metadata";
import { GET } from "./route";

describe("GET /feed", () => {
  it("returns an RSS document with cache headers", async () => {
    const res = await GET();
    expect(res.headers.get("Content-Type")).toBe("application/xml; charset=utf-8");
    expect(res.headers.get("Cache-Control")).toBe("s-maxage=3600, stale-while-revalidate");

    const xml = await res.text();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain(`<title><![CDATA[${siteConfig.title}]]></title>`);
    expect(xml).toContain("<link>https://francescoronel.com</link>");
    expect(xml).toContain('<atom:link href="https://francescoronel.com/feed" rel="self" type="application/rss+xml"/>');
  });

  it("includes the 50 most recent posts with escaped links", async () => {
    const xml = await (await GET()).text();
    const posts = getAllPosts();
    expect(xml.match(/<item>/g)).toHaveLength(Math.min(50, posts.length));

    const first = posts[0];
    const link = `https://francescoronel.com/posts/${encodeURIComponent(first.slug)}`;
    expect(xml).toContain(`<title><![CDATA[${first.title}]]></title>`);
    expect(xml).toContain(`<link>${link}</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${link}</guid>`);
    expect(xml).toContain(`<pubDate>${new Date(first.date).toUTCString()}</pubDate>`);
    expect(xml).toContain(`<description><![CDATA[${first.excerpt}]]></description>`);
  });
});
