/**
 * Turns a Pagefind result URL into the site route it was indexed from.
 *
 * Locally the index is built from .next/server/app, so URLs look like
 * `/posts/foo.html` or `/about/index.html`. On Vercel the build adapter writes
 * prerendered pages as `/posts/foo.prerender-fallback.html`, so that suffix has
 * to go too or every result links to a 404.
 */
export function pagefindUrlToRoute(url: string): string {
  return url
    .replace(/(\.prerender-fallback)?\.html$/, "")
    .replace(/(^|\/)index$/, "")
    .replace(/^\/?/, "/");
}
