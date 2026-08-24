import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  getExperienceBySlug,
  getExperiences,
  getOrganizationByName,
} from "@/lib/content";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";
import { formatDateRange } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return {};
  return buildMetadata({
    title: `${exp.title} at ${exp.company}`,
    description: exp.description,
    path: `/experience/${slug}`,
    ogImage: exp.companyLogo || undefined,
  });
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) notFound();

  const org = getOrganizationByName(exp.company);

  return (
    <>
      {/* Header — light */}
      <section className="bg-horchata-50 py-16 md:py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <Link
            href="/about"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-navy-600 transition-colors hover:text-navy-700 dark:text-white/60 dark:hover:text-white/80"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            All experience
          </Link>

          <div className="flex items-start gap-4 sm:gap-6">
            {exp.companyLogo && (
              <div className="flex-shrink-0 overflow-hidden rounded-xl border border-horchata-200 bg-white p-2 shadow-sm dark:border-navy-700 dark:bg-navy-800">
                <Image
                  src={exp.companyLogo}
                  alt={exp.company}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Experience
              </p>
              <h1 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl md:text-4xl">
                {exp.title}
              </h1>
              <p className="mt-1 text-base text-navy-600 dark:text-white/70 sm:text-lg">
                {org ? (
                  <Link
                    href={`/organizations/${org.slug}`}
                    className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:decoration-navy-500 dark:hover:text-horchata-400"
                  >
                    {exp.company}
                  </Link>
                ) : (
                  exp.company
                )}
              </p>
              <p className="mt-1 text-sm text-navy-600 dark:text-horchata-400">
                {formatDateRange(exp.startDate, exp.endDate)}
                {exp.location && <> &middot; {exp.location}</>}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content — dark */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          {exp.description && (
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Overview
              </p>
              <p className="mt-3 text-base leading-relaxed text-navy-700 dark:text-horchata-200">
                {exp.description}
              </p>
            </div>
          )}

          {exp.highlights.length > 0 && (
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Highlights
              </p>
              <ul className="mt-4 space-y-2.5">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-horchata-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm leading-relaxed text-navy-700 dark:text-horchata-200">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exp.skills.length > 0 && (
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-horchata-200 bg-white px-3 py-1 text-xs font-medium text-navy-700 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <NewsletterCTA />

      <ConnectCTA variant="hire" />
    </>
  );
}
