"use client";

import { useState } from "react";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "@/lib/types";
import { PaginationNav } from "./pagination-nav";

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

      <PaginationNav page={page} totalPages={totalPages} onPage={setPage} />
    </>
  );
}
