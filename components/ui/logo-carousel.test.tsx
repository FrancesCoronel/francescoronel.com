// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LogoCarousel } from "./logo-carousel";

afterEach(cleanup);

describe("LogoCarousel", () => {
  it("renders the title and links logos that have a URL", () => {
    render(
      <LogoCarousel
        title="Featured in"
        logos={[
          { name: "Slack", image: "/images/organizations/slack.png", url: "https://slack.com" },
          { name: "Cornell", image: "/images/organizations/cornell.png" },
        ]}
      />
    );
    expect(screen.getByRole("heading", { name: "Featured in" })).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: "Slack" });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://slack.com");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("link", { name: "Cornell" })).toBeNull();
    expect(screen.getAllByAltText("Cornell")).toHaveLength(2);
  });
});
