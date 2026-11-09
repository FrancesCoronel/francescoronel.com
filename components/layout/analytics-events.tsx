"use client";

import { useEffect } from "react";
import { classifyLink, trackEvent } from "@/lib/analytics";

/**
 * Site-wide interaction tracking that doesn't belong to one component:
 * outbound links, email/phone links and file downloads anywhere on the page
 * (including links inside MDX posts). Pageviews and Core Web Vitals come from
 * Vercel Analytics and Speed Insights themselves.
 */
export function AnalyticsEvents() {
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

  return null;
}
