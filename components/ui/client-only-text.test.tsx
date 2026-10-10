// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { ClientOnlyText } from "./client-only-text";

afterEach(cleanup);

describe("ClientOnlyText", () => {
  it("renders an empty, aria-hidden placeholder on the server", () => {
    expect(renderToStaticMarkup(<ClientOnlyText text="Hello" className="x" />)).toBe(
      '<span class="x" aria-hidden="true"></span>'
    );
  });

  it("renders the text once mounted on the client", () => {
    render(<ClientOnlyText text="Hello" />);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("SPAN");
    expect(el).not.toHaveAttribute("aria-hidden");
  });

  it("supports a custom tag", () => {
    render(<ClientOnlyText text="Title" as="h2" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Title");
  });
});
