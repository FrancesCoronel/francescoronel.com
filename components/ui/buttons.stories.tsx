import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Button styles used across the site. There is no shared Button component —
 * buttons are styled with Tailwind utility classes. This documents the
 * four main variants: Primary, Secondary, Outline, and Text.
 */

const meta: Meta = {
  title: "UI/Buttons",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

/** Primary solid button — used for main CTAs (Contact, Get in Touch, etc.) */
export const Primary: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href="#"
        className="rounded-full bg-horchata-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800"
      >
        Get in Touch <span aria-hidden="true">&rarr;</span>
      </a>
      <a
        href="#"
        className="rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800"
      >
        Contact
      </a>
      <a
        href="#"
        className="rounded-full bg-horchata-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-horchata-800 hover:shadow-md"
      >
        Contact
      </a>
    </div>
  ),
};

/** Secondary border button — used as companion to primary (Book Mentoring, etc.) */
export const Secondary: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href="#"
        className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white"
      >
        Book Mentoring <span aria-hidden="true">&rarr;</span>
      </a>
      <a
        href="#"
        className="rounded-full border border-navy-300 px-6 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white"
      >
        Learn More
      </a>
    </div>
  ),
};

/** Outline button on dark background — used in dark sections (footer CTA, etc.) */
export const Outline: Story = {
  render: () => (
    <div className="rounded-2xl bg-navy-900 p-8">
      <div className="flex flex-wrap items-center gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-horchata-500 px-6 py-3 text-sm font-medium text-horchata-300 transition-colors hover:bg-horchata-500 hover:text-navy-900"
        >
          Submit a Speaking Inquiry
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-horchata-500 px-6 py-3 text-sm font-medium text-horchata-300 transition-colors hover:bg-horchata-500 hover:text-navy-900"
        >
          Contact Me <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  ),
};

/** Text link button — used for "View all" and secondary actions */
export const TextLink: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <a
        href="#"
        className="text-sm font-medium text-horchata-800 hover:text-horchata-600"
      >
        View all <span aria-hidden="true">&rarr;</span>
      </a>
      <a
        href="#"
        className="text-sm font-medium text-horchata-800 hover:text-horchata-600"
      >
        Show all posts
      </a>
      <a
        href="#"
        className="text-sm font-medium text-horchata-800 hover:text-horchata-600"
      >
        See full experience <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  ),
};

/** External link button — has arrow-up-right icon to indicate leaving site */
export const ExternalLink: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href="#"
        className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        Follow on LinkedIn
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </a>
      <a
        href="#"
        className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        View on GitHub
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </a>
    </div>
  ),
};

/** Nav-sized button — smaller variant used in the navigation bar */
export const NavSize: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <a
        href="#"
        className="rounded-full bg-horchata-200 px-4 py-2 text-sm font-medium text-navy-900"
      >
        About
      </a>
      <a
        href="#"
        className="rounded-full px-4 py-2 text-sm font-medium text-navy-600 hover:bg-horchata-100 hover:text-navy-900"
      >
        Blog
      </a>
      <a
        href="#"
        className="rounded-full bg-horchata-700 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-horchata-800 hover:shadow-md"
      >
        Contact
      </a>
    </div>
  ),
};

/** All button variants side by side for comparison */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-500">Primary</p>
        <a href="#" className="rounded-full bg-horchata-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800">
          Get in Touch <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-500">Secondary</p>
        <a href="#" className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white">
          Book Mentoring <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="rounded-2xl bg-navy-900 p-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-horchata-500">Outline (dark bg)</p>
        <a href="#" className="inline-flex items-center gap-2 rounded-full border border-horchata-500 px-6 py-3 text-sm font-medium text-horchata-300 transition-colors hover:bg-horchata-500 hover:text-navy-900">
          Contact Me <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-500">Text Link</p>
        <a href="#" className="text-sm font-medium text-horchata-800 hover:text-horchata-600">
          View all <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-500">External Link</p>
        <a href="#" className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800">
          Follow on LinkedIn
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </a>
      </div>
    </div>
  ),
};
