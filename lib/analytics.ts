import { track } from "@vercel/analytics";

export type EventProps = Record<string, string | number | boolean | null | undefined>;

/**
 * Sends one custom event to Vercel Analytics.
 *
 * Never throws: analytics must not break the page, and the script may be
 * missing (not on Vercel, an ad blocker).
 */
export function trackEvent(name: string, props: EventProps = {}) {
  const clean: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) clean[key] = value;
  }

  // The same queue @vercel/analytics sets up when its component mounts.
  // Creating it here keeps events fired before then (a 404 logged on load)
  // until the script arrives, instead of dropping them.
  window.va ??= (event, properties) => {
    (window.vaq ??= []).push([event, properties]);
  };
  try {
    track(name, clean);
  } catch {
    // Vercel Analytics not loaded
  }
}

const DOWNLOAD_EXT = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|key|dmg|epub)$/i;

/**
 * Works out what a click on a link means for analytics, or null if it's an
 * ordinary internal navigation (pageviews already cover those).
 */
export function classifyLink(
  href: string,
  origin: string,
  { download = false }: { download?: boolean } = {},
): { name: string; props: EventProps } | null {
  if (href.startsWith("mailto:")) {
    return { name: "contact_click", props: { method: "email" } };
  }
  if (href.startsWith("tel:")) {
    return { name: "contact_click", props: { method: "phone" } };
  }

  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  if (download || DOWNLOAD_EXT.test(url.pathname)) {
    const file = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
    return { name: "file_download", props: { file_name: file, url: url.href } };
  }
  if (url.origin !== origin) {
    return { name: "outbound_click", props: { domain: url.hostname, url: url.href } };
  }
  return null;
}
