// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { pagefind, push } = vi.hoisted(() => ({
  pagefind: { init: vi.fn(), search: vi.fn() },
  push: vi.fn(),
}));

vi.mock("/pagefind/pagefind.js", () => pagefind);
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { SearchModal } from "./search-modal";

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

async function openModal() {
  const user = userEvent.setup();
  render(<SearchModal />);
  await user.click(screen.getByRole("button", { name: "Search (⌘K)" }));
  const input = await screen.findByPlaceholderText("Search all content...");
  // Wait for the Pagefind index to finish loading before typing
  await waitFor(() => expect(pagefind.init).toHaveBeenCalled());
  return { user, input };
}

beforeEach(() => {
  pagefind.init.mockReset().mockResolvedValue(undefined);
  pagefind.search.mockReset().mockResolvedValue({
    results: [hit("/blog/first-post.html", "First Post"), hit("/about/index.html", "About")],
  });
  push.mockReset();
});

afterEach(cleanup);

describe("SearchModal", () => {
  it("renders only the trigger button until opened", () => {
    render(<SearchModal />);
    expect(screen.getByRole("button", { name: "Search (⌘K)" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a dialog portalled to body, locks scroll, focuses the input and shows the hint", async () => {
    const { input } = await openModal();
    const dialog = screen.getByRole("dialog", { name: "Search" });
    expect(dialog.parentElement).toBe(document.body);
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByText(/Search across all 844\+ pages/)).toBeInTheDocument();
    await waitFor(() => expect(input).toHaveFocus());
  });

  it("opens with Cmd+K and Ctrl+K but not with a plain K", async () => {
    render(<SearchModal />);
    fireEvent.keyDown(window, { key: "k" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "j", metaKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    cleanup();

    render(<SearchModal />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("shows normalised result URLs, title fallbacks and sanitised excerpts", async () => {
    pagefind.search.mockResolvedValue({
      results: [
        hit("/blog/first-post.html", "First Post", "a <mark>match</mark> here<script>alert(1)</script> <b>bold"),
        hit("about/index.html", "About"),
        hit("/no-title.html"),
      ],
    });
    const { user, input } = await openModal();
    await user.type(input, "match");

    const first = await screen.findByRole("link", { name: /First Post/ });
    expect(first).toHaveAttribute("href", "/blog/first-post");
    expect(screen.getByRole("link", { name: /^About/ })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /\/no-title\.html/ })).toHaveAttribute("href", "/no-title");
    expect(pagefind.search).toHaveBeenLastCalledWith("match");

    const excerpt = first.querySelector("p + p")!;
    expect(excerpt.innerHTML).toBe("a <mark>match</mark> herealert(1) bold");
    expect(excerpt.querySelector("script")).toBeNull();
  });

  it("caps results at 12", async () => {
    pagefind.search.mockResolvedValue({
      results: Array.from({ length: 15 }, (_, i) => hit(`/p${i}.html`, `Post ${i}`)),
    });
    const { user, input } = await openModal();
    await user.type(input, "post");
    await screen.findByRole("link", { name: /Post 0/ });
    expect(screen.getAllByRole("listitem")).toHaveLength(12);
  });

  it("navigates results with the arrow keys and opens the selection with Enter", async () => {
    const { user, input } = await openModal();
    await user.type(input, "post");
    const first = await screen.findByRole("link", { name: /First Post/ });
    const about = screen.getByRole("link", { name: /^About/ });
    expect(first).toHaveClass("bg-horchata-50");

    await user.keyboard("{ArrowDown}");
    expect(about).toHaveClass("bg-horchata-50");
    expect(first).not.toHaveClass("bg-horchata-50");

    // Clamped at the last result
    await user.keyboard("{ArrowDown}");
    expect(about).toHaveClass("bg-horchata-50");

    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(first).toHaveClass("bg-horchata-50");

    await user.keyboard("{ArrowDown}{Enter}");
    expect(push).toHaveBeenCalledWith("/about");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("ignores Enter and other keys when there are no results", async () => {
    pagefind.search.mockResolvedValue({ results: [] });
    const { user, input } = await openModal();
    await user.type(input, "zzz");
    expect(await screen.findByText(/No results for/)).toHaveTextContent("No results for “zzz”");
    await user.keyboard("{Enter}a");
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows no results when the search throws", async () => {
    pagefind.search.mockRejectedValue(new Error("boom"));
    const { user, input } = await openModal();
    await user.type(input, "oops");
    await waitFor(() => expect(pagefind.search).toHaveBeenCalledWith("oops"));
    await waitFor(() => expect(document.querySelector(".animate-spin")).not.toBeInTheDocument());
    expect(screen.getByText(/No results for/)).toHaveTextContent("No results for “oops”");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows a spinner while a search is in flight and debounces typing", async () => {
    let resolve!: (v: unknown) => void;
    pagefind.search.mockImplementation(() => new Promise((r) => (resolve = r)));
    const { user, input } = await openModal();
    await user.type(input, "ab");
    await waitFor(() => expect(pagefind.search).toHaveBeenCalledTimes(1));
    expect(pagefind.search).toHaveBeenCalledWith("ab");
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();

    await act(async () => resolve({ results: [hit("/x.html", "X")] }));
    expect(await screen.findByRole("link", { name: /^X/ })).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();

    // A second search replaces the pending debounce timer
    await user.type(input, "c");
    await waitFor(() => expect(pagefind.search).toHaveBeenCalledWith("abc"));
  });

  it("clears results when the query is emptied", async () => {
    const { user, input } = await openModal();
    await user.type(input, "post");
    await screen.findByRole("link", { name: /First Post/ });
    await user.clear(input);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/Search across all 844\+ pages/)).toBeInTheDocument();
  });

  it("shows a loading message while the index is still loading", async () => {
    pagefind.init.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<SearchModal />);
    await user.click(screen.getByRole("button", { name: "Search (⌘K)" }));
    await user.type(await screen.findByPlaceholderText("Search all content..."), "x");
    expect(screen.getByText("Loading search index…")).toBeInTheDocument();
    expect(pagefind.search).not.toHaveBeenCalled();
  });

  it("explains that search needs a production build when Pagefind fails to load", async () => {
    pagefind.init.mockRejectedValue(new Error("missing"));
    const { user, input } = await openModal();
    await user.type(input, "x");
    expect(await screen.findByText(/Search requires a production build/)).toHaveTextContent(
      "Search requires a production build. Run npm run build to enable search."
    );
  });

  it("closes on Escape, backdrop click, the ESC button and result clicks", async () => {
    const { user } = await openModal();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Search (⌘K)" }));
    await user.click(screen.getByRole("dialog").firstElementChild as HTMLElement);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Search (⌘K)" }));
    await user.click(screen.getByRole("button", { name: "ESC" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Search (⌘K)" }));
    await user.type(screen.getByPlaceholderText("Search all content..."), "post");
    await user.click(await screen.findByRole("link", { name: /First Post/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("traps Tab focus inside the modal", async () => {
    const { user, input } = await openModal();
    await user.type(input, "post");
    const links = await screen.findAllByRole("link");
    const last = links[links.length - 1];
    const escButton = screen.getByRole("button", { name: "ESC" });

    // Tab from the last focusable wraps to the first (the input)
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(input).toHaveFocus();

    // Shift+Tab from the first wraps to the last
    fireEvent.keyDown(input, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();

    // Tab and Shift+Tab elsewhere are left to the browser
    escButton.focus();
    expect(fireEvent.keyDown(escButton, { key: "Tab" })).toBe(true);
    expect(fireEvent.keyDown(escButton, { key: "Tab", shiftKey: true })).toBe(true);
    expect(escButton).toHaveFocus();
  });

  it("leaves Tab alone when nothing in the modal is focusable", async () => {
    const { input } = await openModal();
    const escButton = screen.getByRole("button", { name: "ESC" });
    input.setAttribute("disabled", "");
    escButton.setAttribute("disabled", "");
    const modal = input.closest(".rounded-2xl") as HTMLElement;
    expect(fireEvent.keyDown(modal, { key: "Tab" })).toBe(true);
  });
});
