// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Image from "next/image";
import { ZoomableImage } from "./zoomable-image";

afterEach(cleanup);

function setup(className?: string) {
  render(
    <ZoomableImage src="/full.png" alt="A corgi" className={className}>
      <Image src="/thumb.png" alt="thumb" width={100} height={100} />
    </ZoomableImage>
  );
  return screen.getByRole("button", { name: "Zoom: A corgi" });
}

describe("ZoomableImage", () => {
  it("wraps the thumbnail in a zoom trigger", () => {
    const trigger = setup("my-6");
    expect(trigger).toHaveClass("cursor-zoom-in", "my-6");
    expect(trigger).toContainElement(screen.getByAltText("thumb"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("works without a className", () => {
    const trigger = setup();
    expect(trigger.className).not.toContain("undefined");
  });

  it("opens on click, locks scrolling and closes with Escape", () => {
    fireEvent.click(setup());
    const dialog = screen.getByRole("dialog", { name: "A corgi" });
    expect(dialog.querySelector("img")).toHaveAttribute("src", "/full.png");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("opens with the Enter key only", () => {
    const trigger = setup();
    fireEvent.keyDown(trigger, { key: " " });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("stays open when the full image is clicked and closes on the backdrop", () => {
    fireEvent.click(setup());
    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog.querySelector("img")!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes with the close button", () => {
    fireEvent.click(setup());
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
