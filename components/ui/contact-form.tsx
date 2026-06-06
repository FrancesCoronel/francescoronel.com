"use client";

import { useState } from "react";
import Image from "next/image";

const FORMSPREE_URL = "https://formspree.io/f/mqkogqjn";

const inputClass =
  "mt-1 block w-full rounded-lg border border-horchata-300 bg-white px-4 py-3 text-navy-900 placeholder-navy-400 focus:border-horchata-500 focus:outline-none focus:ring-1 focus:ring-horchata-500 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder-navy-400 dark:focus:border-horchata-400 dark:focus:ring-horchata-400 disabled:opacity-60";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isValid = name.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-horchata-200 bg-horchata-50 px-8 py-12 text-center dark:border-navy-700 dark:bg-navy-800">
        <Image src="/images/assets/memoji-wave.png" alt="" width={72} height={72} className="h-18 w-18 object-contain" aria-hidden="true" />
        <p className="text-lg font-bold text-navy-900 dark:text-horchata-100">Message sent! 🎉</p>
        <p className="text-sm text-navy-600 dark:text-white/60">Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-full border border-horchata-300 px-6 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-100 dark:border-navy-600 dark:text-horchata-200 dark:hover:bg-navy-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <p className="text-xs text-navy-500 dark:text-white/60">
        Fields marked with <span className="text-red-500" aria-hidden="true">*</span> are required.
      </p>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy-700 dark:text-white/70">
          Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          aria-required="true"
          maxLength={100}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "loading"}
          className={inputClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy-700 dark:text-white/70">
          Email Address <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-required="true"
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-700 dark:text-white/70">
          Message <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "loading"}
          className={inputClass}
          placeholder="What would you like to chat about?"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        className="w-full rounded-full bg-horchata-700 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-horchata-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
