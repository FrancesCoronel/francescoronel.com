import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { canOptimize } from "@/lib/utils";

function SafeTweet({ id }: { id: string }) {
  return (
    <a
      href={`https://twitter.com/i/status/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-horchata-600 hover:text-horchata-800 underline"
    >
      View on X/Twitter ↗
    </a>
  );
}
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { LinkPreview as LinkPreviewRSC } from "@/components/ui/link-preview";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LinkPreview = LinkPreviewRSC as any as (props: { url: string }) => React.ReactElement;
import type { MDXComponents } from "mdx/types";

function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]+)/
  );
  return match ? match[1] : null;
}

function extractInstagramId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
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

  const normalized = normalizeUrl(src);

  // Use next/image only for hosts we've configured
  if (canOptimize(normalized)) {
    return (
      <ZoomableImage src={normalized} alt={alt || ""} className="my-6 block">
        <Image
          src={normalized}
          alt={alt || ""}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
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

  const isNaked = children === href;
  const isExternal = href.startsWith("http") || href.startsWith("//");

  if (isNaked && isExternal) {
    // Twitter/X embed
    const tweetId = extractTweetId(href);
    if (tweetId) {
      return (
        <span className="not-prose my-6 flex justify-center">
          <SafeTweet id={tweetId} />
        </span>
      );
    }

    // YouTube embed
    const youtubeId = extractYouTubeId(href);
    if (youtubeId) {
      return (
        <span className="not-prose my-6 flex justify-center">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            className="aspect-video w-full max-w-2xl rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </span>
      );
    }

    // Instagram embed
    const instagramId = extractInstagramId(href);
    if (instagramId) {
      return (
        <span className="not-prose my-6 flex justify-center">
          <iframe
            src={`https://www.instagram.com/p/${instagramId}/embed/`}
            width="400"
            height="505"
            className="rounded-xl"
            scrolling="no"
            loading="lazy"
          />
        </span>
      );
    }

    // Generic OG preview card for news articles, blog posts, etc.
    return (
      <span className="not-prose my-6 flex justify-center">
        <Suspense
          fallback={
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-horchata-800 underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
            >
              {href}
            </a>
          }
        >
          <LinkPreview url={href} />
        </Suspense>
      </span>
    );
  }

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

function LinkedInEmbed({ shareId, url }: { shareId: string; url: string }) {
  return (
    <span className="not-prose my-6 flex flex-col items-center gap-2">
      <iframe
        src={`https://www.linkedin.com/embed/feed/update/urn:li:share:${shareId}`}
        className="w-full max-w-lg rounded-xl"
        height="399"
        frameBorder={0}
        allowFullScreen
        title="Embedded LinkedIn post"
        loading="lazy"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-horchata-700 underline decoration-horchata-300 underline-offset-2 hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
      >
        View on LinkedIn →
      </a>
    </span>
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
  // When a paragraph's only child is a naked external link, MdxLink renders it
  // as a block embed (tweet, youtube, instagram, or OG card). Those contain
  // block-level elements which are invalid inside <p>, causing hydration errors.
  // Detect this case by inspecting the child element's type + props directly
  // (children are unrendered React elements at this point, not rendered HTML).
  const child =
    Array.isArray(children) && children.length === 1 ? children[0] : children;
  if (
    child &&
    typeof child === "object" &&
    "type" in child &&
    child.type === MdxLink
  ) {
    const href = child.props?.href as string | undefined;
    const linkText = child.props?.children;
    const isNaked = linkText === href;
    const isExternal =
      typeof href === "string" &&
      (href.startsWith("http") || href.startsWith("//"));
    if (isNaked && isExternal) {
      return <div {...props}>{children}</div>;
    }
  }
  return <p {...props}>{children}</p>;
}

export const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
  p: MdxParagraph,
  Callout,
  Image: MdxImage,
  Tweet: SafeTweet,
  LinkedInEmbed,
  h1: ({ children, ...props }) => (
    <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-navy-900 dark:text-horchata-100" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-8 mb-3 text-xl font-bold text-navy-900 dark:text-horchata-100" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 mb-2 text-lg font-semibold text-navy-800 dark:text-horchata-200" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-4 mb-2 text-base font-semibold text-navy-700 dark:text-horchata-300" {...props}>
      {children}
    </h4>
  ),
};
