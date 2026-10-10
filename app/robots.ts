import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

// AI crawlers we explicitly welcome. The "*" rule already allows them; listing
// them documents intent and survives any future tightening of the default rule.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "Applebot-Extended",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block old WordPress upload paths — these no longer exist and waste crawl budget.
        // Never block /_next/static/: Google needs the CSS, JS and fonts there to render pages.
        disallow: ["/wp-content/", "/wp-includes/", "/wp-admin/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
