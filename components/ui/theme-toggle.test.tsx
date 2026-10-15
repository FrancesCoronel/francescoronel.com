// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

const theme = vi.hoisted(() => ({ current: "light" as string | undefined, setTheme: vi.fn() }));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: theme.current, setTheme: theme.setTheme }),
}));

afterEach(() => {
  cleanup();
  theme.setTheme.mockClear();
});

describe("ThemeToggle", () => {
  it("renders a neutral placeholder before mounting", () => {
    const out = renderToStaticMarkup(<ThemeToggle />);
    expect(out).toContain('aria-label="Toggle theme"');
  });

  it("switches from light to dark", () => {
    theme.current = "light";
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(theme.setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches from dark to light and shows the sun icon", () => {
    theme.current = "dark";
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Switch to light mode" });
    expect(button.querySelector("path")?.getAttribute("d")).toMatch(/^M12 3v1/);
    fireEvent.click(button);
    expect(theme.setTheme).toHaveBeenCalledWith("light");
  });
});
