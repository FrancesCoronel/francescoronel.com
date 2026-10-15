import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MentoringSessionsPage, { metadata } from "./page";

describe("app/mentoring/sessions/page", () => {
  it("exports noindex metadata for the sessions log", () => {
    expect(metadata.title).toBe("Mentoring Sessions");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/mentoring/sessions");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders the heading, intro and the sessions table", () => {
    const html = renderToStaticMarkup(<MentoringSessionsPage />);
    expect(html).toContain("Mentoring");
    expect(html).toContain("Sessions Log 🗂️");
    expect(html).toContain("Calendly (2015–2023), Formation (2023–present)");
    expect(html).toContain("<table");
  });
});
