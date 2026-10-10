// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { Testimonial } from "@/lib/types";
import { TestimonialCard } from "./testimonial-card";

afterEach(cleanup);

const base: Testimonial = {
  name: "Ada",
  slug: "ada",
  role: "Engineer",
  organization: "Slack",
  quote: "Frances is great.",
  image: "",
  featured: false,
};

describe("TestimonialCard", () => {
  it("links to the testimonial and shows the full short quote", () => {
    render(<TestimonialCard testimonial={base} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/testimonials/ada");
    expect(screen.getByText("“Frances is great.”")).toBeInTheDocument();
    expect(screen.getByText("Engineer at Slack")).toBeInTheDocument();
  });

  it("truncates long quotes to 280 characters", () => {
    const quote = `${"a".repeat(279)} ${"b".repeat(50)}`;
    render(<TestimonialCard testimonial={{ ...base, quote }} />);
    expect(screen.getByText(`“${"a".repeat(279)}...”`)).toBeInTheDocument();
  });

  it("omits the organization when missing", () => {
    render(<TestimonialCard testimonial={{ ...base, organization: "" }} />);
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });
});
