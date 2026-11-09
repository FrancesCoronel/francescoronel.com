import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import giving from "@/content/giving.json";
import GivingPage, { metadata } from "./page";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/'/g, "&#x27;");

describe("app/giving/page", () => {
  it("exports metadata for the giving page", () => {
    expect(metadata.title).toBe("Where I Give");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/giving");
  });

  it("renders every group heading and org card", () => {
    const html = renderToStaticMarkup(<GivingPage />);
    expect(html).toContain("Where I Give 💛");
    for (const group of giving) {
      expect(html).toContain(escapeHtml(group.heading));
      for (const org of group.orgs) {
        expect(html).toContain(`href="${org.url}"`);
      }
    }
  });

  it("uses stored logos when present and an emoji badge otherwise", () => {
    const html = renderToStaticMarkup(<GivingPage />);
    expect(html).toContain("techqueria.png");
    expect(html).toContain('aria-hidden="true">🗳️</span>');
  });

  it("keeps site copy free of em dashes", () => {
    expect(JSON.stringify(giving)).not.toContain("—");
  });
});
