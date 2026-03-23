import type { Metadata } from "next";
import Image from "next/image";
import { getAllPosts, getCategories } from "@/lib/content";
import { BlogListClient } from "@/components/ui/blog-list-client";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";

export const metadata: Metadata = buildMetadata({
  title: "Posts",
  description:
    "Blog posts, project write-ups, and case studies by Frances Coronel — software engineering, tech career, AI, and more.",
  path: "/posts",
  ogImage: "/images/og/blog.jpg",
});

export default function PostsListingPage() {
  const allPosts = getAllPosts();
  const posts = allPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));
  const categories = getCategories();

  return (
    <>
      <PageHeader
        label="Writing & Work"
        heading="Blog ✍🏽"
        description="Blog posts, project write-ups, and case studies on software engineering, tech career, AI, and more."
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
          <BlogListClient posts={posts} categories={categories} />
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
