import Link from "next/link";
import type { Testimonial } from "@/lib/types";

const TRUNCATE_LENGTH = 280;

export function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  const isLong = testimonial.quote.length > TRUNCATE_LENGTH;
  const displayQuote = isLong
    ? testimonial.quote.slice(0, TRUNCATE_LENGTH).trimEnd() + "..."
    : testimonial.quote;

  return (
    <Link
      href={`/testimonials/${testimonial.slug}`}
      className="group flex flex-col rounded-2xl border border-horchata-200 bg-white p-6 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
    >
      <p className="flex-1 text-sm italic leading-relaxed text-navy-700 dark:text-horchata-200">
        &ldquo;{displayQuote}&rdquo;
      </p>
      <footer className="mt-4 border-t border-horchata-100 pt-4 dark:border-navy-700">
        <p className="text-xs text-navy-600 dark:text-horchata-400">
          {testimonial.role}
          {testimonial.organization && ` at ${testimonial.organization}`}
        </p>
      </footer>
    </Link>
  );
}
