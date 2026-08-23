import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAwardBySlug, getAwards } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { ConnectCTA } from "@/components/sections/connect-cta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAwards().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const award = getAwardBySlug(slug);
  if (!award) return {};
  return buildMetadata({
    title: award.title,
    description: award.description,
    path: `/awards/${slug}`,
    ogImage: award.image || undefined,
  });
}

export default async function AwardPage({ params }: PageProps) {
  const { slug } = await params;
  const award = getAwardBySlug(slug);
  if (!award) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-horchata-50 py-16 dark:bg-navy-900">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/about#awards"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-horchata-700 transition-colors hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            Awards
          </Link>

          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
            Recognition
          </p>
          <h1 className="mt-2 text-xl font-bold leading-tight text-navy-900 dark:text-horchata-100 sm:text-2xl md:text-3xl">
            {award.title} 🏆
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-horchata-100 px-3 py-1 text-sm font-medium text-navy-700 dark:bg-navy-800 dark:text-horchata-300">
              {award.organization}
            </span>
            <span className="text-sm text-navy-600 dark:text-white/60">
              {formatDate(award.date)}
            </span>
          </div>
        </div>
      </section>

      {/* Image + description */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-3xl px-6">
          {award.image && (
            <Image
              src={award.image}
              alt={award.title}
              width={800}
              height={400}
              className="mb-10 w-full rounded-2xl object-cover shadow-md"
            />
          )}

          <p className="text-base leading-relaxed text-navy-700 dark:text-white/80">
            {award.description}
          </p>

          {award.url && (
            <a
              href={award.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              Learn more
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          )}
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
