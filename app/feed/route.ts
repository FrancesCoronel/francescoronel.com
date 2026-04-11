import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/metadata";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = getAllPosts().slice(0, 50);

  const items = posts
    .map((post) => {
      const postUrl = escapeXml(
        `${siteConfig.siteUrl}/posts/${encodeURIComponent(post.slug)}`
      );
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`;
    })
    .join("");

  const siteUrl = escapeXml(siteConfig.siteUrl);
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.title}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
