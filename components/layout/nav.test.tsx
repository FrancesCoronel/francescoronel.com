// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const nav = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/components/ui/search-modal", () => ({
  SearchModal: () => <button type="button">Search</button>,
}));
vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "light", setTheme: vi.fn() }) }));

import { Nav } from "./nav";

const LINKS = ["About", "Mentoring", "Posts", "Speaking", "Work"];

function desktopNav() {
  return screen.getAllByRole("list")[0];
}

beforeEach(() => {
  nav.pathname = "/";
});

afterEach(cleanup);

describe("Nav", () => {
  it("links home and lists the primary pages with search, theme toggle and contact", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Frances Coronel" })).toHaveAttribute("href", "/");
    const links = within(desktopNav()).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(LINKS);
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/about", "/mentoring", "/posts", "/speaking", "/work"]);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    expect(screen.getAllByRole("button", { name: "Search" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
  });

  it("highlights the link for the current page", () => {
    nav.pathname = "/posts";
    render(<Nav />);
    expect(within(desktopNav()).getByRole("link", { name: "Posts" })).toHaveClass("bg-horchata-200");
    expect(within(desktopNav()).getByRole("link", { name: "About" })).not.toHaveClass("bg-horchata-200");
  });

  it("toggles the mobile menu and closes it when a link is chosen", async () => {
    nav.pathname = "/work";
    const user = userEvent.setup();
    const { container } = render(<Nav />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("list")).toHaveLength(1);
    const closedIcon = toggle.querySelector("path")!.getAttribute("d");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle.querySelector("path")!.getAttribute("d")).not.toBe(closedIcon);
    const mobileList = screen.getAllByRole("list")[1];
    expect(within(mobileList).getAllByRole("link").map((l) => l.textContent)).toEqual(LINKS);
    expect(within(mobileList).getByRole("link", { name: "Work" })).toHaveClass("bg-horchata-200");
    expect(within(mobileList).getByRole("link", { name: "About" })).toHaveClass("text-navy-700");
    expect(screen.getAllByRole("button", { name: "Search" })).toHaveLength(2);

    await user.click(within(mobileList).getByRole("link", { name: "About" }));
    expect(screen.getAllByRole("list")).toHaveLength(1);

    await user.click(toggle);
    const mobileContact = screen.getAllByRole("link", { name: "Contact" })[1];
    await user.click(mobileContact);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    await user.click(toggle);
    expect(container.querySelectorAll("ul")).toHaveLength(1);
  });
});
