"use client";

import { useState } from "react";
import { clsx } from "clsx";

/**
 * ExpandableTestimonials — inspired by Tailwind Plus Primer template.
 * 3-column staggered grid of testimonial quotes.
 * Shows a limited set initially, with a "Show more" button to expand.
 */

export interface TestimonialItem {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
}

const INITIAL_VISIBLE = 6;

function TestimonialQuote({ item }: { item: TestimonialItem }) {
  return (
    <figure className="rounded-2xl border border-horchata-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800">
      <blockquote className="text-sm leading-relaxed text-navy-600 dark:text-navy-300">
        <p>&ldquo;{item.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        {item.avatar ? (
          <img
            src={item.avatar}
            alt={item.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-horchata-200 dark:ring-navy-600"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-horchata-100 text-sm font-bold text-horchata-700 ring-2 ring-horchata-200 dark:bg-navy-700 dark:text-horchata-400 dark:ring-navy-600">
            {item.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy-800 dark:text-navy-100">
            {item.name}
          </p>
          {(item.role || item.company) && (
            <p className="truncate text-xs text-navy-500 dark:text-navy-400">
              {[item.role, item.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

interface ExpandableTestimonialsProps {
  testimonials: TestimonialItem[];
  initialVisible?: number;
  className?: string;
}

export function ExpandableTestimonials({
  testimonials,
  initialVisible = INITIAL_VISIBLE,
  className,
}: ExpandableTestimonialsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? testimonials : testimonials.slice(0, initialVisible);
  const hasMore = testimonials.length > initialVisible;

  // Split into 3 staggered columns for masonry-like effect
  const col1 = visible.filter((_, i) => i % 3 === 0);
  const col2 = visible.filter((_, i) => i % 3 === 1);
  const col3 = visible.filter((_, i) => i % 3 === 2);

  return (
    <div className={clsx("space-y-8", className)}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Column 1 */}
        <div className="space-y-6">
          {col1.map((item, i) => (
            <TestimonialQuote key={i} item={item} />
          ))}
        </div>
        {/* Column 2 — offset down a bit on larger screens */}
        <div className="space-y-6 sm:mt-8 lg:mt-12">
          {col2.map((item, i) => (
            <TestimonialQuote key={i} item={item} />
          ))}
        </div>
        {/* Column 3 — offset down a bit more */}
        <div className="space-y-6 lg:mt-6">
          {col3.map((item, i) => (
            <TestimonialQuote key={i} item={item} />
          ))}
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-2 rounded-full border border-horchata-200 bg-white px-5 py-2.5 text-sm font-medium text-navy-700 shadow-sm transition-all hover:border-horchata-400 hover:shadow-md dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 dark:hover:border-navy-400"
          >
            {expanded ? (
              <>
                Show fewer
                <svg className="h-4 w-4 rotate-180" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </>
            ) : (
              <>
                Show {testimonials.length - initialVisible} more
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
