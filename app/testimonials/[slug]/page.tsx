import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTestimonials, getTestimonialBySlug, getOrganizationByName } from "@/lib/content";
import { ClientOnlyText } from "@/components/ui/client-only-text";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { resolveImageUrl } from "@/lib/cloudinary";
import Link from "next/link";

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
    title: `Testimonial: ${testimonial.role}${testimonial.organization ? ` at ${testimonial.organization}` : ""}`,
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

  const org = testimonial.organization ? getOrganizationByName(testimonial.organization) : null;

  const paragraphs = testimonial.quote
    .split(/\n{2,}|---/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="bg-horchata-50 py-16 dark:bg-navy-900">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
            Testimonial
          </p>

          <div className="mt-4 flex items-center gap-4">
            {testimonial.image && (
              <Image
                src={resolveImageUrl(testimonial.image)}
                alt={testimonial.name}
                width={64}
                height={64}
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-horchata-300 dark:ring-navy-600"
              />
            )}
            <div>
              <ClientOnlyText
                as="h1"
                text={testimonial.name}
                className="text-2xl font-bold text-navy-900 dark:text-horchata-100 md:text-3xl"
              />
              <p className="mt-0.5 text-base text-navy-600 dark:text-white/70">
                {testimonial.role}
                {testimonial.organization && (
                  <>
                    {" at "}
                    {org ? (
                      <Link
                        href={`/organizations/${org.slug}`}
                        className="text-horchata-700 transition-colors hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
                      >
                        {testimonial.organization}
                      </Link>
                    ) : (
                      testimonial.organization
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-3xl px-6">
          <blockquote className="space-y-5 border-l-4 border-horchata-400 pl-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-navy-700 dark:text-white/80">
                {p}
              </p>
            ))}
          </blockquote>

        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <PrevNextNav
          prev={prevItem ? { slug: prevItem.slug, title: prevItem.name } : null}
          next={nextItem ? { slug: nextItem.slug, title: nextItem.name } : null}
          basePath="/testimonials"
        />
      </div>

      <ConnectCTA variant="hire" />
    </>
  );
}
