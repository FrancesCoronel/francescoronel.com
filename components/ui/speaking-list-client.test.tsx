// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SpeakingListClient } from "./speaking-list-client";

afterEach(cleanup);

const posts = Array.from({ length: 14 }, (_, i) => ({
  slug: `talk-${i + 1}`,
  title: `Talk ${i + 1}`,
  excerpt: `About talk ${i + 1}`,
  date: "2024-05-01",
  readingTime: "4 min read",
  featuredImage: "",
  categories: ["speaking"],
}));

describe("SpeakingListClient", () => {
  it("paginates talks 12 per page under /posts without badges or reading time", () => {
    render(<SpeakingListClient posts={posts} categoryImages={{ speaking: "/mic.png" }} />);
    expect(screen.getAllByRole("article")).toHaveLength(12);
    expect(screen.getByRole("link", { name: "Talk 1" })).toHaveAttribute("href", "/posts/talk-1");
    expect(screen.queryByText("Speaking")).toBeNull();
    expect(screen.queryByText("4 min read")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Talk 14" })).toBeInTheDocument();
    expect(screen.queryByText("No speaking events found.")).toBeNull();
  });

  it("shows an empty state without pagination", () => {
    render(<SpeakingListClient posts={[]} />);
    expect(screen.getByText("No speaking events found.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
