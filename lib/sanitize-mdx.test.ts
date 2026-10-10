import { describe, expect, it } from "vitest";
import { sanitizeMdxContent } from "./sanitize-mdx";

describe("sanitizeMdxContent", () => {
  it("escapes bare < characters in prose", () => {
    expect(sanitizeMdxContent("I <3 code and 1 < 2")).toBe("I &lt;3 code and 1 &lt; 2");
  });

  it("keeps tags, closing tags, comments and JSX components", () => {
    const line = "<br> <LinkedInEmbed /> </div> <!-- note -->";
    expect(sanitizeMdxContent(line)).toBe(line);
  });

  it("leaves inline code spans untouched", () => {
    expect(sanitizeMdxContent("Use `a < b` when 1 < 2")).toBe("Use `a < b` when 1 &lt; 2");
  });

  it("leaves fenced code blocks untouched, including indented fences", () => {
    const content = ["before < after", "  ```js", "if (a < b) {}", "  ```", "x < y"].join("\n");
    expect(sanitizeMdxContent(content)).toBe(
      ["before &lt; after", "  ```js", "if (a < b) {}", "  ```", "x &lt; y"].join("\n"),
    );
  });
});
