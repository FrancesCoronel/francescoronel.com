"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "./blog-card";
import type { Category } from "@/lib/types";

interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  featuredImage: string;
  categories: string[];
}

const POSTS_PER_PAGE = 18;

export function BlogListClient({
  posts,
  categories,
}: {
  posts: PostSummary[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const categoryImages = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cat of categories) {
      if (cat.image) map[cat.slug] = cat.image;
    }
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((p) => p.categories.includes(activeCategory));
  }, [posts, activeCategory]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  function handleCategoryClick(slug: string) {
    setActiveCategory(activeCategory === slug ? null : slug);
    setPage(1);
  }

  return (
    <>
      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveCategory(null);
              setPage(1);
            }}
            className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-horchata-700 text-white dark:bg-horchata-500 dark:text-navy-900"
                : "bg-horchata-100 text-horchata-800 hover:bg-horchata-200 dark:bg-navy-700 dark:text-white/70"
            }`}
          >
            All ({posts.length})
          </button>
          {categories.filter((cat) => (cat.count ?? 0) > 0).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-horchata-700 text-white dark:bg-horchata-500 dark:text-navy-900"
                  : "bg-horchata-100 text-horchata-800 hover:bg-horchata-200 dark:bg-navy-700 dark:text-white/70"
              }`}
            >
              {cat.image ? (
                <img src={cat.image} alt="" className="h-5 w-5 object-contain" aria-hidden="true" />
              ) : cat.emoji ? (
                <span aria-hidden="true">{cat.emoji}</span>
              ) : null}
              {cat.name} {cat.count != null && `(${cat.count})`}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="mt-6 text-sm text-navy-500 dark:text-horchata-400">
        Showing {paginated.length} of {filtered.length} posts
        {activeCategory && ` in "${activeCategory}"`}
      </p>

      {/* Blog Grid */}
      <h2 className="sr-only">Posts</h2>
      <div className="mt-6 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((post) => (
          <BlogCard key={post.slug} post={post as never} categoryImages={categoryImages} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="cursor-pointer rounded-lg border border-horchata-200 px-3 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-500 dark:hover:bg-horchata-500 dark:hover:text-navy-900"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(p - page) <= 2) return true;
              return false;
            })
            .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) {
                acc.push("ellipsis");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-navy-400 dark:text-horchata-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    page === item
                      ? "border-horchata-500 bg-horchata-500 text-navy-900 dark:border-horchata-500 dark:bg-horchata-500 dark:text-navy-900"
                      : "border-horchata-200 text-navy-700 hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-500 dark:hover:bg-horchata-500 dark:hover:text-navy-900"
                  }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="cursor-pointer rounded-lg border border-horchata-200 px-3 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-500 dark:hover:bg-horchata-500 dark:hover:text-navy-900"
          >
            Next
          </button>
        </nav>
      )}

      {/* Empty state */}
      {paginated.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-navy-500 dark:text-horchata-400">
            No posts found in this category.
          </p>
          <button
            onClick={() => {
              setActiveCategory(null);
              setPage(1);
            }}
            className="mt-4 text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400"
          >
            Show all posts
          </button>
        </div>
      )}
    </>
  );
}
