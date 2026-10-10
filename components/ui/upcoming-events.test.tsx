// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { UpcomingEvents } from "./upcoming-events";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-03-10T09:00:00"));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const future = {
  org: "JSConf",
  talk: "TypeScript Tips",
  date: "2026-03-10",
  url: "https://jsconf.example/talk",
  description: "A talk about types.",
  links: [
    { label: "Tickets", url: "https://jsconf.example/tickets" },
    { label: "Stream", url: "https://jsconf.example/stream" },
  ],
};

const futureNoLinks = {
  org: "Meetup",
  talk: "Career Growth",
  date: "2026-04-02",
  url: "https://meetup.example",
  description: "Leveling up.",
};

const past = {
  org: "DevFest",
  talk: "Old Talk",
  date: "2026-03-09",
  url: "https://devfest.example",
  description: "Already happened.",
};

describe("UpcomingEvents", () => {
  it("renders nothing without events", () => {
    const { container } = render(<UpcomingEvents events={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("splits events into upcoming (including today) and recently past", () => {
    render(<UpcomingEvents events={[future, futureNoLinks, past]} />);
    expect(screen.getByRole("heading", { name: "Next Up 📅" })).toBeInTheDocument();

    const upcoming = screen.getByRole("link", { name: /TypeScript Tips/ });
    expect(upcoming).toHaveAttribute("href", "https://jsconf.example/talk");
    expect(upcoming).toHaveTextContent("Tue, Mar 10, 2026");
    expect(screen.getByRole("link", { name: "Tickets →" })).toHaveAttribute(
      "href",
      "https://jsconf.example/tickets"
    );
    expect(screen.getByRole("link", { name: /Career Growth/ })).toHaveTextContent("Register →");

    const recent = screen.getByText("Recently Past");
    expect(recent).toHaveClass("mt-6");
    expect(recent.parentElement).toHaveClass("mt-10");
    expect(screen.getByRole("link", { name: /Old Talk/ })).toHaveTextContent("Mon, Mar 9, 2026");
  });

  it("stops link clicks from bubbling to the card", () => {
    const onClick = vi.fn();
    render(
      <div onClick={onClick}>
        <UpcomingEvents events={[future]} />
      </div>
    );
    fireEvent.click(screen.getByRole("link", { name: "Stream →" }));
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("link", { name: /TypeScript Tips/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("treats an empty links list like no links", () => {
    render(<UpcomingEvents events={[{ ...future, links: [] }]} />);
    expect(screen.getByRole("link")).toHaveTextContent("Register →");
    expect(screen.queryByText("Recently Past")).toBeNull();
  });

  it("shows the heading above past events when nothing is upcoming", () => {
    render(<UpcomingEvents events={[past]} />);
    expect(screen.getByRole("heading", { name: "Next Up 📅" })).toBeInTheDocument();
    const recent = screen.getByText("Recently Past");
    expect(recent).toHaveClass("mt-4");
    expect(recent.parentElement).not.toHaveClass("mt-10");
    expect(screen.queryByText("Upcoming", { selector: "span" })).toBeNull();
  });
});
