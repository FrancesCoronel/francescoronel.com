import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import UsesPage, { metadata } from "./page";

const REPO_BASE = "https://github.com/FrancesCoronel/francescoronel.com/blob/main/claude";

describe("app/uses/page", () => {
  it("exports metadata for the uses page", () => {
    expect(metadata.title).toBe("Uses");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/uses");
  });

  it("renders tools with an image or an emoji icon", () => {
    const html = renderToStaticMarkup(<UsesPage />);
    expect(html).toContain("What I Use 🛠️");
    expect(html).toContain('href="https://app.warp.dev/referral/NPZPRR"');
    expect(html).toContain('alt="Warp"');
    expect(html).toContain('<span class="mt-0.5 text-2xl">📬</span>');
  });

  it("renders MCP servers with pluralised tool counts", () => {
    const html = renderToStaticMarkup(<UsesPage />);
    expect(html).toContain('href="https://docs.slack.dev/ai/slack-mcp-server/"');
    expect(html).toContain(">9 tools</span>");
    expect(html).toContain(">1 tool</span>");
  });

  it("badges official plugins with the Claude logo and others with GitHub", () => {
    const html = renderToStaticMarkup(<UsesPage />);
    expect(html.match(/width="14" height="14"[^>]*src="\/images\/tools\/claude.png"/g)).toHaveLength(2);
    expect(html).toContain("sirmalloc/ccstatusline</span>");
  });

  it("links skills to their files with category icons", () => {
    const html = renderToStaticMarkup(<UsesPage />);
    expect(html).toContain(`href="${REPO_BASE}/skills/slack-summary.md"`);
    expect(html).toContain("<code");
    expect(html).toContain("/tone-voice");
    expect(html).toContain('<span class="text-[10px] leading-none" aria-hidden="true">✍🏽</span>Writing');
  });

  it("links each hook to its line in settings.json", () => {
    const html = renderToStaticMarkup(<UsesPage />);
    for (const line of [29, 39, 49, 59]) {
      expect(html).toContain(`href="${REPO_BASE}/settings.json#L${line}"`);
    }
    expect(html).toContain("Auto-format with prettier / markdownlint");
  });
});
