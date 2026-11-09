"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { classifyLink, trackEvent } from "@/lib/analytics";

// A post counts as read once the reader is this far down the page
const READ_PERCENT = 90;
const POST_PATH = /^\/posts\/[^/]+$/;

/**
 * Site-wide interaction tracking that doesn't belong to one component:
 * outbound links, email/phone links and file downloads anywhere on the page
 * (including links inside MDX posts), and whether a blog post was read to the
 * end. Pageviews and Core Web Vitals come from Vercel Analytics and Speed
 * Insights themselves.
 */
export function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href")!;
      const event = classifyLink(href, window.location.origin, {
        download: link.hasAttribute("download"),
      });
      if (!event) return;
      trackEvent(event.name, {
        ...event.props,
        link_text: link.textContent!.trim().slice(0, 100) || undefined,
        page: window.location.pathname,
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (!POST_PATH.test(pathname)) return;
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if ((window.scrollY / scrollable) * 100 < READ_PERCENT) return;
      trackEvent("post_read", { page: pathname });
      window.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
