// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CalEmbed } from "./cal-embed";

type Callback = (entries: Array<{ isIntersecting: boolean }>) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  observe = vi.fn();
  disconnect = vi.fn();
  constructor(
    public callback: Callback,
    public options: IntersectionObserverInit
  ) {
    MockIntersectionObserver.instances.push(this);
  }
  trigger(...flags: boolean[]) {
    act(() => this.callback(flags.map((isIntersecting) => ({ isIntersecting }))));
  }
}

type Queued = { q: unknown[] };

function calScripts() {
  return document.head.querySelectorAll('script[src="https://app.cal.com/embed/embed.js"]');
}

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  delete window.Cal;
  calScripts().forEach((s) => s.remove());
});

describe("CalEmbed", () => {
  it("shows a loading state and waits for the calendar to near the viewport", () => {
    const { container } = render(<CalEmbed />);
    expect(screen.getByText("Loading calendar...")).toBeInTheDocument();
    expect(container.querySelector("#my-cal-inline-mentoring")).toBeInTheDocument();

    const [observer] = MockIntersectionObserver.instances;
    expect(observer.options).toEqual({ rootMargin: "400px" });
    expect(observer.observe).toHaveBeenCalledWith(container.firstElementChild);

    observer.trigger(false);
    expect(window.Cal).toBeUndefined();
    expect(observer.disconnect).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<CalEmbed />);
    unmount();
    expect(MockIntersectionObserver.instances[0].disconnect).toHaveBeenCalled();
  });

  it("injects the Cal.com embed and queues the mentoring calendar once visible", () => {
    vi.useFakeTimers();
    render(<CalEmbed />);
    const [observer] = MockIntersectionObserver.instances;
    observer.trigger(false, true);
    expect(observer.disconnect).toHaveBeenCalled();

    expect(calScripts()).toHaveLength(1);
    const cal = window.Cal!;
    expect(cal.loaded).toBe(true);
    expect(cal.q).toEqual([["initNamespace", "mentoring"]]);
    expect((cal.ns!.mentoring as unknown as Queued).q).toEqual([
      ["init", "mentoring", { origin: "https://app.cal.com" }],
      [
        "inline",
        {
          elementOrSelector: "#my-cal-inline-mentoring",
          config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
          calLink: "francescoronel/mentoring",
        },
      ],
      [
        "ui",
        {
          cssVarsPerTheme: { light: { "cal-brand": "#171717" }, dark: { "cal-brand": "#efb920" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        },
      ],
    ]);

    // Later calls reuse the loaded script and existing namespaces
    cal("preload", { calLink: "x" });
    cal("init", { origin: "https://app.cal.com" });
    cal("init", "mentoring", { again: true });
    expect(calScripts()).toHaveLength(1);
    expect(cal.q).toEqual([
      ["initNamespace", "mentoring"],
      ["preload", { calLink: "x" }],
      ["init", { origin: "https://app.cal.com" }],
      ["initNamespace", "mentoring"],
    ]);
    expect((cal.ns!.mentoring as unknown as Queued).q.at(-1)).toEqual(["init", "mentoring", { again: true }]);

    // A reset stub keeps its existing queue but loads the script again
    cal.loaded = false;
    cal("ping");
    expect(cal.q!.at(-1)).toEqual(["ping"]);
    expect(cal.ns).toEqual({});
    expect(calScripts()).toHaveLength(2);

    expect(screen.getByText("Loading calendar...")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1200));
    expect(screen.queryByText("Loading calendar...")).not.toBeInTheDocument();
  });

  it("reuses an existing Cal global", () => {
    const mentoring = vi.fn();
    const existing = Object.assign(vi.fn(), { ns: { mentoring } });
    window.Cal = existing;
    render(<CalEmbed />);
    MockIntersectionObserver.instances[0].trigger(true);

    expect(window.Cal).toBe(existing);
    expect(existing).toHaveBeenCalledWith("init", "mentoring", { origin: "https://app.cal.com" });
    expect(mentoring).toHaveBeenCalledWith("inline", expect.objectContaining({ calLink: "francescoronel/mentoring" }));
    expect(mentoring).toHaveBeenCalledWith("ui", expect.objectContaining({ layout: "month_view" }));
    expect(calScripts()).toHaveLength(0);
  });

  it("cancels the loaded timer on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<CalEmbed />);
    MockIntersectionObserver.instances[0].trigger(true);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
