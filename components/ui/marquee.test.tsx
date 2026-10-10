// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Marquee } from "./marquee";

afterEach(cleanup);

describe("Marquee", () => {
  it("duplicates its children for a seamless loop at the default speed", () => {
    const { container } = render(
      <Marquee>
        <span>Tick</span>
      </Marquee>
    );
    expect(screen.getAllByText("Tick")).toHaveLength(2);
    const track = container.querySelector(".animate-marquee") as HTMLElement;
    expect(track.style.animationDuration).toBe("30s");
  });

  it("uses a custom speed", () => {
    const { container } = render(
      <Marquee speed={90}>
        <span>Tock</span>
      </Marquee>
    );
    const track = container.querySelector(".animate-marquee") as HTMLElement;
    expect(track.style.animationDuration).toBe("90s");
  });
});
