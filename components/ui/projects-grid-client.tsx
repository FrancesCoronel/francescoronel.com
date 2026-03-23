"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/utils";

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

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "side-project", label: "🔧 Side Project" },
  { key: "work-project", label: "💼 Work Project" },
  { key: "open-source", label: "🌍 Open Source" },
  { key: "hackathon", label: "🏆 Hackathon" },
  { key: "podcast", label: "🎙️ Podcast" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

function ProjectCard({
  project,
  stars,
}: {
  project: Project;
  stars?: number | null;
}) {
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
            {project.emoji ?? "🛠️"}
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
              🟢 Active
            </span>
          )}
        </div>
      </div>
      <h2 className="mt-4 text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-400">
        {project.title}
      </h2>
      <p className="mt-2 flex-1 text-sm text-navy-600 dark:text-white/70">
        {project.tagline}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-navy-400 dark:text-white/40">
          {formatDateRange(project.startDate, project.endDate)}
        </p>
        <div className="flex items-center gap-2">
          {project.github && (
            <span
              className="flex items-center gap-1 text-xs text-navy-400 dark:text-white/40"
              title="Has GitHub repo"
            >
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </span>
          )}
          {stars != null && stars > 0 && (
            <span className="flex items-center gap-1 text-xs text-navy-400 dark:text-white/40">
              <svg
                className="h-3 w-3 fill-current text-horchata-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {stars.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
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

  return (
    <div>
      {/* Filter bar */}
      <div className="border-b border-horchata-200 bg-white dark:border-navy-700 dark:bg-navy-900">
        <div className="mx-auto max-w-[var(--container-max)] px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? "bg-navy-900 text-white dark:bg-horchata-400 dark:text-navy-900"
                    : "border border-horchata-200 bg-white text-navy-600 hover:border-horchata-400 hover:text-navy-900 dark:border-navy-600 dark:bg-navy-800 dark:text-white/70 dark:hover:border-navy-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
            {skillFilter && (
              <button
                onClick={() => setSkillFilter(null)}
                className="flex items-center gap-1.5 rounded-full bg-horchata-700 px-3.5 py-1.5 text-sm font-medium text-white dark:bg-horchata-500 dark:text-navy-900"
              >
                {skillFilter}
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
            <button
              onClick={() => setGithubOnly((v) => !v)}
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                githubOnly
                  ? "bg-navy-900 text-white dark:bg-horchata-400 dark:text-navy-900"
                  : "border border-horchata-200 bg-white text-navy-600 hover:border-horchata-400 hover:text-navy-900 dark:border-navy-600 dark:bg-navy-800 dark:text-white/70 dark:hover:border-navy-400 dark:hover:text-white"
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
        /* Filtered view — flat grid */
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            {filtered.length === 0 ? (
              <p className="text-center text-navy-500 dark:text-white/50">
                No projects match the current filters.
              </p>
            ) : (
              <>
                <p className="mb-6 text-sm text-navy-500 dark:text-white/50">
                  {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filtered.map((project) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      stars={starsMap[project.slug]}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      ) : (
        /* Default view — featured + rest */
        <>
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
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      stars={starsMap[project.slug]}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-[var(--container-max)] px-6">
              {featured.length > 0 && (
                <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                  All Projects
                </h2>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    stars={starsMap[project.slug]}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
