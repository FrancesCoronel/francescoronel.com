import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostsListClient } from "@/components/ui/posts-list-client";
import { getCategoryBySlug, getCategories, getBlogPostsByCategory, getCategoryMaps } from "@/lib/content";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCategories().map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.name,
    description: category.description || `Blog posts in the ${category.name} category.`,
    path: `/categories/${slug}`,
    ogImage: category.image || undefined,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getBlogPostsByCategory(slug).map((p) => ({
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
        label="Category"
        heading={
          <span className="inline-flex items-center gap-3">
            {category.name}
            {category.image && (
              <Image
                src={category.image}
                alt=""
                width={40}
                height={40}
                className="inline-block h-10 w-10 object-contain"
                aria-hidden="true"
              />
            )}
          </span>
        }
        description={category.description || `Blog posts in the ${category.name} category.`}
      />

      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="mb-6 text-sm text-navy-600 dark:text-horchata-400">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
          <PostsListClient posts={posts} categoryImages={categoryImages} hideSearch />
        </div>
      </section>

      <NewsletterCTA />

      <ConnectCTA variant="follow" />
    </>
  );
}
