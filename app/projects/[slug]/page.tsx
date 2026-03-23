import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/utils";
import { getRepoStars } from "@/lib/github";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import nailedItEpisodes from "@/content/nailed-it-episodes.json";
import nailedItContestants from "@/content/nailed-it-contestants.json";

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
  "open-source": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "podcast": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "hackathon": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "work-project": "bg-horchata-100 text-horchata-800 dark:bg-navy-700 dark:text-horchata-300",
  "side-project": "bg-horchata-100 text-horchata-800 dark:bg-navy-700 dark:text-horchata-300",
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

  const stars = project.github ? await getRepoStars(project.github) : null;

  const allProjects = getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const repoName = project.github?.split("/")[1] ?? project.github;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-horchata-200 bg-horchata-50 py-14 md:py-20 dark:border-navy-700 dark:bg-navy-900">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-navy-400 transition-colors hover:text-navy-700 dark:text-white/40 dark:hover:text-white/80"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            All projects
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Logo / Emoji */}
            {project.logo ? (
              <div className="flex-shrink-0 overflow-hidden rounded-2xl border border-horchata-200 bg-white p-3 shadow-sm dark:border-navy-700 dark:bg-navy-800">
                <Image
                  src={resolveImageUrl(project.logo)}
                  alt={project.title}
                  width={80}
                  height={80}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-horchata-200 bg-white text-4xl shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:h-24 sm:w-24 sm:text-5xl">
                {project.emoji ?? "🛠️"}
              </div>
            )}

            {/* Title block */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"]}`}>
                  {CATEGORY_LABELS[project.category] ?? project.category}
                </span>
                {project.status === "active" && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 dark:text-horchata-100 sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-2 text-base text-horchata-700 dark:text-horchata-400 sm:text-lg">
                {project.tagline}
              </p>
              <p className="mt-1.5 text-sm text-navy-400 dark:text-white/40">
                {formatDateRange(project.startDate, project.endDate)}
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
                  >
                    View Project
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </a>
                )}
                {project.github && (
                  <a
                    href={`https://github.com/${project.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-horchata-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-horchata-400 hover:bg-horchata-50 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-200 dark:hover:border-navy-400"
                  >
                    <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span className="font-mono text-xs">{repoName}</span>
                    {stars != null && stars > 0 && (
                      <>
                        <span className="text-navy-300 dark:text-navy-500">·</span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 shrink-0 fill-current text-horchata-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          {stars.toLocaleString()}
                        </span>
                      </>
                    )}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">

            {/* Main content */}
            <div className="space-y-10 lg:col-span-2">

              {/* Description — only show if different from tagline */}
              {project.description && project.description !== project.tagline && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">Overview</p>
                  <p className="mt-3 text-base leading-relaxed text-navy-700 dark:text-horchata-200">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {project.highlights.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">Highlights</p>
                  <ul className="mt-4 space-y-2.5">
                    {project.highlights.map((h, i) => (
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

              {/* Nailed It! Data Tables */}
              {slug === "nailed-it-tracker" && (
                <div className="space-y-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">Episodes</p>
                    <p className="mt-1 text-xs text-navy-400 dark:text-white/40">{nailedItEpisodes.length} total</p>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-horchata-200 dark:border-navy-700">
                      <table className="w-full text-sm">
                        <thead className="bg-horchata-50 dark:bg-navy-800">
                          <tr>
                            {["Episode Name", "Season", "Ep #", "Guest Judge", "R1 Challenge", "R2 Challenge"].map((h) => (
                              <th key={h} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-navy-700 dark:text-horchata-300">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-horchata-100 dark:divide-navy-700">
                          {nailedItEpisodes.map((ep) => (
                            <tr key={ep.name} className="bg-white dark:bg-navy-900">
                              <td className="px-4 py-3 font-medium text-navy-900 dark:text-horchata-100">{ep.name}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{ep.season}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{ep.episode}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{ep.guestJudge || ""}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{ep.round1Challenge || ""}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{ep.round2Challenge || ""}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">Contestants</p>
                    <p className="mt-1 text-xs text-navy-400 dark:text-white/40">{nailedItContestants.length} total</p>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-horchata-200 dark:border-navy-700">
                      <table className="w-full text-sm">
                        <thead className="bg-horchata-50 dark:bg-navy-800">
                          <tr>
                            {["Name", "Episode", "Occupation", "Gender", "Race", "R1 Winner", "R2 Winner", "Notes"].map((h) => (
                              <th key={h} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-navy-700 dark:text-horchata-300">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-horchata-100 dark:divide-navy-700">
                          {nailedItContestants.map((c) => (
                            <tr key={c.name} className="bg-white dark:bg-navy-900">
                              <td className="whitespace-nowrap px-4 py-3 font-medium text-navy-900 dark:text-horchata-100">{c.name}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-navy-600 dark:text-horchata-300">{c.episode}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{c.occupation || ""}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{c.gender}</td>
                              <td className="px-4 py-3 text-navy-600 dark:text-horchata-300">{c.race}</td>
                              <td className="px-4 py-3 text-center">{c.round1Winner ? "✓" : ""}</td>
                              <td className="px-4 py-3 text-center">{c.round2Winner ? "✓" : ""}</td>
                              <td className="px-4 py-3 text-xs text-navy-500 dark:text-horchata-400">{c.notes || ""}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">

              {/* GitHub card */}
              {project.github && (
                <div className="overflow-hidden rounded-2xl border border-horchata-200 bg-white dark:border-navy-700 dark:bg-navy-800">
                  <div className="flex items-center gap-2 border-b border-horchata-100 px-4 py-3 dark:border-navy-700">
                    <svg className="h-4 w-4 shrink-0 fill-current text-navy-600 dark:text-horchata-300" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">GitHub</span>
                  </div>
                  <a
                    href={`https://github.com/${project.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-horchata-50 dark:hover:bg-navy-700/50"
                  >
                    <span className="min-w-0 font-mono text-sm text-navy-800 dark:text-horchata-200 break-all">
                      {project.github}
                    </span>
                    <svg className="h-3.5 w-3.5 shrink-0 text-navy-400 transition-transform group-hover:translate-x-0.5 dark:text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </a>
                  {stars != null && stars > 0 && (
                    <div className="border-t border-horchata-100 px-4 py-3 dark:border-navy-700">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 fill-current text-horchata-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="text-sm font-bold text-navy-900 dark:text-horchata-100">{stars.toLocaleString()}</span>
                        <span className="text-sm text-navy-400 dark:text-white/40">stars</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {project.skills.length > 0 && (
                <div className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">
                    Skills & Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Link
                        key={skill}
                        href={`/projects?skill=${encodeURIComponent(skill)}`}
                        className="rounded-full border border-horchata-200 bg-horchata-50 px-3 py-1 text-xs font-medium text-navy-600 transition-colors hover:border-horchata-400 hover:bg-horchata-100 hover:text-navy-900 dark:border-navy-600 dark:bg-navy-700 dark:text-horchata-300 dark:hover:border-navy-400"
                      >
                        {skill}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog post */}
              {project.blogSlug && (
                <div className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">
                    Blog Post
                  </p>
                  <Link
                    href={`/blog/${project.blogSlug}`}
                    className="group mt-3 flex items-center gap-2 text-sm font-medium text-horchata-700 transition-colors hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-300"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Read the write-up
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              )}

              {/* Organization */}
              {project.organization && (
                <div className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">
                    Organization
                  </p>
                  <Link
                    href={`/organizations/${project.organization}`}
                    className="group mt-3 flex items-center gap-2 text-sm font-medium text-navy-700 transition-colors hover:text-horchata-700 dark:text-horchata-200 dark:hover:text-horchata-400"
                  >
                    View organization
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-6 pb-8">
        <PrevNextNav
          prev={prevProject ? { slug: prevProject.slug, title: prevProject.title } : null}
          next={nextProject ? { slug: nextProject.slug, title: nextProject.title } : null}
          basePath="/projects"
        />
      </div>

      <ConnectCTA variant="hire" />
    </>
  );
}
