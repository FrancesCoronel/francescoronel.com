// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Footer } from "./footer";

afterEach(cleanup);

describe("Footer", () => {
  it("renders the grouped footer navigation", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer navigation" });
    expect(within(nav).getAllByRole("heading").map((h) => h.textContent)).toEqual([
      "Pages",
      "More",
      "Resources",
    ]);
    expect(within(nav).getByRole("link", { name: "RSS Feed" })).toHaveAttribute("href", "/feed");
    expect(within(nav).getByRole("link", { name: "Design System" })).toHaveAttribute(
      "href",
      "/design-system"
    );
    expect(within(nav).getAllByRole("link")).toHaveLength(16);
  });

  it("renders the brand link, newsletter form and copyright year", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /Hi, I'm Frances!/ })).toHaveAttribute("href", "/");
    expect(screen.getByText("Subscribe to my newsletter")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))
    ).toBeInTheDocument();
  });

  it("opens social links in a new tab, keeping rel=me where set", () => {
    render(<Footer />);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/FrancesCoronel");
    expect(github).toHaveAttribute("rel", "me noopener noreferrer");
    expect(github).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Bluesky" })).toHaveAttribute(
      "rel",
      "me noopener noreferrer"
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
    for (const label of ["YouTube", "Reddit", "Discord", "Product Hunt"]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("target", "_blank");
    }
  });
});
