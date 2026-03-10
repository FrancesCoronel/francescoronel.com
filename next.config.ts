import type { NextConfig } from "next";
import dedupRedirects from "./scripts/dedup-redirects.json";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      // Cloudinary (future image hosting)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Webflow CDN (current image hosting)
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "uploads-ssl.webflow.com" },
      // WordPress
      { protocol: "https", hostname: "fvcproductions39789812.wordpress.com" },
      { protocol: "https", hostname: "fvcproductions.files.wordpress.com" },
      // Common external image hosts found in blog content
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "i.stack.imgur.com" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "image.slidesharecdn.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "media.githubusercontent.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.scdn.co" },
      { protocol: "https", hostname: "www.themebeta.com" },
      { protocol: "https", hostname: "tf-assets-prod.s3.amazonaws.com" },
      { protocol: "https", hostname: "knightfoundation.imgix.net" },
      { protocol: "https", hostname: "static1.squarespace.com" },
    ],
  },
  async redirects() {
    return [
      // ── Webflow CMS template URL patterns ─────────────────
      {
        source: "/detail_blog/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/detail_testimonials/:slug",
        destination: "/testimonials",
        permanent: true,
      },
      {
        source: "/detail_organizations/:slug",
        destination: "/organizations",
        permanent: true,
      },
      {
        source: "/detail_awards/:slug",
        destination: "/awards/:slug",
        permanent: true,
      },
      {
        source: "/detail_work-experiences/:slug",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/detail_educational-institutions/:slug",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/detail_categories/:slug",
        destination: "/categories/:slug",
        permanent: true,
      },
      {
        source: "/detail_tags/:slug",
        destination: "/tags/:slug",
        permanent: true,
      },

      // ── Hugo v2/v3 date-based permalink patterns ──────────
      // fvcproductions.com used /:year/:month/:day/:title/
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/",
        destination: "/blog/:slug",
        permanent: true,
      },
      // Two-segment date patterns (WordPress-style /YYYY/MM/slug)
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },

      // ── Hugo content directory patterns ───────────────────
      // Hugo v3 used content/posts/, Hugo v2 used content/adventures/
      {
        source: "/posts/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/posts/:slug/",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/adventures/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/adventures/:slug/",
        destination: "/blog/:slug",
        permanent: true,
      },

      // ── Trailing slash normalization ──────────────────────
      {
        source: "/blog/:slug/",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/categories/:slug/",
        destination: "/categories/:slug",
        permanent: true,
      },
      {
        source: "/tags/:slug/",
        destination: "/tags/:slug",
        permanent: true,
      },

      // ── RSS / Feed redirects ─────────────────────────────
      {
        source: "/feed.xml",
        destination: "/feed",
        permanent: true,
      },
      {
        source: "/rss",
        destination: "/feed",
        permanent: true,
      },
      {
        source: "/rss.xml",
        destination: "/feed",
        permanent: true,
      },
      {
        source: "/index.xml",
        destination: "/feed",
        permanent: true,
      },

      // ── Old page paths ───────────────────────────────────
      {
        source: "/work",
        destination: "/experience/senior-software-engineer-messaging",
        permanent: true,
      },
      {
        source: "/hire-me",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/resume",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/colophon",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/mentoring",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/blog",
        permanent: true,
      },

      // ── Dedup redirects: old slugs → canonical slugs ──────
      ...dedupRedirects,
    ];
  },
};

export default nextConfig;
