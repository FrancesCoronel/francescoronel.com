import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("NotFound page", () => {
  it("shows a 404 message with a link home", () => {
    const html = renderToStaticMarkup(<NotFound />);
    expect(html).toContain("<h1");
    expect(html).toMatch(/>\s*404\s*</);
    expect(html).toContain("This page doesn&#x27;t exist.");
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Go Home<\/a>/);
    expect(html).toMatch(/<img [^>]*alt=""[^>]*aria-hidden="true"/);
    expect(html).toContain("memoji-thinking.png");
  });
});
