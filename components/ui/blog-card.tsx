import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/cloudinary";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  categoryImages?: Record<string, string>;
  hideReadingTime?: boolean;
  basePath?: string;
}

export function BlogCard({ post, categoryImages, hideReadingTime, basePath = "/blog" }: BlogCardProps) {
  return (
    <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-horchata-200 bg-white transition-shadow hover:shadow-lg dark:border-navy-700 dark:bg-navy-800">
      <Link
        href={`${basePath}/${encodeURIComponent(post.slug)}`}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />
      {post.featuredImage && (
        <div className="overflow-hidden">
          <Image
            src={resolveImageUrl(post.featuredImage)}
            alt={post.title}
            width={600}
            height={340}
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-3 text-xs text-navy-500 dark:text-white/60">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {!hideReadingTime && parseInt(post.readingTime) > 1 && (
            <>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
        <h3 className="mb-2 break-words text-lg font-bold leading-snug text-navy-900 group-hover:text-horchata-700 dark:text-white dark:group-hover:text-white/80">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-navy-600 dark:text-white/70">
          {post.excerpt}
        </p>
        {post.categories.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-3">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1.5 rounded-full bg-horchata-100 px-3 py-1 text-xs font-medium text-horchata-800 dark:bg-navy-700 dark:text-white/70"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                {categoryImages?.[cat] && (
                  <img
                    src={categoryImages[cat]}
                    alt=""
                    className="-my-0.5 h-4 w-4 object-contain"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
