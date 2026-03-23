"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "./blog-card";
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
          <BlogCard key={post.slug} post={post as never} categoryImages={categoryImages} basePath="/posts" />
        ))}
      </div>

      <PaginationNav page={page} totalPages={totalPages} onPage={setPage} />

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
