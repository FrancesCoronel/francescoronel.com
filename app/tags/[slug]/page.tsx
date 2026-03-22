import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsListClient } from "@/components/ui/posts-list-client";
import { getTagBySlug, getTags, getBlogPostsByTag, getCategoryMaps } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";

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
    description: `Blog posts tagged with ${tag.name}.`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const posts = getBlogPostsByTag(slug).map((p) => ({
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
        label="Tag"
        heading={`${tag.name}`}
        description={`${posts.length} post${posts.length !== 1 ? "s" : ""} tagged with ${tag.name}.`}
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <PostsListClient posts={posts} categoryImages={categoryImages} hideSearch />
        </div>
      </section>

      <ConnectCTA variant="follow" />
    </>
  );
}
