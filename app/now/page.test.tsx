import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import NowPage, { metadata } from "./page";

describe("app/now/page", () => {
  it("exports metadata for the now page", () => {
    expect(metadata.title).toBe("Now");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/now");
  });

  it("renders the latest changelog entry with all sections", () => {
    const html = renderToStaticMarkup(<NowPage />);
    expect(html).toContain("Now 📍");
    expect(html).toContain('id="march-2026"');
    expect(html).toContain("March 2026");
    for (const label of ["Work", "Side Projects", "Personal"]) {
      expect(html).toContain(`</span>${label}</h2>`);
    }
    expect(html).toContain("<strong>DevXP team at Slack</strong>");
    expect(html).toContain('href="https://www.linkedin.com/in/andrew-rodriguez/"');
  });

  it("links to the nownownow explainer", () => {
    const html = renderToStaticMarkup(<NowPage />);
    expect(html).toContain('href="https://nownownow.com/about"');
    expect(html).toContain("/now page");
  });
});
