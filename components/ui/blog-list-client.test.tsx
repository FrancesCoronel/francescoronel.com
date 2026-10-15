// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { Category } from "@/lib/types";
import { BlogListClient } from "./blog-list-client";

const posts = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const categories = [];
  if (n % 2 === 0) categories.push("design");
  if (n % 5 === 0) categories.push("career");
  return {
    slug: `post-${n}`,
    title: `Post ${n}`,
    excerpt: `Excerpt ${n}`,
    date: `2024-01-${String(n).padStart(2, "0")}`,
    readingTime: "3 min read",
    featuredImage: "",
    categories,
  };
});

const categories: Category[] = [
  { name: "Design", slug: "design", color: "", description: "", image: "/images/design.png", count: 10 },
  { name: "Career", slug: "career", color: "", description: "", emoji: "💼", count: 4 },
  { name: "Events", slug: "events", color: "", description: "", count: 3 },
  { name: "Empty", slug: "empty", color: "", description: "", count: 0 },
  { name: "Uncounted", slug: "uncounted", color: "", description: "" },
];

function cardTitles() {
  return screen.queryAllByRole("article").map((a) => a.querySelector("h3")!.textContent);
}

afterEach(cleanup);

describe("BlogListClient", () => {
  it("lists category filters with their icons and counts, skipping empty ones", () => {
    render(<BlogListClient posts={posts} categories={categories} />);
    expect(screen.getByRole("button", { name: "All (20)" })).toHaveClass("bg-horchata-700");

    const design = screen.getByRole("button", { name: "Design (10)" });
    expect(design.querySelector("img")).toHaveAttribute("src", "/images/design.png");
    expect(screen.getByRole("button", { name: "Career (4)" })).toHaveTextContent("💼Career (4)");
    const events = screen.getByRole("button", { name: "Events (3)" });
    expect(events.querySelector("img, span")).toBeNull();
    expect(screen.queryByRole("button", { name: /Empty|Uncounted/ })).not.toBeInTheDocument();
  });

  it("paginates 18 posts per page and passes category images to the cards", async () => {
    const user = userEvent.setup();
    render(<BlogListClient posts={posts} categories={categories} />);
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();
    expect(cardTitles()).toHaveLength(18);
    expect(screen.getByRole("link", { name: "Post 1" })).toHaveAttribute("href", "/posts/post-1");
    const designCard = screen.getByRole("link", { name: "Post 2" }).closest("article")!;
    expect(designCard.querySelector('img[src="/images/design.png"]')).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("Showing 2 of 20 posts")).toBeInTheDocument();
    expect(cardTitles()).toEqual(["Post 19", "Post 20"]);
  });

  it("filters by category, resets to page 1 and toggles off on a second click", async () => {
    const user = userEvent.setup();
    render(<BlogListClient posts={posts} categories={categories} />);
    await user.click(screen.getByRole("button", { name: "2" }));

    const career = screen.getByRole("button", { name: "Career (4)" });
    await user.click(career);
    expect(career).toHaveClass("bg-horchata-700");
    expect(screen.getByRole("button", { name: "All (20)" })).not.toHaveClass("bg-horchata-700");
    expect(screen.getByText('Showing 4 of 4 posts in "career"')).toBeInTheDocument();
    expect(cardTitles()).toEqual(["Post 5", "Post 10", "Post 15", "Post 20"]);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    await user.click(career);
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Design (10)" }));
    expect(screen.getByText('Showing 10 of 10 posts in "design"')).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All (20)" }));
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();
  });

  it("shows an empty state with a way back to all posts", async () => {
    const user = userEvent.setup();
    render(<BlogListClient posts={posts} categories={categories} />);
    expect(screen.queryByText("No posts found in this category.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Events (3)" }));
    expect(screen.getByText('Showing 0 of 0 posts in "events"')).toBeInTheDocument();
    expect(screen.getByText("No posts found in this category.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show all posts" }));
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();
    expect(screen.queryByText("No posts found in this category.")).not.toBeInTheDocument();
  });

  it("omits the filter bar when there are no categories", () => {
    render(<BlogListClient posts={posts.slice(0, 2)} categories={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 2 posts")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Posts", level: 2 })).toHaveClass("sr-only");
  });
});
