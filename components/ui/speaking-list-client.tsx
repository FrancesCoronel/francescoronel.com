"use client";

import { useState } from "react";
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

interface SpeakingListClientProps {
  posts: PostSummary[];
  categoryImages?: Record<string, string>;
}

const POSTS_PER_PAGE = 12;

export function SpeakingListClient({ posts, categoryImages }: SpeakingListClientProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginated = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  // Hide all category badges on speaking page
  const filteredPosts = paginated.map((post) => ({
    ...post,
    categories: [] as string[],
  }));

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.slug}
            post={post as never}
            categoryImages={categoryImages}
            hideReadingTime
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="cursor-pointer rounded-lg border border-horchata-300 px-4 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-400 dark:hover:bg-horchata-400 dark:hover:text-navy-900"
          >
            Previous
          </button>
          <span className="text-sm text-navy-500 dark:text-horchata-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="cursor-pointer rounded-lg border border-horchata-300 px-4 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-400 dark:hover:bg-horchata-400 dark:hover:text-navy-900"
          >
            Next
          </button>
        </nav>
      )}

      {paginated.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-lg text-horchata-400">
            No speaking events found.
          </p>
        </div>
      )}
    </>
  );
}
