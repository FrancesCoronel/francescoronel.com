import type { Metadata } from "next";
import Image from "next/image";
import { getBlogPostsByCategory, getCategoryMaps } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PostsListClient } from "@/components/ui/posts-list-client";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Side projects, open-source tools, hackathon builds, and work projects from Frances Coronel.",
  path: "/projects",
});

export default function ProjectsPage() {
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
            className="h-auto w-[200px] object-contain drop-shadow-lg sm:w-[260px] md:w-[360px]"
            aria-hidden="true"
          />
        }
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Writing & Case Studies
          </p>
          <h2 className="mt-1 mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Portfolio Posts 📝
          </h2>
          <p className="mb-6 text-sm text-navy-500 dark:text-horchata-400">
            {portfolioPosts.length} item{portfolioPosts.length !== 1 ? "s" : ""}
          </p>
          <PostsListClient posts={portfolioPosts} categoryImages={categoryImages} hideSearch />
        </div>
      </section>

      <ConnectCTA variant="projects" />
    </>
  );
}
