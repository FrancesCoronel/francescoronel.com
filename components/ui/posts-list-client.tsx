"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "./blog-card";

interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  featuredImage: string;
  categories: string[];
}

interface PostsListClientProps {
  posts: PostSummary[];
  categoryImages?: Record<string, string>;
  hideSearch?: boolean;
}

const POSTS_PER_PAGE = 18;

export function PostsListClient({ posts, categoryImages, hideSearch }: PostsListClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <>
      {/* Search input */}
      {!hideSearch && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ fontSize: "16px" }}
            className="w-full rounded-lg border border-horchata-200 bg-white px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-horchata-400 focus:outline-none focus:ring-2 focus:ring-horchata-400/30 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder:text-horchata-500 dark:focus:border-horchata-500"
          />
        </div>
      )}

      {/* Results count */}
      <p className="mt-4 text-sm text-navy-500 dark:text-horchata-400">
        Showing {paginated.length} of {filtered.length} posts
        {search.trim() && ` matching "${search.trim()}"`}
      </p>

      {/* Blog Grid */}
      <h2 className="sr-only">Posts</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            No posts found{search.trim() ? ` matching "${search.trim()}"` : ""}.
          </p>
          {search.trim() && (
            <button
              onClick={() => handleSearchChange("")}
              className="mt-4 text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </>
  );
}
