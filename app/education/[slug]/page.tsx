import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import {
  getEducationBySlug,
  getEducation,
  getOrganizationByName,
} from "@/lib/content";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { formatDateRange } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getEducation().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const edu = getEducationBySlug(slug);
  if (!edu) return {};
  return buildMetadata({
    title: `${edu.degree} at ${edu.institution}`,
    description: edu.description,
    path: `/education/${slug}`,
    ogImage: edu.logo || undefined,
  });
}

export default async function EducationPage({ params }: PageProps) {
  const { slug } = await params;
  const edu = getEducationBySlug(slug);
  if (!edu) notFound();

  const org = getOrganizationByName(edu.institution);

  return (
    <>
      {/* Hero */}
      <section className="bg-horchata-50 py-16 dark:bg-navy-900">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/about#education"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-horchata-700 transition-colors hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            Education
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            {edu.logo && (
              <Image
                src={edu.logo}
                alt={edu.institution}
                width={72}
                height={72}
                className="h-16 w-16 flex-shrink-0 rounded-xl object-contain shadow-sm"
              />
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Education
              </p>
              <h1 className="mt-1 text-xl font-bold leading-tight text-navy-900 dark:text-horchata-100 sm:text-2xl md:text-3xl">
                {edu.degree}
              </h1>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {org ? (
              <Link
                href={`/organizations/${org.slug}`}
                className="rounded-full bg-horchata-100 px-3 py-1 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-200 dark:bg-navy-800 dark:text-horchata-300 dark:hover:bg-navy-700"
              >
                {edu.institution}
              </Link>
            ) : (
              <span className="rounded-full bg-horchata-100 px-3 py-1 text-sm font-medium text-navy-700 dark:bg-navy-800 dark:text-horchata-300">
                {edu.institution}
              </span>
            )}
            <span className="text-sm text-navy-600 dark:text-white/60">
              {edu.field}
            </span>
            <span className="text-sm text-navy-600 dark:text-white/60">
              {formatDateRange(edu.startDate, edu.endDate)}
            </span>
          </div>
        </div>
      </section>

      {/* Description + honors */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-base leading-relaxed text-navy-700 dark:text-white/80">
            {edu.description}
          </p>

          {edu.honors.length > 0 && (
            <div className="mt-10">
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Honors
              </p>
              <h2 className="mt-1 mb-5 text-xl font-bold text-navy-900 dark:text-horchata-100">
                Honors & Activities 🎖️
              </h2>
              <ul className="space-y-3">
                {edu.honors.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-horchata-400" />
                    <span className="text-navy-700 dark:text-white/80">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {edu.url && (
            <a
              href={edu.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              Visit institution
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          )}
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
