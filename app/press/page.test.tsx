import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getPressGroups } from "@/lib/press";
import PressPage, { metadata } from "./page";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/'/g, "&#x27;");

describe("app/press/page", () => {
  it("exports metadata for the press page", () => {
    expect(metadata.title).toBe("Press & Elsewhere");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/press");
  });

  it("renders every group heading and links to every item", () => {
    const html = renderToStaticMarkup(<PressPage />);
    expect(html).toContain("Press &amp; Elsewhere 📣");
    for (const group of getPressGroups()) {
      expect(html).toContain(escapeHtml(group.heading));
      for (const item of group.items) {
        expect(html).toContain(`href="${escapeHtml(item.url)}"`);
      }
    }
  });

  it("links the archived freeCodeCamp article with the original byline", () => {
    const html = renderToStaticMarkup(<PressPage />);
    expect(html).toContain("https://web.archive.org/web/20220518190407/https://www.freecodecamp.org/news/what-is-typescript/");
    expect(html).toContain("Archived copy with my byline");
  });

  it("only points at posts that exist", () => {
    for (const item of getPressGroups().flatMap((g) => g.items)) {
      if (!item.post) continue;
      expect(existsSync(path.join(process.cwd(), "content/posts", `${item.post}.mdx`)), item.post).toBe(true);
    }
  });

  it("keeps site copy free of em dashes", () => {
    expect(JSON.stringify(getPressGroups())).not.toContain("—");
  });
});
