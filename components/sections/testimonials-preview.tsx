import Link from "next/link";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import type { Testimonial } from "@/lib/types";

interface TestimonialsPreviewProps {
  testimonials: Testimonial[];
  heading?: string;
}

export function TestimonialsPreview({
  testimonials,
  heading = "What People Say",
}: TestimonialsPreviewProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
              Testimonials
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              {heading}
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            See all testimonials →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.slug} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
