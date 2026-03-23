import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostsByCategory, getCategoryMaps, getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PostsListClient } from "@/components/ui/posts-list-client";
import { resolveImageUrl } from "@/lib/cloudinary";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Projects, work, and things I've built — a curated portfolio from Frances Coronel.",
  path: "/portfolio",
});

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

export default function PortfolioPage() {
  const posts = getBlogPostsByCategory("portfolio").map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));

  const projects = getProjects();
  const { categoryImages } = getCategoryMaps();

  return (
    <>
      <PageHeader
        label="Work"
        heading="Portfolio 🗂️"
        description="Projects, features, and things I've built or contributed to over the years."
        aside={
          <Image
            src="/images/assets/memoji-laptop.png"
            alt=""
            width={256}
            height={256}
            className="h-48 w-48 object-contain drop-shadow-lg md:h-56 md:w-56"
            aria-hidden="true"
          />
        }
      />

      {/* Projects section */}
      <section className="border-b border-horchata-200 py-16 md:py-20 dark:border-navy-700">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                Built & Shipped
              </p>
              <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                Projects 🛠️
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-medium text-horchata-700 hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
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
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS["side-project"]}`}
                    >
                      {CATEGORY_LABELS[project.category] ?? project.category}
                    </span>
                    {project.status === "active" && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="mt-3 font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                  {project.title}
                </h3>
                <p className="mt-1 flex-1 line-clamp-2 text-sm text-navy-500 dark:text-white/60">
                  {project.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog posts (portfolio category) */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Writing & Case Studies
          </p>
          <h2 className="mt-1 mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Portfolio Posts 📝
          </h2>
          <p className="mb-6 text-sm text-navy-500 dark:text-horchata-400">
            {posts.length} item{posts.length !== 1 ? "s" : ""}
          </p>
          <PostsListClient posts={posts} categoryImages={categoryImages} hideSearch />
        </div>
      </section>

      <ConnectCTA />
    </>
  );
}
