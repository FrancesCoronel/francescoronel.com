"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isValid = name.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  return (
    <form
      action="https://formspree.io/f/xpznqkdl"
      method="POST"
      className="space-y-5"
      noValidate
    >
      {/* Honeypot field — hidden from real users, bots will fill it */}
      <input
        type="text"
        name="_gotcha"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <p className="text-xs text-navy-500 dark:text-white/40">
        Fields marked with <span className="text-red-500" aria-hidden="true">*</span> are required.
      </p>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-navy-700 dark:text-white/70"
        >
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
          className="mt-1 block w-full rounded-lg border border-horchata-300 bg-white px-4 py-3 text-navy-900 placeholder-navy-400 focus:border-horchata-500 focus:outline-none focus:ring-1 focus:ring-horchata-500 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder-navy-400 dark:focus:border-horchata-400 dark:focus:ring-horchata-400"
          placeholder="Your name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-navy-700 dark:text-white/70"
        >
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
          className="mt-1 block w-full rounded-lg border border-horchata-300 bg-white px-4 py-3 text-navy-900 placeholder-navy-400 focus:border-horchata-500 focus:outline-none focus:ring-1 focus:ring-horchata-500 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder-navy-400 dark:focus:border-horchata-400 dark:focus:ring-horchata-400"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-navy-700 dark:text-white/70"
        >
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
          className="mt-1 block w-full rounded-lg border border-horchata-300 bg-white px-4 py-3 text-navy-900 placeholder-navy-400 focus:border-horchata-500 focus:outline-none focus:ring-1 focus:ring-horchata-500 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder-navy-400 dark:focus:border-horchata-400 dark:focus:ring-horchata-400"
          placeholder="What would you like to chat about?"
        />
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="w-full rounded-full bg-horchata-700 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-horchata-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
      >
        Send Message
      </button>
    </form>
  );
}
