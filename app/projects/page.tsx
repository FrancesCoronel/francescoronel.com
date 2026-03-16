import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Side projects, open-source tools, hackathon builds, and work projects from Frances Coronel.",
  path: "/projects",
});

const CATEGORY_LABELS: Record<string, string> = {
  "open-source": "🌍 Open Source",
  "podcast": "🎙️ Podcast",
  "hackathon": "🏆 Hackathon",
  "work-project": "💼 Work Project",
  "side-project": "🔧 Side Project",
};

const CATEGORY_COLORS: Record<string, string> = {
  "open-source": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  "podcast": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  "hackathon": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "work-project": "bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300",
  "side-project": "bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300",
};

function ProjectCard({ project }: { project: ReturnType<typeof getProjects>[number] }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-2xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-navy-700 dark:bg-navy-800"
    >
      <div className="flex items-start justify-between gap-3">
        {project.logo ? (
          <Image
            src={resolveImageUrl(project.logo)}
            alt={project.title}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-horchata-100 text-2xl dark:bg-navy-700">
            🛠️
          </div>
        )}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"]}`}
          >
            {CATEGORY_LABELS[project.category] ?? project.category}
          </span>
          {project.status === "active" && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          )}
          {project.status === "abandoned" && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-500 dark:bg-red-900/30 dark:text-red-400">
              Abandoned
            </span>
          )}
          {project.status === "archived" && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400 dark:bg-navy-700 dark:text-white/40">
              Archived
            </span>
          )}
        </div>
      </div>

      <h2 className="mt-4 text-lg font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100 dark:group-hover:text-horchata-400">
        {project.title}
      </h2>
      <p className="mt-1 text-sm text-horchata-600 dark:text-horchata-400">
        {project.tagline}
      </p>
      <p className="mt-3 flex-1 text-sm text-navy-600 dark:text-white/70">
        {project.description}
      </p>
      <p className="mt-4 text-xs text-navy-400 dark:text-white/40">
        {formatDateRange(project.startDate, project.endDate)}
      </p>
    </Link>
  );
}

export default function ProjectsPage() {
  const projects = getProjects();
  const featuredSlugs = new Set(["latina-dev", "apprenticeships-me", "hire-me"]);
  const featured = projects.filter((p) => featuredSlugs.has(p.slug));
  const rest = projects.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <>
      <PageHeader
        label="Built & Shipped"
        heading="Projects 🛠️"
        description="Side projects, open-source directories, hackathon builds, and notable work projects I've shipped over the years."
        aside={
          <Image
            src="/images/assets/rocket-illustration.webp"
            alt=""
            width={300}
            height={300}
            className="h-48 w-48 object-contain drop-shadow-lg md:h-64 md:w-64"
            aria-hidden="true"
          />
        }
      />

      {/* Featured active projects */}
      {featured.length > 0 && (
        <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
              Currently Active
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Featured Projects ⭐
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All other projects */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          {featured.length > 0 && (
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              All Projects
            </h2>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ConnectCTA />
    </>
  );
}
