import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTestimonials, getTestimonialBySlug } from "@/lib/content";
import { ClientOnlyText } from "@/components/ui/client-only-text";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PrevNextNav } from "@/components/ui/prev-next-nav";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTestimonials().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const testimonial = getTestimonialBySlug(slug);
  if (!testimonial) return {};
  return buildMetadata({
    title: `Testimonial — ${testimonial.role}${testimonial.organization ? ` at ${testimonial.organization}` : ""}`,
    description: testimonial.quote.slice(0, 160) + "...",
    path: `/testimonials/${slug}`,
    robots: { index: false, follow: true },
  });
}

export default async function TestimonialPage({ params }: PageProps) {
  const { slug } = await params;
  const testimonial = getTestimonialBySlug(slug);
  if (!testimonial) notFound();

  const allTestimonials = getTestimonials();
  const currentIndex = allTestimonials.findIndex((t) => t.slug === slug);
  const prevItem = currentIndex > 0 ? allTestimonials[currentIndex - 1] : null;
  const nextItem = currentIndex < allTestimonials.length - 1 ? allTestimonials[currentIndex + 1] : null;

  // Split on double newlines or ---
  const paragraphs = testimonial.quote
    .split(/\n{2,}|---/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8">
          <ClientOnlyText
            as="h1"
            text={testimonial.name}
            className="text-3xl font-bold text-navy-900 dark:text-horchata-100"
          />
          <p className="mt-1 text-lg text-navy-600 dark:text-white/70">
            {testimonial.role}
            {testimonial.organization && ` at ${testimonial.organization}`}
          </p>
        </div>

        <blockquote className="space-y-4 border-l-4 border-horchata-400 pl-6 text-navy-700 leading-relaxed dark:text-horchata-200">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </blockquote>

        <div className="mt-10">
          <Link
            href="/testimonials"
            className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            &larr; All testimonials
          </Link>
        </div>

        <div className="mt-8">
          <PrevNextNav
            prev={prevItem ? { slug: prevItem.slug, title: prevItem.name } : null}
            next={nextItem ? { slug: nextItem.slug, title: nextItem.name } : null}
            basePath="/testimonials"
          />
        </div>
      </div>

      <ConnectCTA variant="hire" />
    </>
  );
}
