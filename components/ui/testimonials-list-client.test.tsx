// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { getTestimonials } from "@/lib/content";
import { TestimonialsListClient } from "./testimonials-list-client";

afterEach(cleanup);

const testimonials = getTestimonials();

describe("TestimonialsListClient", () => {
  it("shows the count and the first page of testimonials", () => {
    render(<TestimonialsListClient testimonials={testimonials} />);
    expect(screen.getByText(`${testimonials.length} testimonials`)).toBeInTheDocument();
    const cards = screen.getAllByRole("link");
    expect(cards).toHaveLength(12);
    expect(cards[0]).toHaveAttribute("href", `/testimonials/${testimonials[0].slug}`);
  });

  it("moves to the next page", () => {
    render(<TestimonialsListClient testimonials={testimonials} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getAllByRole("link")[0]).toHaveAttribute(
      "href",
      `/testimonials/${testimonials[12].slug}`
    );
  });

  it("hides pagination for a single page", () => {
    render(<TestimonialsListClient testimonials={testimonials.slice(0, 3)} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
