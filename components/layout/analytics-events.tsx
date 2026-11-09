"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { classifyLink, trackEvent } from "@/lib/analytics";

const SCROLL_MARKS = [25, 50, 75, 100];

/**
 * Site-wide interaction tracking that doesn't belong to one component:
 * outbound links, email/phone links and file downloads anywhere on the page
 * (including links inside MDX posts), scroll depth per page, and Core Web
 * Vitals for GA4. Pageviews come from Vercel Analytics and gtag themselves.
 */
export function AnalyticsEvents() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    trackEvent(
      "web_vitals",
      {
        metric_name: metric.name,
        // CLS is a unitless fraction; scale it so GA4 can sum integers
        metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        metric_rating: metric.rating,
        metric_id: metric.id,
      },
      { vercel: false },
    );
  });

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
    const reached = new Set<number>();
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = (window.scrollY / scrollable) * 100;
      for (const mark of SCROLL_MARKS) {
        if (percent >= mark - 1 && !reached.has(mark)) {
          reached.add(mark);
          trackEvent("scroll_depth", { percent: mark, page: pathname }, { vercel: false });
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
