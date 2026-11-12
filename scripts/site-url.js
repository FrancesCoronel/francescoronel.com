/**
 * Shared helpers for scripts that send post content off-site (dev.to,
 * Resend). Posts can reference their images by site path
 * ("/images/speaking/a.jpeg"), which other platforms can't load, so these
 * turn site paths into full URLs.
 */

const SITE_URL = "https://www.francescoronel.com";

// "/images/a.jpeg" -> "https://www.francescoronel.com/images/a.jpeg".
// Full URLs and protocol-relative "//host/..." URLs are returned unchanged.
function absoluteUrl(value) {
  if (typeof value !== "string" || !value) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return SITE_URL + value;
  return value;
}

// Make root-relative Markdown links/images and HTML src/href attributes absolute
function absolutizeMarkdown(markdown) {
  return markdown
    .replace(/(\]\()(\/(?!\/)[^)\s]*)/g, (_, open, p) => open + SITE_URL + p)
    .replace(/(\b(?:src|href)=["'])(\/(?!\/)[^"']*)/g, (_, open, p) => open + SITE_URL + p);
}

module.exports = { SITE_URL, absoluteUrl, absolutizeMarkdown };
