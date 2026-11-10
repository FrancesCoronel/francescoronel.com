// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Lightbox } from "./lightbox";
import { ZoomableImage } from "./zoomable-image";

/* eslint-disable @next/next/no-img-element */
function Gallery() {
  return (
    <Lightbox className="prose">
      <p>Intro text</p>
      <img src="https://example.com/one.png" alt="First photo" />
      <a href="/elsewhere">
        <img src="https://example.com/linked.png" alt="Linked photo" />
      </a>
      <img src="https://example.com/two.png" alt="Second photo" />
      <img src="https://example.com/three.png" alt="" />
    </Lightbox>
  );
}
/* eslint-enable @next/next/no-img-element */

function viewerImage() {
  return screen.getByRole("dialog", { name: "Image viewer" }).querySelector("img")!;
}

afterEach(cleanup);

describe("Lightbox", () => {
  it("wraps children in a container and marks only unlinked images as zoomable", () => {
    const { container } = render(<Gallery />);
    expect(container.firstElementChild).toHaveClass("prose");
    expect(screen.getByAltText("First photo").style.cursor).toBe("zoom-in");
    expect(screen.getByAltText("Linked photo").style.cursor).toBe("");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ignores clicks on text and linked images", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getByText("Intro text"));
    fireEvent.click(screen.getByAltText("Linked photo"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the clicked image with a counter and caption, and locks scroll", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getByAltText("Second photo"));

    expect(viewerImage()).toHaveAttribute("src", "https://example.com/two.png");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getAllByText("Second photo")).toHaveLength(1);
    expect(document.body.style.overflow).toBe("hidden");

    // Clicking the enlarged image itself keeps the viewer open
    await user.click(viewerImage());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("cycles through images with the buttons and arrow keys, wrapping at the ends", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getByAltText("First photo"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(viewerImage()).toHaveAttribute("alt", "");

    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveTextContent("First photo");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    await user.keyboard("a");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("closes with Escape, the close button and the backdrop", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    await user.click(screen.getByAltText("First photo"));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");

    await user.click(screen.getByAltText("First photo"));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByAltText("First photo"));
    await user.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("toggles between fitted and full size from the image or the button, and resets on navigation", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getByAltText("First photo"));

    const toggle = screen.getByRole("button", { name: "Full size" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(viewerImage()).toHaveClass("max-w-[90vw]", "cursor-zoom-in");

    // Tapping the image shows it at full size and hides the caption that would cover it
    await user.click(viewerImage());
    expect(viewerImage()).toHaveClass("max-w-none", "cursor-zoom-out");
    expect(screen.getByRole("button", { name: "Fit to screen" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("dialog")).not.toHaveTextContent("First photo");

    await user.click(screen.getByRole("button", { name: "Fit to screen" }));
    expect(viewerImage()).toHaveClass("max-w-[90vw]");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Moving to another image always starts fitted
    await user.click(screen.getByRole("button", { name: "Full size" }));
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(viewerImage()).toHaveClass("max-w-[90vw]");
    await user.click(viewerImage());
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(viewerImage()).toHaveClass("max-w-[90vw]");
  });

  it("shows the full-size file of a ZoomableImage and opens only one viewer", async () => {
    const user = userEvent.setup();
    render(
      <Lightbox>
        <ZoomableImage src="https://example.com/full.png" alt="Screenshot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://example.com/thumb.png" alt="Screenshot" />
        </ZoomableImage>
      </Lightbox>
    );
    await user.click(screen.getByAltText("Screenshot"));

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(viewerImage()).toHaveAttribute("src", "https://example.com/full.png");
  });

  it("prefers the srcset candidate the browser picked over the plain src", async () => {
    const user = userEvent.setup();
    render(
      <Lightbox>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://example.com/small.png" alt="Responsive" />
      </Lightbox>
    );
    const img = screen.getByAltText("Responsive");
    Object.defineProperty(img, "currentSrc", { value: "https://example.com/large.png" });
    await user.click(img);
    expect(viewerImage()).toHaveAttribute("src", "https://example.com/large.png");
  });

  it("hides navigation, counter and caption for a single image without alt text", async () => {
    const user = userEvent.setup();
    render(
      <Lightbox>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src="https://example.com/solo.png" data-testid="solo" />
      </Lightbox>
    );
    await user.click(screen.getByTestId("solo"));
    expect(viewerImage()).toHaveAttribute("src", "https://example.com/solo.png");
    expect(viewerImage()).toHaveAttribute("alt", "");
    expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous image" })).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
  });
});
