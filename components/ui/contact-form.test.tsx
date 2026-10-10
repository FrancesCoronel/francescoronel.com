// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./contact-form";

const GENERIC_ERROR = "Something went wrong. Please try again.";

function stubFetch(impl: () => Promise<unknown>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/), "Ada Lovelace");
  await user.type(screen.getByLabelText(/^Email Address/), "ada@example.com");
  await user.type(screen.getByLabelText(/^Message/), "Hello there");
}

afterEach(cleanup);

describe("ContactForm", () => {
  it("keeps submit disabled until every field has non-blank content", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const submit = screen.getByRole("button", { name: "Send Message" });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/^Name/), "Ada");
    await user.type(screen.getByLabelText(/^Email Address/), "ada@example.com");
    await user.type(screen.getByLabelText(/^Message/), "   ");
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/^Message/), "hi");
    expect(submit).toBeEnabled();
    expect(document.querySelector('input[name="_gotcha"]')).toHaveStyle({ display: "none" });
  });

  it("posts to Formspree, shows a loading state, then a success message", async () => {
    let resolve!: (v: unknown) => void;
    const fetchMock = stubFetch(() => new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(fetchMock).toHaveBeenCalledWith("https://formspree.io/f/mqkogqjn", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" }),
    });
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
    expect(screen.getByLabelText(/^Name/)).toBeDisabled();
    expect(screen.getByLabelText(/^Email Address/)).toBeDisabled();
    expect(screen.getByLabelText(/^Message/)).toBeDisabled();

    await act(async () => resolve({ ok: true }));
    expect(screen.getByText("Message sent! 🎉")).toBeInTheDocument();
    expect(screen.getByText(/Thanks for reaching out/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Send another message" }));
    expect(screen.getByLabelText(/^Name/)).toHaveValue("");
    expect(screen.getByLabelText(/^Email Address/)).toHaveValue("");
    expect(screen.getByLabelText(/^Message/)).toHaveValue("");
    expect(screen.getByRole("button", { name: "Send Message" })).toBeDisabled();
  });

  it.each([
    ["the API error message", { ok: false, json: () => Promise.resolve({ error: "Email is invalid" }) }, "Email is invalid"],
    ["a generic message when no error is given", { ok: false, json: () => Promise.resolve({}) }, GENERIC_ERROR],
    ["a generic message when the body is not JSON", { ok: false, json: () => Promise.reject(new Error("bad json")) }, GENERIC_ERROR],
  ])("shows %s on a failed response", async (_label, response, expected) => {
    stubFetch(() => Promise.resolve(response));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText(expected)).toBeInTheDocument();
    // Input is kept so the visitor can retry
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Ada Lovelace");
    expect(screen.getByRole("button", { name: "Send Message" })).toBeEnabled();
  });

  it("shows a generic error when the request fails", async () => {
    stubFetch(() => Promise.reject(new Error("offline")));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();
  });
});
