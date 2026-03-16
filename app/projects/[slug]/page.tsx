import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  "open-source": "Open Source",
  "podcast": "Podcast",
  "hackathon": "Hackathon",
  "work-project": "Work Project",
  "side-project": "Side Project",
};

const CATEGORY_COLORS: Record<string, string> = {
  "open-source": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  "podcast": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  "hackathon": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "work-project": "bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300",
  "side-project": "bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300",
};

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${slug}`,
    ogImage: project.logo || undefined,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="flex items-start gap-4">
        {project.logo ? (
          <Image
            src={resolveImageUrl(project.logo)}
            alt={project.title}
            width={64}
            height={64}
            className="h-16 w-16 rounded-xl object-contain"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-horchata-100 text-3xl dark:bg-navy-700">
            🛠️
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
              {project.title}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"]}`}
            >
              {CATEGORY_LABELS[project.category] ?? project.category}
            </span>
            {project.status === "active" && (
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            )}
            {project.status === "abandoned" && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                Abandoned
              </span>
            )}
            {project.status === "archived" && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-navy-700 dark:text-white/50">
                Archived
              </span>
            )}
          </div>
          <p className="mt-1 text-base text-horchata-600 dark:text-horchata-400">
            {project.tagline}
          </p>
          <p className="mt-0.5 text-sm text-navy-500 dark:text-horchata-400">
            {formatDateRange(project.startDate, project.endDate)}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 leading-relaxed text-navy-700 dark:text-horchata-200">
        <p>{project.description}</p>
      </div>

      {/* Highlights */}
      {project.highlights.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Highlights
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-navy-700 dark:text-horchata-200">
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {project.skills.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-horchata-700 px-3 py-1 text-xs font-medium text-white dark:bg-navy-600 dark:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* External link */}
      {project.url && (
        <div className="mt-8">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
          >
            View Project
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>
      )}

      {/* Organization link */}
      {project.organization && (
        <div className="mt-8">
          <Link
            href={`/organizations/${project.organization}`}
            className="inline-flex items-center gap-1.5 text-sm text-horchata-700 hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            View organization page →
          </Link>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10">
        <Link
          href="/projects"
          className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
        >
          &larr; All projects
        </Link>
      </div>
    </div>
  );
}
