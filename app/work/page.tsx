import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostsByCategory, getCategoryMaps, getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PostsListClient } from "@/components/ui/posts-list-client";
import { getMultipleRepoStars } from "@/lib/github";
import { resolveImageUrl } from "@/lib/cloudinary";

const FEATURED_SLUGS = ["latina-dev", "apprenticeships-me", "hire-me"];

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

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Side projects, open-source tools, hackathon builds, and work projects from Frances Coronel.",
  path: "/work",
});

export default async function ProjectsPage() {
  const portfolioPosts = getBlogPostsByCategory("portfolio").map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));
  const { categoryImages } = getCategoryMaps();

  const projects = getProjects();
  const reposToFetch = Object.fromEntries(
    projects.filter((p) => p.github).map((p) => [p.slug, p.github as string])
  );
  const starsMap = await getMultipleRepoStars(reposToFetch);
  const totalStars = Object.values(starsMap).reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const repoCount = Object.values(starsMap).filter((s) => s != null).length;

  return (
    <>
      <PageHeader
        label="Built & Shipped"
        heading="Work 🛠️"
        description="Side projects, open-source directories, hackathon builds, and notable work projects I've shipped over the years."
        aside={
          <Image
            src="/images/assets/rocket-illustration.webp"
            alt=""
            width={300}
            height={300}
            className="h-auto w-[200px] object-contain drop-shadow-lg sm:w-[260px] md:w-[360px]"
            aria-hidden="true"
          />
        }
      />

      {totalStars > 0 && (
        <div className="border-b border-horchata-200 bg-white py-4 dark:border-navy-700 dark:bg-navy-900">
          <div className="mx-auto flex max-w-[var(--container-max)] flex-wrap items-center gap-6 px-6 text-sm text-navy-500 dark:text-white/50">
            <a
              href="https://github.com/FrancesCoronel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-navy-700 dark:hover:text-white/80"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-semibold text-navy-700 dark:text-white/80">{totalStars.toLocaleString()}</span>
              total GitHub stars across all projects
            </a>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 fill-current text-horchata-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-semibold text-navy-700 dark:text-white/80">{repoCount}</span>
              repos tracked
            </span>
          </div>
        </div>
      )}

      {/* Featured projects grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Featured
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Work 🛠️
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.filter((p) => FEATURED_SLUGS.includes(p.slug)).map((project) => (
              <Link
                key={project.slug}
                href={`/posts/${project.slug}`}
                className="group flex flex-col rounded-2xl border border-horchata-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-navy-700 dark:bg-navy-800"
              >
                <div className="flex items-start justify-between gap-3">
                  {project.logo ? (
                    <Image
                      src={resolveImageUrl(project.logo)}
                      alt={project.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-horchata-100 text-xl dark:bg-navy-700">
                      🛠️
                    </div>
                  )}
                  <div className="flex flex-col items-end gap-1">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"]}`}>
                      {CATEGORY_LABELS[project.category] ?? project.category}
                    </span>
                    {project.status === "active" && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="mt-3 break-words font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                  {project.title}
                </h3>
                <p className="mt-1 flex-1 line-clamp-2 text-sm text-navy-500 dark:text-white/60">
                  {project.tagline}
                </p>
                {starsMap[project.slug] != null && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-navy-400 dark:text-white/40">
                    <svg className="h-3.5 w-3.5 fill-current text-horchata-500" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {starsMap[project.slug]!.toLocaleString()} stars
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Writing & Case Studies
          </p>
          <h2 className="mt-1 mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Portfolio Posts 📝 <span className="text-lg font-normal text-navy-400 dark:text-white/40">({portfolioPosts.length})</span>
          </h2>
          <PostsListClient posts={portfolioPosts} categoryImages={categoryImages} hideSearch />
        </div>
      </section>

      <ConnectCTA variant="projects" />
    </>
  );
}
