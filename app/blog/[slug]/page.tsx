import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { getBlogPost, getBlogSlugs, getAllBlogPosts, getOrganizationBySlug, getCategoryMaps } from "@/lib/content";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { resolveImageUrl, ogImageUrl } from "@/lib/cloudinary";
import { formatDate } from "@/lib/utils";
import { sanitizeMdxContent } from "@/lib/sanitize-mdx";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { BlogCard } from "@/components/ui/blog-card";
import { buildMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogType: "article",
    publishedTime: post.date,
    ogImage: post.featuredImage
      ? ogImageUrl(post.featuredImage.replace("cloudinary://", ""))
      : undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const sanitized = sanitizeMdxContent(post.content);

  let content: React.ReactNode;
  try {
    const result = await compileMDX({
      source: sanitized,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        },
      },
    });
    content = result.content;
  } catch {
    // Fallback: render raw content as preformatted text
    content = (
      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {post.content}
      </div>
    );
  }

  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Related posts: same category, excluding current
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.categories.some((c) => post.categories.includes(c))
    )
    .slice(0, 3);

  // Resolve organization data from slugs in frontmatter
  const organizations = post.organizations
    .map((orgSlug) => getOrganizationBySlug(orgSlug))
    .filter((org): org is NonNullable<typeof org> => org != null);

  // Build category lookup maps for emoji/image display
  const { categoryImages } = getCategoryMaps();

  return (
    <>
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-sm text-navy-500 dark:text-horchata-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-navy-900 dark:text-horchata-100 md:text-4xl">
          {post.title}
        </h1>
        {post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat}`}
                className="relative z-20 flex cursor-pointer items-center gap-1.5 rounded-full bg-horchata-100 px-3 py-1 text-xs font-medium text-horchata-800 transition-colors hover:bg-horchata-200 dark:bg-navy-700 dark:text-white/70"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                {categoryImages[cat] && (
                  <img
                    src={categoryImages[cat]}
                    alt=""
                    className="-my-0.5 h-4 w-4 object-contain"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Featured image */}
      {post.featuredImage && (() => {
        let imgSrc = resolveImageUrl(post.featuredImage);
        if (imgSrc.startsWith("//")) imgSrc = `https:${imgSrc}`;
        const isOptimizable = (() => {
          try {
            const { hostname } = new URL(imgSrc);
            return ["res.cloudinary.com", "cdn.prod.website-files.com", "uploads-ssl.webflow.com"].includes(hostname);
          } catch { return false; }
        })();
        return isOptimizable ? (
          <Image
            src={imgSrc}
            alt={post.title}
            width={800}
            height={450}
            className="mx-auto mb-10 rounded-xl"
            priority
          />
        ) : (
          /* eslint-disable @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={post.title}
            className="mx-auto mb-10 max-w-full rounded-xl"
          />
        );
      })()}

      {/* MDX content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {content}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-10 border-t border-horchata-200 pt-6 dark:border-navy-700">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-500 dark:text-horchata-400">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-center rounded-full bg-horchata-100 px-2.5 py-0.5 text-xs font-medium text-navy-700 transition-colors hover:bg-horchata-500 hover:text-navy-900 dark:bg-navy-600 dark:text-white dark:hover:bg-navy-500"
              >
                #{tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Organizations */}
      {organizations.length > 0 && (
        <div className="mt-10 border-t border-horchata-200 pt-6 dark:border-navy-700">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-500 dark:text-horchata-400">
            Organizations
          </p>
          <div className="flex flex-wrap gap-3">
            {organizations.map((org) => {
              let logoSrc = resolveImageUrl(org.logo);
              if (logoSrc.startsWith("//")) logoSrc = `https:${logoSrc}`;
              const isOptimizable = (() => {
                try {
                  const { hostname } = new URL(logoSrc);
                  return ["res.cloudinary.com", "cdn.prod.website-files.com", "uploads-ssl.webflow.com"].includes(hostname);
                } catch { return false; }
              })();
              return (
                <Link
                  key={org.slug}
                  href={`/organizations/${org.slug}`}
                  className="flex items-center gap-2 rounded-lg bg-horchata-50 px-3 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-100 dark:bg-navy-800 dark:text-white/70 dark:hover:bg-navy-700"
                >
                  {isOptimizable ? (
                    <Image
                      src={logoSrc}
                      alt={org.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded object-contain"
                    />
                  ) : (
                    /* eslint-disable @next/next/no-img-element */
                    <img
                      src={logoSrc}
                      alt={org.name}
                      className="h-8 w-8 rounded object-contain"
                    />
                  )}
                  {org.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Author */}
      <div className="mt-10 border-t border-horchata-200 pt-8 dark:border-navy-700">
        <Link
          href="/about"
          className="flex items-center gap-5 rounded-2xl border border-horchata-200 bg-horchata-50 p-6 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
        >
          <Image
            src="/images/assets/frances-headshot.png"
            alt="Frances Coronel"
            width={80}
            height={80}
            className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-horchata-200 dark:ring-navy-600"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-navy-500 dark:text-horchata-400">
              Written by
            </p>
            <p className="mt-1 text-lg font-bold text-navy-900 dark:text-horchata-100">
              Frances Coronel
            </p>
            <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
              Senior Software Engineer at Slack. Speaker, mentor, and proud Peruvian-American. 👩🏽‍💻
            </p>
          </div>
        </Link>
      </div>

      {/* Prev / Next */}
      <div className="mt-10">
        <PrevNextNav
          prev={prevPost ? { slug: prevPost.slug, title: prevPost.title } : null}
          next={nextPost ? { slug: nextPost.slug, title: nextPost.title } : null}
          basePath="/blog"
        />
      </div>

    </article>

    {/* Related posts — full width breakout */}
    {relatedPosts.length > 0 && (
      <section className="mx-auto max-w-[var(--container-max)] px-6 pb-16">
        <h2 className="mb-6 text-xl font-bold text-navy-900 dark:text-horchata-100">
          Related Posts
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((p) => (
            <BlogCard key={p.slug} post={p} categoryImages={categoryImages} />
          ))}
        </div>
      </section>
    )}
    </>
  );
}
