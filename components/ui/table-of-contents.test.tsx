// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { Heading } from "@/lib/extract-headings";
import { TableOfContents } from "./table-of-contents";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observerCallback: ObserverCallback | null;
const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(cb: ObserverCallback, public options: IntersectionObserverInit) {
    observerCallback = cb;
  }
  observe = observe;
  disconnect = disconnect;
}

const headings: Heading[] = [
  { id: "intro", text: "Intro", level: 2 },
  { id: "details", text: "Details", level: 3 },
  { id: "missing", text: "Missing", level: 2 },
];

beforeEach(() => {
  observerCallback = null;
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  document.body.innerHTML = '<h2 id="intro">Intro</h2><h3 id="details">Details</h3>';
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

function intersect(entries: [string, boolean][]) {
  act(() => {
    observerCallback!(
      entries.map(([id, isIntersecting]) => ({
        target: document.getElementById(id)!,
        isIntersecting,
      }))
    );
  });
}

const activeLink = () =>
  screen.getAllByRole("link").filter((a) => a.className.includes("font-semibold"));

describe("TableOfContents", () => {
  it("renders nothing without headings", () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container).toBeEmptyDOMElement();
    expect(observerCallback).toBeNull();
  });

  it("renders links with deeper indentation for h3s", () => {
    render(<TableOfContents headings={headings} />);
    expect(screen.getByRole("navigation", { name: "Table of contents" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Intro" })).toHaveAttribute("href", "#intro");
    expect(screen.getByRole("link", { name: "Intro" })).toHaveClass("pl-4");
    expect(screen.getByRole("link", { name: "Details" })).toHaveClass("pl-6");
  });

  it("observes only headings present in the document", () => {
    render(<TableOfContents headings={headings} />);
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("does not observe anything when no heading elements exist", () => {
    document.body.innerHTML = "";
    render(<TableOfContents headings={headings} />);
    expect(observerCallback).toBeNull();
  });

  it("highlights the topmost visible heading", () => {
    render(<TableOfContents headings={headings} />);
    expect(activeLink()).toHaveLength(0);

    intersect([["details", true]]);
    expect(activeLink().map((a) => a.textContent)).toEqual(["Details"]);

    intersect([["intro", true]]);
    expect(activeLink().map((a) => a.textContent)).toEqual(["Intro"]);

    intersect([["intro", false]]);
    expect(activeLink().map((a) => a.textContent)).toEqual(["Details"]);

    // nothing visible keeps the last active heading
    intersect([["details", false]]);
    expect(activeLink().map((a) => a.textContent)).toEqual(["Details"]);
  });

  it("smooth-scrolls to a heading on click and marks it active", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<TableOfContents headings={headings} />);
    fireEvent.click(screen.getByRole("link", { name: "Details" }));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    expect(activeLink().map((a) => a.textContent)).toEqual(["Details"]);

    // clicking a heading that is not on the page still updates the active link
    fireEvent.click(screen.getByRole("link", { name: "Missing" }));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(activeLink().map((a) => a.textContent)).toEqual(["Missing"]);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<TableOfContents headings={headings} />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
