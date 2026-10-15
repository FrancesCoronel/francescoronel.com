// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { BlogPost } from "@/lib/types";
import { BlogCard } from "./blog-card";

afterEach(cleanup);

const post: BlogPost = {
  slug: "hello world",
  title: "Hello World",
  date: "2024-02-03",
  excerpt: "An excerpt",
  featuredImage: "",
  categories: [],
  tags: [],
  organizations: [],
  skills: [],
  readingTime: "5 min read",
  content: "",
};

describe("BlogCard", () => {
  it("links the whole card to the encoded post URL under /blog by default", () => {
    render(<BlogCard post={post} />);
    expect(screen.getByRole("link", { name: "Hello World" })).toHaveAttribute(
      "href",
      "/blog/hello%20world"
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Hello World");
    expect(screen.getByText("An excerpt")).toBeInTheDocument();
    expect(screen.getByText("February 3, 2024")).toHaveAttribute("datetime", "2024-02-03");
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("uses a custom base path and can hide the reading time", () => {
    render(<BlogCard post={post} basePath="/posts" hideReadingTime />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/posts/hello%20world");
    expect(screen.queryByText("5 min read")).toBeNull();
  });

  it("hides one-minute reading times", () => {
    render(<BlogCard post={{ ...post, readingTime: "1 min read" }} />);
    expect(screen.queryByText("1 min read")).toBeNull();
  });

  it("uses next/image for optimizable featured images", () => {
    render(<BlogCard post={{ ...post, featuredImage: "https://cdn.prod.website-files.com/a.jpg" }} />);
    expect(screen.getByAltText("Hello World").getAttribute("src")).toContain("/_next/image?url=");
  });

  it("falls back to a lazy img for other hosts", () => {
    render(<BlogCard post={{ ...post, featuredImage: "https://example.com/a.jpg" }} />);
    const img = screen.getByAltText("Hello World");
    expect(img).toHaveAttribute("src", "https://example.com/a.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders capitalised category badges with optional icons", () => {
    const { container } = render(
      <BlogCard
        post={{ ...post, categories: ["speaking", "career"] }}
        categoryImages={{ speaking: "/icons/mic.png" }}
      />
    );
    expect(screen.getByText("Speaking")).toBeInTheDocument();
    expect(screen.getByText("Career")).toBeInTheDocument();
    const icons = container.querySelectorAll('img[aria-hidden="true"]');
    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveAttribute("src", "/icons/mic.png");
  });

  it("renders category badges without any category images", () => {
    const { container } = render(<BlogCard post={{ ...post, categories: ["tech"] }} />);
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});
