import type { Metadata } from "next";
import { getTestimonials } from "@/lib/content";
import { TestimonialsListClient } from "@/components/ui/testimonials-list-client";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials",
  description:
    "All the sweet things folks have had to say about their experience working with Frances Coronel.",
  path: "/testimonials",
  ogImage: "/images/og/mentoring.png",
});

export default function TestimonialsPage() {
  const testimonials = getTestimonials();

  return (
    <>
      <PageHeader
        label="Reviews"
        heading="Testimonials ✅"
        description="What colleagues, mentees, and event organizers have said about working with me."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          {testimonials.length > 0 ? (
            <TestimonialsListClient testimonials={testimonials} />
          ) : (
            <p className="text-navy-600 dark:text-white/70">
              Testimonials coming soon.
            </p>
          )}
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
