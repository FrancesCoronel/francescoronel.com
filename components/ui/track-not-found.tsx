"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Logs a 404 with the missing path and where the visitor came from, so broken
 * links (like search results pointing at pages that don't exist) show up in
 * analytics instead of going unnoticed.
 */
export function TrackNotFound() {
  useEffect(() => {
    trackEvent("page_not_found", {
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
    });
  }, []);
  return null;
}
