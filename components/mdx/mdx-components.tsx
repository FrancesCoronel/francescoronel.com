import Image from "next/image";
import Link from "next/link";
import { Tweet } from "react-tweet";
import { resolveImageUrl } from "@/lib/cloudinary";
import { canOptimize } from "@/lib/utils";
import type { MDXComponents } from "mdx/types";

function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

function normalizeUrl(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function MdxImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src || typeof src !== "string") return null;

  const normalized = normalizeUrl(resolveImageUrl(src));

  // Use next/image only for hosts we've configured
  if (canOptimize(normalized)) {
    return (
      <Image
        src={normalized}
        alt={alt || ""}
        width={800}
        height={450}
        className="my-6 rounded-lg"
        {...(props as Record<string, unknown>)}
      />
    );
  }

  // Regular img tag for everything else (external hosts, local paths, etc.)
  /* eslint-disable @next/next/no-img-element */
  return (
    <img
      src={normalized}
      alt={alt || ""}
      className="my-6 max-w-full rounded-lg"
      loading="lazy"
    />
  );
}

function MdxLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <span {...props}>{children}</span>;

  // Auto-embed naked Twitter/X URLs
  const tweetId = extractTweetId(href);
  if (tweetId && children === href) {
    return (
      <span className="not-prose my-6 flex justify-center">
        <Tweet id={tweetId} />
      </span>
    );
  }

  const isExternal = href.startsWith("http") || href.startsWith("//");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-horchata-800 underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-horchata-800 underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
      {...props}
    >
      {children}
    </Link>
  );
}

function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "tip";
}) {
  const styles = {
    info: "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
    warning: "border-amber-400 bg-amber-50 dark:bg-amber-950/30",
    tip: "border-green-400 bg-green-50 dark:bg-green-950/30",
  };

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
  Callout,
  Image: MdxImage,
  Tweet,
};
