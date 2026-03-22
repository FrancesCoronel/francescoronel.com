"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "footer" | "section";
}

export function NewsletterForm({ variant = "section" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          data.alreadySubscribed
            ? "You're already subscribed — thanks for being here! 🎉"
            : "You're in! Check your inbox to confirm. 🎉"
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (variant === "footer") {
    return (
      <div>
        {status === "success" ? (
          <p className="text-sm text-horchata-700 dark:text-horchata-400">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="min-w-0 flex-1 rounded-lg border border-horchata-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-horchata-400 disabled:opacity-60 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:placeholder-white/40 dark:focus:ring-horchata-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-horchata-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-horchata-800 disabled:opacity-60 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {status === "success" ? (
        <p className="text-base text-navy-700 dark:text-horchata-300">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            className="min-w-0 flex-1 rounded-xl border border-horchata-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-horchata-400 disabled:opacity-60 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:placeholder-white/40 dark:focus:ring-horchata-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 disabled:opacity-60 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
    </div>
  );
}
