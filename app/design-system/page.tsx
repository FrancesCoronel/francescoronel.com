import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Design System",
  description:
    "Design tokens, colors, typography, and component reference for francescoronel.com.",
  path: "/design-system",
});

const navyColors = [
  { name: "navy-50", hex: "#f0f1f5" },
  { name: "navy-100", hex: "#d9dce6" },
  { name: "navy-200", hex: "#b3b9cd" },
  { name: "navy-300", hex: "#8d96b4" },
  { name: "navy-400", hex: "#67739b" },
  { name: "navy-500", hex: "#4a5578" },
  { name: "navy-600", hex: "#3b4461" },
  { name: "navy-700", hex: "#2c334a" },
  { name: "navy-800", hex: "#1e2233" },
  { name: "navy-900", hex: "#141726" },
  { name: "navy-950", hex: "#0b0d17" },
];

const horchatColors = [
  { name: "horchata-50", hex: "#fdf8f3" },
  { name: "horchata-100", hex: "#f9ede0" },
  { name: "horchata-200", hex: "#f3dbc1" },
  { name: "horchata-300", hex: "#ecc9a2" },
  { name: "horchata-400", hex: "#e5b783" },
  { name: "horchata-500", hex: "#dfa564" },
  { name: "horchata-600", hex: "#c98e4e" },
  { name: "horchata-700", hex: "#a6743f" },
  { name: "horchata-800", hex: "#835b31" },
  { name: "horchata-900", hex: "#604223" },
  { name: "horchata-950", hex: "#3d2a16" },
];

const typographyScale = [
  { name: "text-xs", size: "20px (1.25rem)", lineHeight: "28px", usage: "Dates, meta, badges (floor)" },
  { name: "text-sm", size: "20px (1.25rem)", lineHeight: "28px", usage: "Card body, captions (floor)" },
  { name: "text-base", size: "22px (1.375rem)", lineHeight: "32px", usage: "Standard body text" },
  { name: "text-lg", size: "28px (1.75rem)", lineHeight: "36px", usage: "Card titles, sub-headings" },
  { name: "text-xl", size: "32px (2rem)", lineHeight: "40px", usage: "Section titles" },
  { name: "text-2xl", size: "38px (2.375rem)", lineHeight: "46px", usage: "Page sub-headings" },
  { name: "text-3xl", size: "46px (2.875rem)", lineHeight: "54px", usage: "Page titles" },
  { name: "text-4xl", size: "56px (3.5rem)", lineHeight: "64px", usage: "Hero headings" },
  { name: "text-5xl", size: "68px (4.25rem)", lineHeight: "76px", usage: "Large hero text" },
];

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="h-16 w-full rounded-lg"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 text-sm font-medium text-navy-900 dark:text-horchata-100">
        {name}
      </p>
      <p className="text-xs text-navy-500 dark:text-horchata-400">{hex}</p>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-horchata-50 py-16 dark:bg-navy-900">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Reference
          </p>
          <h1 className="mt-2 text-4xl font-bold text-navy-900 dark:text-horchata-100 md:text-5xl">
            Design System
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-white/70">
            Colors, typography, spacing, and component patterns used across
            francescoronel.com. Built with Tailwind CSS 4.
          </p>
          <div className="mt-6">
            <a
              href="https://69c087c8a9b267e23aa27530-wqalrhjovn.chromatic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.34.99l-.09 2.12a.19.19 0 00.31.16l1.13-.87.87.71a.19.19 0 00.31-.16l-.09-1.83L19.74 1A1.18 1.18 0 0120.93 2l.07.46V22a1.19 1.19 0 01-1 1.17l-15.28.82A1.18 1.18 0 013.5 22.8V1.2A1.18 1.18 0 014.62.01L16.34.99zM13.7 9.12c0 .6 4.05.31 4.6-.11 0-4.4-2.37-6.71-6.69-6.71-4.33 0-6.75 2.35-6.75 5.86 0 6.09 8.21 6.2 8.21 9.52 0 1.05-.49 1.65-1.6 1.65-1.49 0-2.08-.76-2.03-3.32 0-.45-4.71-.6-4.82 0-.24 5.15 2.85 6.64 6.9 6.64 3.95 0 7.02-2.1 7.02-5.91 0-6.53-8.32-6.35-8.32-9.58 0-1.31.98-1.49 1.65-1.49.73 0 1.83.17 1.83 3.45z" />
              </svg>
              Open Storybook
            </a>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Tokens
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Colors
          </h2>

          {/* Navy */}
          <h3 className="mt-10 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Navy (Primary)
          </h3>
          <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
            Dark blues used for text, backgrounds, and elevated surfaces.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
            {navyColors.map((c) => (
              <ColorSwatch key={c.name} name={c.name} hex={c.hex} />
            ))}
          </div>

          {/* Horchata */}
          <h3 className="mt-14 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Horchata (Accent)
          </h3>
          <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
            Warm beige and tan tones for accents, highlights, and interactive
            elements.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
            {horchatColors.map((c) => (
              <ColorSwatch key={c.name} name={c.name} hex={c.hex} />
            ))}
          </div>

          {/* Semantic */}
          <h3 className="mt-14 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Semantic Usage
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <div className="h-10 w-10 rounded-lg bg-horchata-50 dark:bg-navy-900" />
              <p className="mt-3 font-medium text-navy-900 dark:text-horchata-100">
                Light Background
              </p>
              <p className="text-sm text-navy-500 dark:text-horchata-400">
                horchata-50 / navy-900
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <div className="h-10 w-10 rounded-lg bg-navy-900 dark:bg-navy-950" />
              <p className="mt-3 font-medium text-navy-900 dark:text-horchata-100">
                Dark Section
              </p>
              <p className="text-sm text-navy-500 dark:text-horchata-400">
                navy-900 / navy-950
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <div className="h-10 w-10 rounded-lg bg-horchata-400" />
              <p className="mt-3 font-medium text-navy-900 dark:text-horchata-100">
                Accent
              </p>
              <p className="text-sm text-navy-500 dark:text-horchata-400">
                horchata-400 (#e5b783)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="border-y border-horchata-200 bg-white py-16 dark:border-navy-700 dark:bg-navy-800/50 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Tokens
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Typography
          </h2>

          {/* Font Families */}
          <h3 className="mt-10 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Latina Essential (All Text)
          </h3>
          <div className="mt-6 rounded-xl border border-horchata-200 bg-horchata-50 p-6 dark:border-navy-700 dark:bg-navy-800">
            <p className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
              Latina Essential
            </p>
            <p className="mt-2 text-sm text-navy-500 dark:text-horchata-400">
              Primary typeface &mdash; used for all text across the site including
              headings, body, labels, and UI elements.
              Loaded locally via next/font/local. Designed by Latinotype.
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-lg font-light text-navy-700 dark:text-horchata-200" style={{ fontFamily: "var(--font-latina)" }}>
                Light (300): The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-lg font-medium text-navy-700 dark:text-horchata-200" style={{ fontFamily: "var(--font-latina)" }}>
                Medium (500): The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-lg font-bold text-navy-700 dark:text-horchata-200" style={{ fontFamily: "var(--font-latina)" }}>
                Bold (700): The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-lg text-navy-700 dark:text-horchata-200" style={{ fontFamily: "var(--font-latina)", fontWeight: 900 }}>
                Heavy (900): The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>

          <h3 className="mt-10 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Cabin (Fallback)
          </h3>
          <div className="mt-6 rounded-xl border border-horchata-200 bg-horchata-50 p-6 dark:border-navy-700 dark:bg-navy-800">
            <p className="text-3xl font-bold text-navy-900 dark:text-horchata-100" style={{ fontFamily: "var(--font-cabin)" }}>
              Cabin
            </p>
            <p className="mt-2 text-sm text-navy-500 dark:text-horchata-400">
              Fallback typeface &mdash; available as a secondary option via
              next/font/google. Previously used as the body font.
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-lg font-normal text-navy-700 dark:text-horchata-200">
                Regular (400): The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-lg font-medium text-navy-700 dark:text-horchata-200">
                Medium (500): The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-lg font-semibold text-navy-700 dark:text-horchata-200">
                Semibold (600): The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-lg font-bold text-navy-700 dark:text-horchata-200">
                Bold (700): The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>

          {/* Type Scale */}
          <h3 className="mt-14 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Type Scale
          </h3>
          <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
            20px minimum baseline enforced for accessibility. Aggressive
            heading scale creates strong visual hierarchy.
          </p>
          <div className="mt-6 space-y-0 divide-y divide-horchata-200 rounded-xl border border-horchata-200 bg-white dark:divide-navy-700 dark:border-navy-700 dark:bg-navy-800">
            {typographyScale.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-6 p-4"
              >
                <div className="w-28 flex-shrink-0">
                  <p className="font-mono text-sm font-medium text-horchata-700 dark:text-horchata-400">
                    {t.name}
                  </p>
                </div>
                <div className="w-40 flex-shrink-0">
                  <p className="text-sm text-navy-500 dark:text-horchata-400">
                    {t.size}
                  </p>
                  <p className="text-xs text-navy-400 dark:text-horchata-500">
                    LH: {t.lineHeight}
                  </p>
                </div>
                <p
                  className="flex-1 font-bold text-navy-900 dark:text-horchata-100"
                  style={{ fontSize: t.size.split(" ")[0] }}
                >
                  Aa
                </p>
                <p className="hidden text-sm text-navy-500 dark:text-horchata-400 md:block">
                  {t.usage}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing & Layout */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Layout
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Spacing & Layout
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Container Max Width
              </p>
              <p className="mt-1 font-mono text-sm text-horchata-700 dark:text-horchata-400">
                1200px
              </p>
              <p className="mt-2 text-sm text-navy-500 dark:text-horchata-400">
                var(--container-max) with px-6 padding
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Section Padding
              </p>
              <p className="mt-1 font-mono text-sm text-horchata-700 dark:text-horchata-400">
                py-16 md:py-20
              </p>
              <p className="mt-2 text-sm text-navy-500 dark:text-horchata-400">
                64px mobile, 80px desktop
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Card Radius
              </p>
              <p className="mt-1 font-mono text-sm text-horchata-700 dark:text-horchata-400">
                rounded-2xl (16px)
              </p>
              <p className="mt-2 text-sm text-navy-500 dark:text-horchata-400">
                Used on all cards, modals, and elevated surfaces
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="border-y border-horchata-200 bg-white py-16 dark:border-navy-700 dark:bg-navy-800/50 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Components
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Buttons & Interactive
          </h2>

          {/* Buttons */}
          <h3 className="mt-10 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Buttons
          </h3>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-navy-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400">
              Primary Button
            </button>
            <button className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700">
              Secondary Button
            </button>
            <button className="rounded-full bg-horchata-500 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:bg-horchata-400">
              Accent Button
            </button>
          </div>

          {/* Links */}
          <h3 className="mt-14 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Links
          </h3>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
            >
              Standard Link →
            </a>
            <a
              href="#"
              className="text-sm font-medium underline underline-offset-2 decoration-horchata-300 hover:text-horchata-700 dark:decoration-navy-500 dark:hover:text-horchata-400"
            >
              Underlined Link
            </a>
          </div>

          {/* Badges */}
          <h3 className="mt-14 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Badges
          </h3>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-navy-900 px-3 py-1 text-xs font-medium text-white dark:bg-navy-600 dark:text-white">
              Category Badge
            </span>
            <span className="inline-flex items-center rounded-full bg-navy-900 px-3 py-1 text-xs font-medium text-white hover:bg-navy-800 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500">
              #Tag Badge
            </span>
            <span className="inline-flex items-center rounded-full border border-navy-300 px-3 py-1 text-xs font-medium text-navy-500 dark:border-navy-600 dark:text-horchata-400">
              Outline Badge
            </span>
          </div>

          {/* Inputs */}
          <h3 className="mt-14 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Inputs
          </h3>
          <div className="mt-6 max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-horchata-200">
                Text Input
              </label>
              <input
                type="text"
                placeholder="Placeholder text"
                className="mt-1 block w-full rounded-lg border border-horchata-200 bg-white px-4 py-3 text-navy-900 placeholder-navy-400 focus:border-horchata-400 focus:outline-none focus:ring-1 focus:ring-horchata-400 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder-horchata-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-horchata-200">
                Dark Input (used in dark sections)
              </label>
              <input
                type="text"
                placeholder="Placeholder text"
                className="mt-1 block w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 text-horchata-100 placeholder-navy-400 focus:border-horchata-400 focus:outline-none focus:ring-1 focus:ring-horchata-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Components
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Cards
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Light Card */}
            <div className="rounded-2xl border border-horchata-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800">
              <h3 className="text-lg font-bold text-navy-900 dark:text-horchata-100">
                Standard Card
              </h3>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                Used for blog posts, testimonials, portfolio items, and general
                content containers.
              </p>
              <p className="mt-4 font-mono text-xs text-navy-400 dark:text-horchata-500">
                rounded-2xl border border-horchata-200 bg-white
              </p>
            </div>

            {/* Hover Card */}
            <div className="group cursor-pointer rounded-2xl border border-horchata-200 bg-white p-6 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500">
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                Interactive Card
              </h3>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                Cards that are links get hover states with border changes,
                shadow, and text color shifts.
              </p>
              <p className="mt-4 text-sm font-medium text-horchata-700 dark:text-horchata-400">
                Hover me →
              </p>
            </div>

            {/* Dark Card */}
            <div className="rounded-2xl border border-navy-700 bg-navy-800 p-6">
              <h3 className="text-lg font-bold text-horchata-100">
                Dark Card
              </h3>
              <p className="mt-2 text-sm text-horchata-300">
                Used in dark sections (experience, contact form, help topics).
              </p>
              <p className="mt-4 font-mono text-xs text-horchata-500">
                rounded-2xl border border-navy-700 bg-navy-800
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section className="border-y border-horchata-200 bg-white py-16 dark:border-navy-700 dark:bg-navy-800/50 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Tokens
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Shadows
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">shadow-sm</p>
              <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">Subtle elevation</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">shadow-md</p>
              <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">Default card shadow</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">shadow-lg</p>
              <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">Hover state shadow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus & Accessibility */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            A11y
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Accessibility
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Focus Ring
              </p>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                All interactive elements show a 2px horchata-500 outline with
                2px offset on :focus-visible.
              </p>
              <div className="mt-4">
                <button className="rounded-lg border border-horchata-200 px-4 py-2 text-sm text-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-horchata-500 focus-visible:outline-offset-2 dark:border-navy-600 dark:text-white/70">
                  Tab to me
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Minimum Font Size
              </p>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                20px enforced across the entire site via Tailwind theme
                overrides. Aggressive floor ensures readability at all
                breakpoints and prevents iOS Safari zoom on input focus.
              </p>
              <p className="mt-4 font-mono text-xs text-navy-400 dark:text-horchata-500">
                text-xs = text-sm = 20px (1.25rem)
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Dark Mode
              </p>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                Defaults to system preference via next-themes. Users can manually
                toggle between light and dark mode using the sun/moon button in the
                header. Class-based switching via Tailwind v4 custom variant.
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Semantic HTML
              </p>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                Proper heading hierarchy (h1 → h6), landmarks (section, nav,
                main), aria labels on decorative images.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Patterns */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Patterns
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Section Patterns
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                Label
              </p>
              <p className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100">
                Section Heading
              </p>
              <p className="mt-3 text-sm text-navy-500 dark:text-horchata-400">
                Sections use a small uppercase label above the main heading.
                Label is always horchata-500.
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Background Alternation
              </p>
              <p className="mt-2 text-sm text-navy-600 dark:text-white/70">
                Pages alternate between light (horchata-50), white, dark
                (navy-900), and accent (horchata-100) backgrounds to create
                visual rhythm.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ConnectCTA />
    </>
  );
}
