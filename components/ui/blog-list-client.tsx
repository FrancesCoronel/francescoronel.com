"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "./blog-card";
import type { Category } from "@/lib/types";
import { PaginationNav } from "./pagination-nav";

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

      <PaginationNav page={page} totalPages={totalPages} onPage={setPage} />

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
