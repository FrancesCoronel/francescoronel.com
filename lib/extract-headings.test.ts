import { describe, expect, it } from "vitest";
import { extractHeadings } from "./extract-headings";

describe("extractHeadings", () => {
  it("extracts h2 and h3 headings with rehype-slug compatible ids", () => {
    const content = [
      "# Title is skipped",
      "## Getting Started",
      "Some text",
      "### Install & Configure!",
      "#### Too deep",
    ].join("\n");
    expect(extractHeadings(content)).toEqual([
      { level: 2, text: "Getting Started", id: "getting-started" },
      { level: 3, text: "Install & Configure!", id: "install--configure" },
    ]);
  });

  it("strips inline markdown from heading text", () => {
    const content = "## **Bold** and *italic* with `code` and [a link](https://example.com)";
    expect(extractHeadings(content)).toEqual([
      {
        level: 2,
        text: "Bold and italic with code and a link",
        id: "bold-and-italic-with-code-and-a-link",
      },
    ]);
  });

  it("adds numeric suffixes to duplicate headings", () => {
    const content = ["## Notes", "## Notes", "### Notes"].join("\n");
    expect(extractHeadings(content).map((h) => h.id)).toEqual(["notes", "notes-1", "notes-2"]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const content = ["```md", "## Not a heading", "```", "## Real heading"].join("\n");
    expect(extractHeadings(content)).toEqual([
      { level: 2, text: "Real heading", id: "real-heading" },
    ]);
  });

  it("returns an empty list when there are no headings", () => {
    expect(extractHeadings("Just a paragraph.")).toEqual([]);
  });
});
