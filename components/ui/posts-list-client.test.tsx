// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { PostsListClient } from "./posts-list-client";

const posts = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  return {
    slug: `post-${n}`,
    title: n === 3 ? "Building Design Systems" : `Post ${n}`,
    excerpt: n === 7 ? "Notes on design tokens" : `Excerpt ${n}`,
    date: `2024-01-${String(n).padStart(2, "0")}`,
    readingTime: "3 min read",
    featuredImage: "",
    categories: n === 3 ? ["design"] : [],
  };
});

function cardTitles() {
  return screen.queryAllByRole("article").map((a) => a.querySelector("h3")!.textContent);
}

afterEach(cleanup);

describe("PostsListClient", () => {
  it("paginates 18 posts per page", async () => {
    const user = userEvent.setup();
    render(<PostsListClient posts={posts} />);
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Post 1" })).toHaveAttribute("href", "/posts/post-1");

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Showing 2 of 20 posts")).toBeInTheDocument();
    expect(cardTitles()).toEqual(["Post 19", "Post 20"]);
  });

  it("searches titles and excerpts case-insensitively and resets the page", async () => {
    const user = userEvent.setup();
    render(<PostsListClient posts={posts} categoryImages={{ design: "/images/design.png" }} />);
    await user.click(screen.getByRole("button", { name: "2" }));

    const input = screen.getByPlaceholderText("Search posts...");
    await user.type(input, "DESIGN");
    expect(screen.getByText('Showing 2 of 2 posts matching "DESIGN"')).toBeInTheDocument();
    expect(cardTitles()).toEqual(["Building Design Systems", "Post 7"]);
    expect(screen.getByRole("link", { name: "Building Design Systems" }).closest("article")!.querySelector("img")).toHaveAttribute(
      "src",
      "/images/design.png"
    );
  });

  it("treats a whitespace-only query as no search", async () => {
    const user = userEvent.setup();
    render(<PostsListClient posts={posts} />);
    await user.type(screen.getByPlaceholderText("Search posts..."), "   ");
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();
  });

  it("shows an empty state that can clear the search", async () => {
    const user = userEvent.setup();
    render(<PostsListClient posts={posts} />);
    const input = screen.getByPlaceholderText("Search posts...");
    await user.type(input, "kubernetes");
    expect(screen.getByText('No posts found matching "kubernetes".')).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    expect(screen.getByText("Showing 18 of 20 posts")).toBeInTheDocument();
  });

  it("can hide the search box and shows a plain empty state without posts", () => {
    render(<PostsListClient posts={[]} hideSearch />);
    expect(screen.queryByPlaceholderText("Search posts...")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 0 of 0 posts")).toBeInTheDocument();
    expect(screen.getByText("No posts found.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
