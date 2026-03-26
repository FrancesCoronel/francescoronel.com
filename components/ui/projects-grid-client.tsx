"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/utils";
import { PaginationNav } from "./pagination-nav";

const PAGE_SIZE = 12;

const CATEGORY_LABELS: Record<string, string> = {
  "open-source": "Open Source",
  "podcast": "Podcast",
  "hackathon": "Hackathon",
  "work-project": "Work Project",
  "side-project": "Side Project",
};

const CATEGORY_COLORS: Record<string, string> = {
  "open-source": "text-emerald-600 dark:text-emerald-400",
  "podcast": "text-violet-600 dark:text-violet-400",
  "hackathon": "text-sky-600 dark:text-sky-400",
  "work-project": "text-horchata-700 dark:text-horchata-400",
  "side-project": "text-horchata-700 dark:text-horchata-400",
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "side-project", label: "Side Project" },
  { key: "work-project", label: "Work Project" },
  { key: "open-source", label: "Open Source" },
  { key: "hackathon", label: "Hackathon" },
  { key: "podcast", label: "Podcast" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

function ProjectLogo({ project }: { project: Project }) {
  if (project.logo) {
    return (
      <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-navy-900/5 shadow-navy-900/10 dark:bg-navy-700 dark:ring-white/10">
        <Image
          src={resolveImageUrl(project.logo)}
          alt={project.title}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-contain"
        />
      </div>
    );
  }
  return (
    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-horchata-100 text-xl shadow-md ring-1 ring-navy-900/5 shadow-navy-900/10 dark:bg-navy-700 dark:ring-white/10">
      {project.emoji ?? "🛠️"}
    </div>
  );
}

function ProjectCard({
  project,
  stars,
}: {
  project: Project;
  stars?: number | null;
}) {
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category;
  const categoryColor = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"];

  return (
    <div className="group relative flex flex-col items-start rounded-2xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800/50">
      <div className="absolute inset-0 z-0 rounded-2xl bg-horchata-50 opacity-0 transition group-hover:opacity-100 dark:bg-navy-800" />
      <Link href={`/posts/${project.slug}`} className="absolute inset-0 z-20 rounded-2xl" aria-label={project.title} />

      <ProjectLogo project={project} />

      <div className="relative z-10 mt-5 flex w-full flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-base font-semibold tracking-tight text-navy-800 dark:text-horchata-100">
            {project.title}
          </h2>
          {project.status === "active" && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Active
            </span>
          )}
        </div>

        <p className={`mt-0.5 text-xs font-medium ${categoryColor}`}>
          {categoryLabel}
        </p>

        <p className="relative z-10 mt-3 flex-1 text-sm leading-relaxed text-navy-600 dark:text-white/60">
          {project.tagline}
        </p>

        {(stars != null && stars > 0) && (
          <div className="relative z-10 mt-4 flex items-center gap-3 text-xs text-navy-400 dark:text-white/40">
            <span>{formatDateRange(project.startDate, project.endDate)}</span>
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 fill-current text-horchata-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {stars.toLocaleString()}
            </span>
          </div>
        )}
        {(stars == null || stars <= 0) && (
          <p className="relative z-10 mt-4 text-xs text-navy-400 dark:text-white/40">
            {formatDateRange(project.startDate, project.endDate)}
          </p>
        )}
      </div>
    </div>
  );
}

function FeaturedProjectRow({
  project,
  stars,
}: {
  project: Project;
  stars?: number | null;
}) {
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category;
  const categoryColor = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"];

  return (
    <div className="group relative flex items-start gap-6 border-b border-horchata-200 py-8 last:border-b-0 dark:border-navy-700">
      <div className="absolute -inset-x-4 inset-y-2 z-0 rounded-2xl border border-horchata-300 bg-white opacity-0 shadow-sm transition group-hover:opacity-100 dark:border-navy-600 dark:bg-navy-800" />
      <Link href={`/posts/${project.slug}`} className="absolute inset-0 z-20" aria-label={project.title} />

      <ProjectLogo project={project} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-base font-semibold tracking-tight text-navy-800 dark:text-horchata-100">
            {project.title}
          </h2>
          {project.status === "active" && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Active
            </span>
          )}
        </div>
        <p className={`mt-0.5 text-xs font-medium ${categoryColor}`}>
          {categoryLabel}
        </p>
        <p className="mt-1.5 text-sm text-navy-600 dark:text-white/60">
          {project.tagline}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-navy-400 dark:text-white/40">
          <span>{formatDateRange(project.startDate, project.endDate)}</span>
          {stars != null && stars > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 fill-current text-horchata-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {stars.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0 self-center">
        <svg className="h-5 w-5 text-navy-300 transition-colors group-hover:text-horchata-700 dark:text-navy-600 dark:group-hover:text-horchata-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}


export function ProjectsGridClient({
  projects,
  starsMap,
  featuredSlugs,
  initialSkill,
}: {
  projects: Project[];
  starsMap: Record<string, number | null>;
  featuredSlugs: string[];
  initialSkill?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [githubOnly, setGithubOnly] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string | null>(initialSkill ?? null);
  const [filteredPage, setFilteredPage] = useState(1);
  const [restPage, setRestPage] = useState(1);

  const isFiltering = activeFilter !== "all" || githubOnly || skillFilter !== null;

  const filtered = projects.filter((p) => {
    if (activeFilter !== "all" && p.category !== activeFilter) return false;
    if (githubOnly && !p.github) return false;
    if (skillFilter && !p.skills.includes(skillFilter)) return false;
    return true;
  });

  const featuredSet = new Set(featuredSlugs);
  const featured = projects.filter((p) => featuredSet.has(p.slug));
  const rest = projects.filter((p) => !featuredSet.has(p.slug));

  const filteredTotalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const filteredPaged = filtered.slice((filteredPage - 1) * PAGE_SIZE, filteredPage * PAGE_SIZE);

  const restTotalPages = Math.ceil(rest.length / PAGE_SIZE);
  const restPaged = rest.slice((restPage - 1) * PAGE_SIZE, restPage * PAGE_SIZE);

  function handleFilterChange(key: FilterKey) {
    setActiveFilter(key);
    setFilteredPage(1);
  }

  function handleSkillClear() {
    setSkillFilter(null);
    setFilteredPage(1);
  }

  function handleGithubToggle() {
    setGithubOnly((v) => !v);
    setFilteredPage(1);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="border-b border-horchata-200 dark:border-navy-700">
        <div className="mx-auto max-w-[var(--container-max)] px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilterChange(tab.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? "bg-navy-900 text-white dark:bg-horchata-400 dark:text-navy-900"
                    : "text-navy-500 hover:bg-horchata-100 hover:text-navy-900 dark:text-white/50 dark:hover:bg-navy-800 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
            {skillFilter && (
              <button
                onClick={handleSkillClear}
                className="flex items-center gap-1.5 rounded-full bg-horchata-700 px-3.5 py-1.5 text-sm font-medium text-white dark:bg-horchata-500 dark:text-navy-900"
              >
                {skillFilter}
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
            <button
              onClick={handleGithubToggle}
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                githubOnly
                  ? "bg-navy-900 text-white dark:bg-horchata-400 dark:text-navy-900"
                  : "text-navy-500 hover:bg-horchata-100 hover:text-navy-900 dark:text-white/50 dark:hover:bg-navy-800 dark:hover:text-white"
              }`}
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub Repos
            </button>
          </div>
        </div>
      </div>

      {isFiltering ? (
        /* Filtered view — paginated grid */
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            {filtered.length === 0 ? (
              <p className="text-center text-navy-500 dark:text-white/50">
                No projects match the current filters.
              </p>
            ) : (
              <>
                <p className="mb-10 text-sm text-navy-400 dark:text-white/40">
                  {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                  {filteredTotalPages > 1 && ` · page ${filteredPage} of ${filteredTotalPages}`}
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPaged.map((project) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      stars={starsMap[project.slug]}
                    />
                  ))}
                </div>
                <PaginationNav page={filteredPage} totalPages={filteredTotalPages} onPage={setFilteredPage} />
              </>
            )}
          </div>
        </section>
      ) : (
        /* Default view — featured + paginated rest */
        <>
          {featured.length > 0 && (
            <section className="bg-horchata-50 py-16 md:py-20 dark:bg-navy-900">
              <div className="mx-auto max-w-[var(--container-max)] px-6">
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                  Pinned
                </p>
                <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                  Featured Projects ⭐
                </h2>
                <div className="mt-4">
                  {featured.map((project) => (
                    <FeaturedProjectRow
                      key={project.slug}
                      project={project}
                      stars={starsMap[project.slug]}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
            <div className="mx-auto max-w-[var(--container-max)] px-6">
              {featured.length > 0 && (
                <>
                  <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                    All Work
                  </p>
                  <h2 className="mt-1 mb-4 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                    All Projects 🛠️
                  </h2>
                  <p className="mb-10 text-sm text-navy-400 dark:text-white/40">
                    {rest.length} projects
                    {restTotalPages > 1 && ` · page ${restPage} of ${restTotalPages}`}
                  </p>
                </>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restPaged.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    stars={starsMap[project.slug]}
                  />
                ))}
              </div>
              <PaginationNav page={restPage} totalPages={restTotalPages} onPage={setRestPage} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
