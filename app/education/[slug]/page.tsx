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
import { resolveImageUrl } from "@/lib/cloudinary";
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
    title: `${edu.degree} — ${edu.institution}`,
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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start gap-4">
        {edu.logo && (
          <Image
            src={resolveImageUrl(edu.logo)}
            alt={edu.institution}
            width={64}
            height={64}
            className="h-16 w-16 rounded-lg object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
            {edu.degree}
          </h1>
          <p className="mt-1 text-lg text-navy-600 dark:text-white/70">
            {org ? (
              <Link
                href={`/organizations/${org.slug}`}
                className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-600 dark:decoration-navy-500 dark:hover:text-horchata-400"
              >
                {edu.institution}
              </Link>
            ) : (
              edu.institution
            )}
          </p>
          <p className="text-sm text-navy-500 dark:text-horchata-400">
            {edu.field} &middot; {formatDateRange(edu.startDate, edu.endDate)}
          </p>
        </div>
      </div>

      <div className="mt-8 leading-relaxed text-navy-700 dark:text-horchata-200">
        <p>{edu.description}</p>
      </div>

      {edu.honors.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Honors & Activities
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-navy-700 dark:text-horchata-200">
            {edu.honors.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">
        <Link
          href="/about"
          className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
        >
          &larr; All education
        </Link>
      </div>
    </div>
  );
}
