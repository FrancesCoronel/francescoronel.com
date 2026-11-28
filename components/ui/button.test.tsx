// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Button, ButtonLink, buttonClasses } from "./button";

afterEach(cleanup);

describe("buttonClasses", () => {
  it("defaults to a medium primary button", () => {
    const classes = buttonClasses();
    expect(classes).toContain("bg-brand-fill text-on-brand hover:bg-brand-fill-hover");
    expect(classes).toContain("px-6 py-3 text-sm");
  });

  it("applies the variant, size and extra classes", () => {
    const classes = buttonClasses({ variant: "secondary", size: "lg", className: "mt-8" });
    expect(classes).toContain("border-navy-300");
    expect(classes).toContain("px-8 py-3");
    expect(classes).toMatch(/ mt-8$/);
    expect(buttonClasses({ size: "sm" })).toContain("px-4 py-2 text-xs");
  });
});

describe("Button", () => {
  it("renders a type=button by default and passes props through", () => {
    render(<Button disabled>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toBeDisabled();
  });

  it("keeps an explicit submit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
  });
});

describe("ButtonLink", () => {
  it("renders internal and external links", () => {
    render(
      <>
        <ButtonLink href="/contact">Contact</ButtonLink>
        <ButtonLink href="https://example.com" target="_blank" variant="secondary">
          Elsewhere
        </ButtonLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    const external = screen.getByRole("link", { name: "Elsewhere" });
    expect(external).toHaveAttribute("href", "https://example.com");
    expect(external).toHaveAttribute("target", "_blank");
    expect(external.className).toContain("border-navy-300");
  });
});
