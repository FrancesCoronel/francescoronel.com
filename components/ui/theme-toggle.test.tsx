// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEvent }));

const theme = vi.hoisted(() => ({
  current: "light" as string | undefined,
  system: "light" as string | undefined,
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: theme.current, systemTheme: theme.system, setTheme: theme.setTheme }),
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
    theme.system = "light";
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(theme.setTheme).toHaveBeenCalledWith("dark");
    expect(trackEvent).toHaveBeenLastCalledWith("theme_change", { theme: "dark" });
  });

  it("switches from dark to light and shows the sun icon", () => {
    theme.current = "dark";
    theme.system = "dark";
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Switch to light mode" });
    expect(button.querySelector("path")?.getAttribute("d")).toMatch(/^M12 3v1/);
    fireEvent.click(button);
    expect(theme.setTheme).toHaveBeenCalledWith("light");
    expect(trackEvent).toHaveBeenLastCalledWith("theme_change", { theme: "light" });
  });

  it("shows the sun when the device is dark and nothing is saved", () => {
    theme.current = "dark";
    theme.system = "dark";
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });

  it("goes back to following the device when the choice matches it", () => {
    theme.current = "dark";
    theme.system = "light";
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(theme.setTheme).toHaveBeenCalledWith("system");
    expect(trackEvent).toHaveBeenLastCalledWith("theme_change", { theme: "light" });
  });
});
