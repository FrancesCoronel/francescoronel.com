import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PostsListClient } from "@/components/ui/posts-list-client";
import { getBlogPostsByCategory, getCategoryMaps } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";

export const metadata: Metadata = buildMetadata({
  title: "Essays",
  description:
    "Essays by Frances Coronel on how companies adopt agentic AI across the whole software lifecycle, engineering leadership, and building a career with intention.",
  path: "/essays",
  ogImage: "/images/og/blog.jpg",
});

export default function EssaysPage() {
  const posts = getBlogPostsByCategory("essays").map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));
  const { categoryImages } = getCategoryMaps();

  return (
    <>
      <PageHeader
        label="Writing"
        heading="Essays 🌳"
        description="AI is fertilizer. I help teams learn to prune. Long-form thinking on how companies adopt agentic AI, for engineers and everyone else."
        aside={
          <Image
            src="/images/assets/newsletter-cta.webp"
            alt=""
            width={280}
            height={280}
            className="h-auto w-[200px] object-contain drop-shadow-lg sm:w-[260px] md:w-[360px]"
            aria-hidden="true"
            priority
          />
        }
      />

      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-navy-600 dark:text-horchata-400">
              {posts.length} essay{posts.length !== 1 ? "s" : ""}
            </p>
            <Link
              href="/posts"
              className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
            >
              Browse all posts →
            </Link>
          </div>
          <PostsListClient posts={posts} categoryImages={categoryImages} hideSearch />
        </div>
      </section>

      <NewsletterCTA />

      <ConnectCTA variant="follow" />
    </>
  );
}
