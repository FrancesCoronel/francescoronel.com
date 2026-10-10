// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PrevNextNav } from "./prev-next-nav";

afterEach(cleanup);

describe("PrevNextNav", () => {
  it("derives the back label from the base path and links prev/next", () => {
    render(
      <PrevNextNav
        basePath="/blog-posts"
        prev={{ slug: "a b", title: "Older Post" }}
        next={{ slug: "c", title: "Newer Post" }}
      />
    );
    expect(screen.getByRole("link", { name: /All Blog posts/ })).toHaveAttribute("href", "/blog-posts");
    expect(screen.getByRole("link", { name: /Previous.*Older Post/ })).toHaveAttribute(
      "href",
      "/blog-posts/a%20b"
    );
    expect(screen.getByRole("link", { name: /Next.*Newer Post/ })).toHaveAttribute(
      "href",
      "/blog-posts/c"
    );
  });

  it("uses a custom label and renders only the previous link", () => {
    render(<PrevNextNav basePath="/awards" allLabel="awards 🏆" prev={{ slug: "x", title: "X" }} next={null} />);
    expect(screen.getByRole("link", { name: /All Awards 🏆/ })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.queryByText("Next →")).toBeNull();
  });

  it("renders only the next link", () => {
    render(<PrevNextNav basePath="/talks" prev={null} next={{ slug: "y", title: "Y" }} />);
    expect(screen.queryByText("← Previous")).toBeNull();
    expect(screen.getByRole("link", { name: /Next/ })).toHaveAttribute("href", "/talks/y");
  });

  it("falls back to 'All' at the root and omits the pager without neighbours", () => {
    const { container } = render(<PrevNextNav basePath="/" prev={null} next={null} />);
    expect(screen.getByRole("link")).toHaveTextContent(/^All All$/);
    expect(container.querySelector(".border-t")).toBeNull();
  });
});
