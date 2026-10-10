import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Vite's client (jsdom) transform refuses to resolve the build-time
// "/pagefind/pagefind.js" import, so this file runs in the node environment
// and installs the jsdom globals itself before anything else is imported
const dom = await vi.hoisted(async () => {
  const { builtinEnvironments } = await import("vitest/environments");
  return builtinEnvironments.jsdom.setup(globalThis, {});
});
afterAll(() => dom.teardown(globalThis));

import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { pagefind } = vi.hoisted(() => ({
  pagefind: { init: vi.fn(), search: vi.fn() },
}));

vi.mock("/pagefind/pagefind.js", () => pagefind);

import { PagefindSearch } from "./pagefind-search";

function hit(url: string, title?: string, excerpt = `About ${url}`) {
  return {
    id: url,
    data: async () => ({
      id: url,
      url,
      excerpt,
      meta: title === undefined ? undefined : { title },
    }),
  };
}

async function setup() {
  const user = userEvent.setup();
  render(<PagefindSearch />);
  const input = screen.getByPlaceholderText("Search all content...");
  await user.click(input);
  return { user, input };
}

beforeEach(() => {
  pagefind.init.mockReset().mockResolvedValue(undefined);
  pagefind.search.mockReset().mockResolvedValue({
    results: [hit("/blog/first-post.html", "First Post", "a <mark>match</mark>"), hit("about/index.html")],
  });
});

afterEach(cleanup);

describe("PagefindSearch", () => {
  it("does not load Pagefind until the input is focused, and only once", async () => {
    const user = userEvent.setup();
    render(<PagefindSearch />);
    expect(pagefind.init).not.toHaveBeenCalled();

    const input = screen.getByPlaceholderText("Search all content...");
    await user.click(input);
    await waitFor(() => expect(pagefind.init).toHaveBeenCalledTimes(1));

    await user.tab();
    await user.click(input);
    expect(pagefind.init).toHaveBeenCalledTimes(1);
  });

  it("shows up to 10 results with normalised URLs, title fallbacks and highlighted excerpts", async () => {
    const { user, input } = await setup();
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    await user.type(input, "match");

    const first = await screen.findByRole("link", { name: /First Post/ });
    expect(first).toHaveAttribute("href", "/blog/first-post");
    expect(first.querySelector("mark")).toHaveTextContent("match");
    expect(screen.getByRole("link", { name: /about\/index\.html/ })).toHaveAttribute("href", "/about");
    expect(pagefind.search).toHaveBeenLastCalledWith("match");

    pagefind.search.mockResolvedValue({
      results: Array.from({ length: 14 }, (_, i) => hit(`/p${i}.html`, `Post ${i}`)),
    });
    await user.type(input, "es");
    await screen.findByRole("link", { name: /Post 0/ });
    expect(screen.getAllByRole("listitem")).toHaveLength(10);
  });

  it("clears the query and results when a result is clicked", async () => {
    const { user, input } = await setup();
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    await user.type(input, "post");
    await user.click(await screen.findByRole("link", { name: /First Post/ }));
    expect(input).toHaveValue("");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows a spinner while searching and a no-results message when nothing matches", async () => {
    let resolve!: (v: unknown) => void;
    pagefind.search.mockImplementation(() => new Promise((r) => (resolve = r)));
    const { user, input } = await setup();
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    await user.type(input, "zzz");
    await waitFor(() => expect(pagefind.search).toHaveBeenCalledWith("zzz"));
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.queryByText(/No results/)).not.toBeInTheDocument();

    await act(async () => resolve({ results: [] }));
    expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
    expect(screen.getByText(/No results for/)).toHaveTextContent("No results for “zzz”");
  });

  it("treats a failed search as no results", async () => {
    pagefind.search.mockRejectedValue(new Error("boom"));
    const { user, input } = await setup();
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    await user.type(input, "oops");
    await waitFor(() => expect(pagefind.search).toHaveBeenCalledWith("oops"));
    expect(await screen.findByText(/No results for/)).toHaveTextContent("No results for “oops”");
  });

  it("hides the dropdown when the query is blank", async () => {
    const { user, input } = await setup();
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    await user.type(input, "post");
    await screen.findByRole("link", { name: /First Post/ });
    await user.clear(input);
    await user.type(input, "   ");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText(/No results/)).not.toBeInTheDocument();
  });

  it("silently shows nothing when Pagefind is unavailable (dev mode)", async () => {
    pagefind.init.mockRejectedValue(new Error("missing"));
    const { user, input } = await setup();
    await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
    await user.type(input, "x");
    expect(pagefind.search).not.toHaveBeenCalled();
    expect(screen.queryByText(/No results/)).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
