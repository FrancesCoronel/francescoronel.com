"use client";

import { useState } from "react";
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
            basePath="/posts"
            hideReadingTime
          />
        ))}
      </div>

      <PaginationNav page={page} totalPages={totalPages} onPage={setPage} />

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
