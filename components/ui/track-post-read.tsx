"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

// A post counts as read once the reader is this far down the page
const READ_PERCENT = 90;

/**
 * Logs `post_read` once when a reader gets 90% of the way through a blog
 * post. Rendered only by the article layout in app/posts/[slug], so project
 * pages, which share the /posts/<slug> route, don't count as reads.
 */
export function TrackPostRead({ page }: { page: string }) {
  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if ((window.scrollY / scrollable) * 100 < READ_PERCENT) return;
      trackEvent("post_read", { page });
      window.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  return null;
}
