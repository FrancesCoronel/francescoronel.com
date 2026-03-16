import type { Metadata } from "next";
import { getBlogPostsByCategory, getCategoryMaps } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PostsListClient } from "@/components/ui/posts-list-client";
import Image from "next/image";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Projects, work, and things I've built — a curated portfolio from Frances Coronel.",
  path: "/portfolio",
});

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

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
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
