import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";
import {
  getPost,
  getPostSlugs,
  getAllPosts,
  getOrganizationBySlug,
  getCategoryMaps,
} from "@/lib/content";
import { getRepoData } from "@/lib/github";
import { resolveImageUrl, ogImageUrl } from "@/lib/cloudinary";
import { formatDate, formatDateRange, canOptimize } from "@/lib/utils";
import { sanitizeMdxContent } from "@/lib/sanitize-mdx";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { buildMetadata } from "@/lib/metadata";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { BlogCard } from "@/components/ui/blog-card";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";
import { ConnectCTA } from "@/components/sections/connect-cta";
import nailedItEpisodes from "@/content/nailed-it-episodes.json";
import nailedItContestants from "@/content/nailed-it-contestants.json";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  "open-source": "Open Source",
  podcast: "Podcast",
  hackathon: "Hackathon",
  "work-project": "Work Project",
  "side-project": "Side Project",
};

const CATEGORY_COLORS: Record<string, string> = {
  "open-source": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  podcast: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  hackathon: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "work-project": "bg-horchata-100 text-horchata-800 dark:bg-navy-700 dark:text-horchata-300",
  "side-project": "bg-horchata-100 text-horchata-800 dark:bg-navy-700 dark:text-horchata-300",
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  if (post.postType === "project") {
    return buildMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/posts/${slug}`,
      ogImage: post.logo || undefined,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/posts/${slug}`,
    ogType: "article",
    publishedTime: post.date,
    ogImage: post.featuredImage
      ? ogImageUrl(post.featuredImage.replace("cloudinary://", ""))
      : undefined,
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const organizations = post.organizations
    .map((orgSlug) => getOrganizationBySlug(orgSlug))
    .filter((org): org is NonNullable<typeof org> => org != null);

  const { categoryImages } = getCategoryMaps();

  // ── Project layout ─────────────────────────────────────────
  if (post.postType === "project") {
    const repoData = post.github ? await getRepoData(post.github) : null;
    const orgData = post.organization ? getOrganizationBySlug(post.organization) : null;
    const repoName = post.github?.split("/")[1] ?? post.github;

    const realHighlights = (post.highlights ?? []).filter((h) => !h.startsWith("GitHub:"));
    const githubHighlights: string[] = [];
    if (repoData) {
      if (repoData.language) githubHighlights.push(`Written in ${repoData.language}`);
      if (repoData.stars > 0) githubHighlights.push(`${repoData.stars.toLocaleString()} stars on GitHub`);
      if (repoData.forks > 0) githubHighlights.push(`${repoData.forks.toLocaleString()} forks`);
      if (repoData.openIssues > 0)
        githubHighlights.push(`${repoData.openIssues} open issue${repoData.openIssues !== 1 ? "s" : ""}`);
      if (repoData.pushedAt) {
        const d = new Date(repoData.pushedAt);
        githubHighlights.push(
          `Last updated ${d.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
        );
      }
    }
    const allHighlights = [...realHighlights, ...githubHighlights];

    return (
      <>
        {/* Hero */}
        <section className="border-b border-horchata-200 bg-horchata-50 py-14 md:py-20 dark:border-navy-700 dark:bg-navy-900">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              {/* Logo / Emoji */}
              {post.logo ? (
                <div className="flex-shrink-0 overflow-hidden rounded-2xl border border-horchata-200 bg-white p-3 shadow-sm dark:border-navy-700 dark:bg-navy-800">
                  <Image
                    src={resolveImageUrl(post.logo)}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-horchata-200 bg-white text-4xl shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:h-24 sm:w-24 sm:text-5xl">
                  {post.emoji ?? "🛠️"}
                </div>
              )}

              {/* Title block */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {post.projectCategory && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[post.projectCategory] ?? CATEGORY_COLORS["side-project"]}`}
                    >
                      {CATEGORY_LABELS[post.projectCategory] ?? post.projectCategory}
                    </span>
                  )}
                  {post.status === "active" && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  )}
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 dark:text-horchata-100 sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-2 text-base text-horchata-700 dark:text-horchata-400 sm:text-lg">
                  {post.tagline}
                </p>
                {post.startDate && (
                  <p className="mt-1.5 text-sm text-navy-400 dark:text-white/40">
                    {formatDateRange(post.startDate, post.endDate ?? null)}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {post.projectUrl && (
                    <a
                      href={post.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
                    >
                      View Project
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </a>
                  )}
                  {post.github && (
                    <a
                      href={`https://github.com/${post.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-horchata-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-horchata-400 hover:bg-horchata-50 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-200 dark:hover:border-navy-400"
                    >
                      <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      <span className="font-mono text-xs">{repoName}</span>
                      {repoData != null && repoData.stars > 0 && (
                        <>
                          <span className="text-navy-300 dark:text-navy-500">·</span>
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 shrink-0 fill-current text-horchata-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            {repoData.stars.toLocaleString()}
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
        <section className="border-b border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-10">
              {/* Description */}
              {post.excerpt && post.excerpt !== post.tagline && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">
                    Overview
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-navy-700 dark:text-horchata-200">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {allHighlights.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">
                    Highlights
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {allHighlights.map((h, i) => (
                      <li key={i} className="flex items-baseline gap-3">
                        <svg className="relative top-0.5 h-4 w-4 shrink-0 text-horchata-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm leading-relaxed text-navy-700 dark:text-horchata-200">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nailed It! tables */}
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

            {/* Metadata cards */}
            <div className="mt-6 space-y-5 border-t border-horchata-200 pt-10 dark:border-navy-700">
              {/* GitHub card */}
              {post.github && (
                <div className="overflow-hidden rounded-2xl border border-horchata-200 bg-white dark:border-navy-700 dark:bg-navy-800">
                  <div className="flex items-center gap-2 border-b border-horchata-100 px-4 py-3 dark:border-navy-700">
                    <svg className="h-4 w-4 shrink-0 fill-current text-navy-600 dark:text-horchata-300" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">GitHub 🐙</span>
                  </div>
                  <a
                    href={`https://github.com/${post.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-horchata-50 dark:hover:bg-navy-700/50"
                  >
                    <span className="min-w-0 break-all font-mono text-sm text-navy-800 dark:text-horchata-200">
                      {post.github}
                    </span>
                    <svg className="h-3.5 w-3.5 shrink-0 text-navy-400 transition-transform group-hover:translate-x-0.5 dark:text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </a>
                  {repoData && (
                    <div className="grid grid-cols-2 divide-x divide-y divide-horchata-100 border-t border-horchata-100 dark:divide-navy-700 dark:border-navy-700">
                      {repoData.stars > 0 && (
                        <div className="flex items-center gap-2 px-4 py-3">
                          <svg className="h-4 w-4 shrink-0 fill-current text-horchata-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          <span className="text-sm font-semibold text-navy-900 dark:text-horchata-100">{repoData.stars.toLocaleString()}</span>
                          <span className="text-xs text-navy-400 dark:text-white/40">stars</span>
                        </div>
                      )}
                      {repoData.forks > 0 && (
                        <div className="flex items-center gap-2 px-4 py-3">
                          <svg className="h-4 w-4 shrink-0 fill-current text-navy-400 dark:text-horchata-500" viewBox="0 0 24 24"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a4 4 0 0 1 3.874 3H11a1 1 0 0 1 0 2H8.874A4.002 4.002 0 0 1 1 13a4 4 0 0 1 4-4zm14-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a4 4 0 0 1 4 4 4 4 0 0 1-3.874 3H13a1 1 0 0 1 0-2h2.126A4.002 4.002 0 0 1 19 9zm-7-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a4 4 0 0 1 3.874 3 1 1 0 0 1 0 2A4.002 4.002 0 0 1 12 21a4 4 0 0 1-3.874-3 1 1 0 0 1 0-2A4.002 4.002 0 0 1 12 9z" /></svg>
                          <span className="text-sm font-semibold text-navy-900 dark:text-horchata-100">{repoData.forks.toLocaleString()}</span>
                          <span className="text-xs text-navy-400 dark:text-white/40">forks</span>
                        </div>
                      )}
                      {repoData.language && (
                        <div className="flex items-center gap-2 px-4 py-3">
                          <span className="h-3 w-3 shrink-0 rounded-full bg-horchata-400" />
                          <span className="text-sm text-navy-700 dark:text-horchata-200">{repoData.language}</span>
                        </div>
                      )}
                      {repoData.openIssues > 0 && (
                        <div className="flex items-center gap-2 px-4 py-3">
                          <svg className="h-4 w-4 shrink-0 text-navy-400 dark:text-horchata-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                          <span className="text-sm font-semibold text-navy-900 dark:text-horchata-100">{repoData.openIssues}</span>
                          <span className="text-xs text-navy-400 dark:text-white/40">issues</span>
                        </div>
                      )}
                    </div>
                  )}
                  {repoData?.topics && repoData.topics.length > 0 && (
                    <div className="border-t border-horchata-100 px-4 py-3 dark:border-navy-700">
                      <div className="flex flex-wrap gap-1.5">
                        {repoData.topics.map((t) => (
                          <span key={t} className="rounded-full bg-horchata-100 px-2.5 py-0.5 text-xs font-medium text-navy-600 dark:bg-navy-700 dark:text-horchata-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {post.skills.length > 0 && (
                <div className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">
                    Skills & Tags 🏷️
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.skills.map((skill) => (
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

              {/* Organization */}
              {post.organization && (
                <div className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-navy-500 dark:text-horchata-500">
                    Organization 🏢
                  </p>
                  <Link
                    href={`/organizations/${post.organization}`}
                    className="group mt-3 flex items-center gap-3 text-sm font-medium text-navy-700 transition-colors hover:text-horchata-700 dark:text-horchata-200 dark:hover:text-horchata-400"
                  >
                    {orgData?.logo && (
                      <Image
                        src={resolveImageUrl(orgData.logo)}
                        alt={orgData.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded object-contain"
                      />
                    )}
                    <span className="flex-1">{orgData?.name ?? post.organization}</span>
                    <svg className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-6 py-10">
          <PrevNextNav
            prev={prevPost ? { slug: prevPost.slug, title: prevPost.title } : null}
            next={nextPost ? { slug: nextPost.slug, title: nextPost.title } : null}
            basePath="/posts"
          />
        </div>

        <NewsletterCTA />
        <ConnectCTA variant="hire" />
      </>
    );
  }

  // ── Blog post layout ────────────────────────────────────────
  const sanitized = sanitizeMdxContent(post.content);
  let mdxContent: React.ReactNode;
  try {
    const result = await compileMDX({
      source: sanitized,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        },
      },
    });
    mdxContent = result.content;
  } catch {
    mdxContent = (
      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{post.content}</div>
    );
  }

  // Related posts scored by shared categories (3pts), tags (2pts), orgs (2pts), recency (1pt)
  const postDate = new Date(post.date).getTime();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.postType === "post")
    .map((p) => {
      const sharedCategories = p.categories.filter((c) => post.categories.includes(c)).length;
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length;
      const sharedOrgs = p.organizations.filter((o) => post.organizations.includes(o)).length;
      const ageDiffYears =
        Math.abs(new Date(p.date).getTime() - postDate) / (1000 * 60 * 60 * 24 * 365);
      const recencyScore = Math.max(0, 1 - ageDiffYears / 5);
      const score = sharedCategories * 3 + sharedTags * 2 + sharedOrgs * 2 + recencyScore;
      return { post: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post: p }) => p);

  let imgSrc = post.featuredImage ? resolveImageUrl(post.featuredImage) : null;
  if (imgSrc?.startsWith("//")) imgSrc = `https:${imgSrc}`;

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-sm text-navy-500 dark:text-horchata-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-navy-900 dark:text-horchata-100 md:text-3xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-base leading-relaxed text-navy-600 dark:text-horchata-300">
              {post.excerpt}
            </p>
          )}
          {post.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat}`}
                  className="relative z-20 flex cursor-pointer items-center gap-1.5 rounded-full bg-horchata-100 px-3 py-1 text-xs font-medium text-horchata-800 transition-colors hover:bg-horchata-200 dark:bg-navy-700 dark:text-white/70 dark:hover:bg-navy-600 dark:hover:text-white"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {categoryImages[cat] && (
                    <img
                      src={categoryImages[cat]}
                      alt=""
                      className="-my-0.5 h-4 w-4 object-contain"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured image */}
        {imgSrc &&
          (canOptimize(imgSrc) ? (
            <Image
              src={imgSrc}
              alt={post.title}
              width={800}
              height={450}
              className="mx-auto mb-10 rounded-xl"
              priority
            />
          ) : (
            /* eslint-disable @next/next/no-img-element */
            <img src={imgSrc} alt={post.title} className="mx-auto mb-10 max-w-full rounded-xl" />
          ))}

        {/* MDX content */}
        <div className="prose prose-base max-w-none dark:prose-invert [&_li]:text-base [&_p]:text-base">
          {mdxContent}
        </div>

        <hr className="mt-10 border-horchata-200 dark:border-navy-700" />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-500 dark:text-horchata-400">
              Tags 🏷️
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="inline-flex items-center rounded-full bg-horchata-100 px-2.5 py-0.5 text-xs font-medium text-navy-700 transition-colors hover:bg-horchata-500 hover:text-navy-900 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500 dark:hover:text-white"
                >
                  #{tag.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Organizations */}
        {organizations.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-500 dark:text-horchata-400">
              Organizations 🏢
            </p>
            <div className="flex flex-wrap gap-3">
              {organizations.map((org) => {
                let logoSrc = resolveImageUrl(org.logo);
                if (logoSrc.startsWith("//")) logoSrc = `https:${logoSrc}`;
                const isOptimizable = canOptimize(logoSrc);
                return (
                  <Link
                    key={org.slug}
                    href={`/organizations/${org.slug}`}
                    className="flex items-center gap-2 rounded-lg bg-horchata-50 px-3 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-100 dark:bg-navy-800 dark:text-white/70 dark:hover:bg-navy-700"
                  >
                    {isOptimizable ? (
                      <Image
                        src={logoSrc}
                        alt={org.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded object-contain"
                      />
                    ) : (
                      /* eslint-disable @next/next/no-img-element */
                      <img src={logoSrc} alt={org.name} className="h-8 w-8 rounded object-contain" />
                    )}
                    {org.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Author */}
        <div className="mt-10">
          <Link
            href="/about"
            className="group flex items-center gap-6 rounded-2xl border-2 border-horchata-300 bg-horchata-50 p-6 transition-all hover:border-horchata-400 hover:shadow-md dark:border-navy-600 dark:bg-navy-800 dark:hover:border-horchata-500"
          >
            <Image
              src="/images/assets/frances-slack.jpg"
              alt="Frances Coronel"
              width={80}
              height={80}
              className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-horchata-400"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-horchata-600 dark:text-horchata-400">
                Written by
              </p>
              <p className="mt-1 text-xl font-bold text-navy-900 dark:text-white">Frances Coronel</p>
              <p className="mt-1 text-sm text-navy-600 dark:text-white/60">
                Senior Software Engineer at Slack with 8+ years of experience in frontend engineering
                and AI adoption. Speaker, mentor, and proud Peruvian-American. 👩🏽‍💻
              </p>
            </div>
            <svg
              className="h-5 w-5 flex-shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-horchata-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Prev / Next */}
        <div className="mt-10">
          <PrevNextNav
            prev={prevPost ? { slug: prevPost.slug, title: prevPost.title } : null}
            next={nextPost ? { slug: nextPost.slug, title: nextPost.title } : null}
            basePath="/posts"
            allLabel="Posts"
          />
        </div>
      </article>

      <NewsletterCTA />

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
              Keep Reading
            </p>
            <h2 className="mb-8 mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Related Posts
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((p) => (
                <BlogCard key={p.slug} post={p} categoryImages={categoryImages} basePath="/posts" />
              ))}
            </div>
          </div>
        </section>
      )}

      <ConnectCTA variant="follow" />
    </>
  );
}
