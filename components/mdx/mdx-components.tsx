import Image from "next/image";
import Link from "next/link";
import { Tweet as ReactTweet } from "react-tweet";
import type { ComponentType } from "react";
const Tweet = ReactTweet as ComponentType<{ id: string }>;
import { resolveImageUrl } from "@/lib/cloudinary";
import { canOptimize } from "@/lib/utils";
import { ZoomableImage } from "@/components/ui/zoomable-image";
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
      <ZoomableImage src={normalized} alt={alt || ""} className="my-6 block">
        <Image
          src={normalized}
          alt={alt || ""}
          width={800}
          height={450}
          className="rounded-lg"
          {...(props as Record<string, unknown>)}
        />
      </ZoomableImage>
    );
  }

  // Regular img tag for everything else (external hosts, local paths, etc.)
  /* eslint-disable @next/next/no-img-element */
  return (
    <ZoomableImage src={normalized} alt={alt || ""} className="my-6 block">
      <img
        src={normalized}
        alt={alt || ""}
        className="max-w-full rounded-lg"
        loading="lazy"
      />
    </ZoomableImage>
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

function MdxParagraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // If the paragraph contains only a tweet embed, render a div to avoid
  // invalid <div> inside <p> hydration errors (react-tweet renders divs)
  const child =
    Array.isArray(children) && children.length === 1 ? children[0] : children;
  if (
    child &&
    typeof child === "object" &&
    "props" in child &&
    typeof child.props?.className === "string" &&
    child.props.className.includes("not-prose") &&
    child.props.className.includes("justify-center")
  ) {
    return <div {...props}>{children}</div>;
  }
  return <p {...props}>{children}</p>;
}

export const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
  p: MdxParagraph,
  Callout,
  Image: MdxImage,
  Tweet,
};
