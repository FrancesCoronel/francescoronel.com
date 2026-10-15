// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getClearbitLogoUrl, OrgLogo } from "./org-logo";

afterEach(cleanup);

describe("getClearbitLogoUrl", () => {
  it("builds a Clearbit URL from the org domain", () => {
    expect(getClearbitLogoUrl("https://www.slack.com/about")).toBe("https://logo.clearbit.com/slack.com");
    expect(getClearbitLogoUrl("https://cornell.edu")).toBe("https://logo.clearbit.com/cornell.edu");
  });

  it("returns null for missing or invalid URLs", () => {
    expect(getClearbitLogoUrl()).toBeNull();
    expect(getClearbitLogoUrl(null)).toBeNull();
    expect(getClearbitLogoUrl("not a url")).toBeNull();
  });
});

describe("OrgLogo", () => {
  it("prefers the stored logo and falls back to a letter avatar on error", () => {
    render(
      <OrgLogo src="/images/organizations/slack.png" orgUrl="https://slack.com" name="Slack" size={40} className="logo" />
    );
    const img = screen.getByAltText("Slack");
    expect(img.getAttribute("src")).toContain("slack.png");
    expect(img.getAttribute("src")).not.toContain("clearbit");
    expect(img).toHaveClass("logo");
    fireEvent.error(img);
    const avatar = screen.getByLabelText("Slack");
    expect(avatar).toHaveTextContent("S");
    expect(avatar.style.width).toBe("40px");
    expect(avatar.style.fontSize).toBe("15px");
  });

  it("uses Clearbit when no stored logo is set", () => {
    render(<OrgLogo orgUrl="https://www.cornell.edu" name="Cornell" />);
    expect(screen.getByAltText("Cornell").getAttribute("src")).toContain(
      encodeURIComponent("https://logo.clearbit.com/cornell.edu")
    );
  });

  it("shows a letter avatar when there is nothing to load", () => {
    const { container } = render(<OrgLogo src={null} name="Techqueria" avatarClassName="big" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveTextContent("T");
    expect(avatar).toHaveClass("big");
    expect(avatar.style.width).toBe("64px");
    expect(avatar).toHaveAttribute("aria-label", "Techqueria");
  });

  it("hides decorative logos from assistive tech", () => {
    const { container, rerender } = render(<OrgLogo name="Latina Dev" decorative />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveAttribute("aria-hidden", "true");
    expect(avatar).not.toHaveAttribute("aria-label");
    expect(avatar.className).not.toContain("undefined");

    rerender(<OrgLogo key="with-logo" src="/images/organizations/latina-dev.png" name="Latina Dev" decorative />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
});
