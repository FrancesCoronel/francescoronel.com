"use client";

import { useState } from "react";
import Image from "next/image";

interface NewsletterFormProps {
  variant?: "footer" | "section" | "dark";
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
            ? "You're already subscribed, thanks for being here! 🎉"
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

  if (variant === "dark") {
    return (
      <div>
        {status === "success" ? (
          <div className="flex items-center gap-3">
            <Image src="/images/assets/memoji-wave.png" alt="" width={48} height={48} className="h-12 w-12 object-contain" aria-hidden="true" />
            <p className="text-sm text-horchata-400">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email-dark" className="sr-only">Email address</label>
            <input
              id="newsletter-email-dark"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-horchata-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex-shrink-0 rounded-xl bg-horchata-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-horchata-400 disabled:opacity-60 sm:w-auto"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-2 text-sm text-red-400">{message}</p>
        )}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div>
        {status === "success" ? (
          <div className="flex items-center gap-2">
            <Image src="/images/assets/memoji-wave.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" aria-hidden="true" />
            <p className="text-sm text-horchata-700 dark:text-horchata-400">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email-footer" className="sr-only">Email address</label>
            <input
              id="newsletter-email-footer"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="min-w-0 flex-1 rounded-lg border border-horchata-200 bg-white px-3 py-2.5 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-horchata-400 disabled:opacity-60 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:placeholder-white/40 dark:focus:ring-horchata-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-horchata-700 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-horchata-800 disabled:opacity-60 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400 sm:w-auto"
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
        <div className="flex items-center gap-3">
          <Image src="/images/assets/memoji-wave.png" alt="" width={48} height={48} className="h-12 w-12 object-contain" aria-hidden="true" />
          <p className="text-base text-navy-700 dark:text-horchata-300">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email-section" className="sr-only">Email address</label>
          <input
            id="newsletter-email-section"
            type="email"
            inputMode="email"
            autoComplete="email"
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
            className="w-full rounded-xl bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 disabled:opacity-60 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400 sm:w-auto"
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
