import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "./theme-provider";

describe("ThemeProvider", () => {
  it("renders children and a class-based, system-default theme script", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <p>Page content</p>
      </ThemeProvider>,
    );
    expect(html).toContain("<p>Page content</p>");
    const script = html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "";
    expect(script).toContain('"class"');
    expect(script).toContain('"system"');
  });
});
