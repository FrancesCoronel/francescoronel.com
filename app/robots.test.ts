import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows everything except legacy WordPress paths, never static assets", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules[0]).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/wp-content/", "/wp-includes/", "/wp-admin/"],
    });
  });

  it("explicitly allows AI crawlers and points to the sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules.slice(1).map((r) => r.userAgent)).toEqual([
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
    ]);
    expect(rules.slice(1).every((r) => r.allow === "/")).toBe(true);
    expect(result.sitemap).toBe("https://francescoronel.com/sitemap.xml");
  });
});
