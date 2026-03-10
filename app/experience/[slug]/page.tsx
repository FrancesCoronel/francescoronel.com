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
import { resolveImageUrl } from "@/lib/cloudinary";
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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start gap-4">
        {exp.companyLogo && (
          <Image
            src={resolveImageUrl(exp.companyLogo)}
            alt={exp.company}
            width={64}
            height={64}
            className="h-16 w-16 rounded-lg object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
            {exp.title}
          </h1>
          <p className="mt-1 text-lg text-navy-600 dark:text-white/70">
            {org ? (
              <Link
                href={`/organizations/${org.slug}`}
                className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-600 dark:decoration-navy-500 dark:hover:text-horchata-400"
              >
                {exp.company}
              </Link>
            ) : (
              exp.company
            )}
          </p>
          <p className="text-sm text-navy-500 dark:text-horchata-400">
            {formatDateRange(exp.startDate, exp.endDate)} &middot;{" "}
            {exp.location}
          </p>
        </div>
      </div>

      <div className="mt-8 leading-relaxed text-navy-700 dark:text-horchata-200">
        <p>{exp.description}</p>
      </div>

      {exp.highlights.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Highlights
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-navy-700 dark:text-horchata-200">
            {exp.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {exp.skills.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-horchata-700 px-3 py-1 text-xs font-medium text-white dark:bg-navy-600 dark:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/about"
          className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
        >
          &larr; All experience
        </Link>
      </div>
    </div>
  );
}
