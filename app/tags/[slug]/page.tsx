import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsListClient } from "@/components/ui/posts-list-client";
import Link from "next/link";
import {
  getTagBySlug,
  getTags,
  getPostsByTag,
  getExperiencesBySkill,
  getCategoryMaps,
} from "@/lib/content";
import { formatDateRange } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};
  return buildMetadata({
    title: `${tag.name}`,
    description: `Posts, projects and roles tagged with ${tag.name}.`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const posts = getPostsByTag(slug).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));

  const roles = getExperiencesBySkill(slug);
  const { categoryImages } = getCategoryMaps();
  const plural = (n: number, word: string) => `${n} ${word}${n !== 1 ? "s" : ""}`;
  const summary = [
    posts.length > 0 ? plural(posts.length, "post") : null,
    roles.length > 0 ? plural(roles.length, "role") : null,
  ]
    .filter(Boolean)
    .join(" and ");

  return (
    <>
      <PageHeader
        label="Tag"
        heading={`${tag.name}`}
        description={`${summary} tagged with ${tag.name}.`}
      />

      {posts.length > 0 && (
        <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <PostsListClient posts={posts} categoryImages={categoryImages} hideSearch />
          </div>
        </section>
      )}

      {roles.length > 0 && (
        <section
          className={
            posts.length > 0
              ? "bg-horchata-50 py-16 md:py-20 dark:bg-navy-900"
              : "border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950"
          }
        >
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
              Experience
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Where I Used It 💼
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <li key={role.slug}>
                  <Link
                    href={`/experience/${role.slug}`}
                    className="block h-full rounded-2xl border border-horchata-200 bg-white p-5 transition-colors hover:border-horchata-400 dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                  >
                    <p className="font-bold text-navy-900 dark:text-horchata-100">{role.title}</p>
                    <p className="mt-1 text-sm text-navy-700 dark:text-horchata-300">{role.company}</p>
                    <p className="mt-1 text-xs text-navy-600 dark:text-horchata-400">
                      {formatDateRange(role.startDate, role.endDate)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <NewsletterCTA />

      <ConnectCTA variant="follow" />
    </>
  );
}
