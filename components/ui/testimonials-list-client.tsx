"use client";

import { useState } from "react";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "@/lib/types";

const PER_PAGE = 12;

export function TestimonialsListClient({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(testimonials.length / PER_PAGE);
  const paginated = testimonials.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <>
      <p className="text-sm text-navy-500 dark:text-horchata-400">
        {testimonials.length} testimonials
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((testimonial) => (
          <TestimonialCard key={testimonial.slug} testimonial={testimonial} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-lg border border-horchata-200 px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:bg-navy-800"
          >
            Previous
          </button>
          <span className="text-sm text-navy-500 dark:text-horchata-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-horchata-200 px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:bg-navy-800"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
