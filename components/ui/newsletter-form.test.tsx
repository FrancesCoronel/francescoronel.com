// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewsletterForm } from "./newsletter-form";

const GENERIC_ERROR = "Something went wrong. Please try again.";

function stubFetch(impl: () => Promise<unknown>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function respond(ok: boolean, body: unknown) {
  return () => Promise.resolve({ ok, json: () => Promise.resolve(body) });
}

const variants = [
  { variant: "section", inputId: "newsletter-email-section", loadingLabel: "Subscribing…" },
  { variant: "footer", inputId: "newsletter-email-footer", loadingLabel: "..." },
  { variant: "dark", inputId: "newsletter-email-dark", loadingLabel: "Subscribing…" },
] as const;

async function subscribe(email = "ada@example.com") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email address"), email);
  await user.click(screen.getByRole("button", { name: "Subscribe" }));
  return user;
}

afterEach(cleanup);

describe("NewsletterForm", () => {
  it("defaults to the section variant", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText("Email address")).toHaveAttribute("id", "newsletter-email-section");
  });

  describe.each(variants)("$variant variant", ({ variant, inputId, loadingLabel }) => {
    it("subscribes, showing a loading state, then a confirmation", async () => {
      let resolve!: (v: unknown) => void;
      const fetchMock = stubFetch(() => new Promise((r) => (resolve = r)));
      render(<NewsletterForm variant={variant} />);
      const input = screen.getByLabelText("Email address");
      expect(input).toHaveAttribute("id", inputId);
      expect(input).toBeRequired();

      await subscribe();
      expect(fetchMock).toHaveBeenCalledWith("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ada@example.com" }),
      });
      expect(screen.getByRole("button", { name: loadingLabel })).toBeDisabled();
      expect(input).toBeDisabled();

      await act(async () => resolve({ ok: true, json: () => Promise.resolve({}) }));
      expect(screen.getByText("You're in! Check your inbox to confirm. 🎉")).toBeInTheDocument();
      expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
    });

    it("thanks people who are already subscribed", async () => {
      stubFetch(respond(true, { alreadySubscribed: true }));
      render(<NewsletterForm variant={variant} />);
      await subscribe();
      expect(await screen.findByText("You're already subscribed, thanks for being here! 🎉")).toBeInTheDocument();
    });

    it("shows the API error and keeps the email for a retry", async () => {
      stubFetch(respond(false, { error: "Invalid email" }));
      render(<NewsletterForm variant={variant} />);
      await subscribe();
      expect(await screen.findByText("Invalid email")).toBeInTheDocument();
      expect(screen.getByLabelText("Email address")).toHaveValue("ada@example.com");
      expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
    });

    it("falls back to a generic error without an API message", async () => {
      stubFetch(respond(false, {}));
      render(<NewsletterForm variant={variant} />);
      await subscribe();
      expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();
    });

    it("shows a generic error when the request fails", async () => {
      stubFetch(() => Promise.reject(new Error("offline")));
      render(<NewsletterForm variant={variant} />);
      await subscribe();
      expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();
    });
  });
});
