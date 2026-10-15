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
    // The inline theme script sits between the provider's script tags
    const script = html.slice(html.indexOf("<script"), html.indexOf("</script>"));
    expect(script).toContain('"class"');
    expect(script).toContain('"system"');
  });
});
