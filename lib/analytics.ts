import { track } from "@vercel/analytics";

export type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params: Record<string, unknown>) => void;
  }
}

/**
 * Sends one custom event to Vercel Analytics and Google Analytics 4.
 *
 * Pass `{ vercel: false }` for high-volume events (scroll depth, web vitals)
 * that only GA4 should get: Vercel counts custom events against the plan's
 * quota, and Speed Insights already covers vitals there.
 *
 * Never throws: analytics must not break the page, and either backend may be
 * missing (no GA4 id, not on Vercel, an ad blocker).
 */
export function trackEvent(
  name: string,
  props: EventProps = {},
  { vercel = true }: { vercel?: boolean } = {},
) {
  const clean: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) clean[key] = value;
  }

  if (vercel) {
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
  sendToGA(name, clean);
}

// gtag is defined by an afterInteractive script, so events logged on mount
// (a 404, the first web vitals) can arrive before it. Hold them and send them
// once it exists; give up after GA_WAIT_MS (no GA4 id, or gtag blocked).
const GA_POLL_MS = 250;
const GA_WAIT_MS = 10_000;
const pendingGA: [string, Record<string, unknown>][] = [];
let gaTimer: ReturnType<typeof setInterval> | undefined;

function gtagEvent(name: string, params: Record<string, unknown>) {
  try {
    window.gtag!("event", name, params);
  } catch {
    // gtag blocked or failed
  }
}

function sendToGA(name: string, params: Record<string, unknown>) {
  if (window.gtag) {
    gtagEvent(name, params);
    return;
  }
  pendingGA.push([name, params]);
  if (gaTimer) return;
  const started = Date.now();
  gaTimer = setInterval(() => {
    const ready = Boolean(window.gtag);
    if (ready) for (const [n, p] of pendingGA) gtagEvent(n, p);
    if (ready || Date.now() - started >= GA_WAIT_MS) {
      clearInterval(gaTimer);
      gaTimer = undefined;
      pendingGA.length = 0;
    }
  }, GA_POLL_MS);
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
