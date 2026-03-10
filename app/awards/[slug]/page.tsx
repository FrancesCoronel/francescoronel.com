import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAwardBySlug, getAwards } from "@/lib/content";
import { resolveImageUrl } from "@/lib/cloudinary";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

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
    <div className="mx-auto max-w-3xl px-6 py-16">
      {award.image && (
        <Image
          src={resolveImageUrl(award.image)}
          alt={award.title}
          width={800}
          height={400}
          className="mb-8 rounded-xl"
        />
      )}
      <h1 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
        {award.title}
      </h1>
      <p className="mt-2 text-navy-600 dark:text-white/70">
        {award.organization} &middot; {formatDate(award.date)}
      </p>
      <div className="mt-8 text-navy-700 leading-relaxed dark:text-horchata-200">
        <p>{award.description}</p>
      </div>
      {award.url && (
        <a
          href={award.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-horchata-800 underline hover:text-horchata-600 dark:text-horchata-400"
        >
          Learn more
          <svg className="ml-1 inline h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </a>
      )}
    </div>
  );
}
