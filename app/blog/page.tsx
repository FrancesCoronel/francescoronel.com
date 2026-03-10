import type { Metadata } from "next";
import Image from "next/image";
import { getAllBlogPosts, getCategories } from "@/lib/content";
import { BlogListClient } from "@/components/ui/blog-list-client";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Read Frances Coronel's blog posts about software engineering, tech, career growth, and more.",
  path: "/blog",
  ogImage: "/images/og/blog.jpg",
});

export default function BlogListingPage() {
  const allPosts = getAllBlogPosts();
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
        label="Writing"
        heading="Blog ✍🏽"
        description="Thoughts on software engineering, tech, career growth, and more."
        aside={
          <Image
            src="/images/assets/newsletter-cta.webp"
            alt="Newsletter illustration"
            width={400}
            height={400}
            className="h-auto w-[160px] drop-shadow-lg sm:w-[200px] md:w-[280px]"
            priority
          />
        }
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <BlogListClient posts={posts} categories={categories} />
        </div>
      </section>

      <ConnectCTA variant="follow" />
    </>
  );
}
