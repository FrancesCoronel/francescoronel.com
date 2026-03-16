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
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.scdn.co" },
      { protocol: "https", hostname: "www.themebeta.com" },
      { protocol: "https", hostname: "tf-assets-prod.s3.amazonaws.com" },
      { protocol: "https", hostname: "s3-us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "knightfoundation.imgix.net" },
      { protocol: "https", hostname: "ph-files.imgix.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "www.apprenticeships.me" },
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

      // ── Webflow-only categories (not in new site) ─────────
      // These were Webflow CMS category slugs that don't map to any new category.
      // Google has indexed them — redirect to /blog to preserve link equity.
      {
        source: "/categories/cultura",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/categories/code-career",
        destination: "/blog",
        permanent: true,
      },

      // ── WordPress upload/admin paths ──────────────────────
      // Old WordPress file paths — redirect to home so they don't 404 and bleed crawl budget
      {
        source: "/wp-content/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-includes/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-admin/:path*",
        destination: "/",
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
      // ── Portfolio → Projects ─────────────────────────────
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/blog/hire-me", destination: "/projects/hire-me", permanent: true },
      {
        source: "/blog/salesforce-day-1-web-campaign",
        destination: "/projects/salesforce-day-1-web-campaign",
        permanent: true,
      },

      // ── Projects moved from /experience to /projects ─────
      { source: "/experience/latina-dev", destination: "/projects/latina-dev", permanent: true },
      { source: "/experience/apprenticeships-me", destination: "/projects/apprenticeships-me", permanent: true },
      { source: "/experience/tech-queens", destination: "/projects/tech-queens", permanent: true },
      { source: "/experience/jake-the-dog-key-hand", destination: "/projects/jake-the-dog-key-hand", permanent: true },
      { source: "/experience/meggs-design-hackathon-2016", destination: "/projects/meggs-design-hackathon-2016", permanent: true },
      { source: "/experience/ammalia-treehacks-2016", destination: "/projects/ammalia-treehacks-2016", permanent: true },
      { source: "/experience/salesforce-day-1-web-campaign", destination: "/projects/salesforce-day-1-web-campaign", permanent: true },

      // ── Experience/Education blog posts → detail pages ────
      {
        source: "/blog/slack-swe",
        destination: "/experience/slack-customer-acquisition",
        permanent: true,
      },
      {
        source: "/blog/accenture-liquid-studio-summer-2016",
        destination: "/experience/accenture-intern",
        permanent: true,
      },
      {
        source: "/blog/8020-software-consulting",
        destination: "/experience/8020-software-consulting",
        permanent: true,
      },
      {
        source: "/blog/cornell-tech",
        destination: "/education/cornell-tech",
        permanent: true,
      },
      {
        source: "/blog/hampton-university",
        destination: "/education/hampton-university",
        permanent: true,
      },
      {
        source: "/blog/jacobs-university-bremen-fall-2013",
        destination: "/education/jacobs-university-bremen",
        permanent: true,
      },
      {
        source: "/blog/hampton-university-summer-2011",
        destination: "/education/hampton-university-summer-2011",
        permanent: true,
      },
      {
        source: "/blog/hampton-university-summer-2014",
        destination: "/education/hampton-university-summer-2014",
        permanent: true,
      },
      {
        source: "/blog/old-dominion-university-summer-2014",
        destination: "/education/old-dominion-university-summer-2014",
        permanent: true,
      },
      {
        source: "/blog/tidewater-community-college-summer-2010",
        destination: "/education/tidewater-community-college-summer-2010",
        permanent: true,
      },
      {
        source: "/blog/tidewater-community-college-summer-2013",
        destination: "/education/tidewater-community-college-summer-2013",
        permanent: true,
      },

      // ── Mentee posts consolidated to /mentoring ───────────
      ...[
        "abel-regaldo", "adil-minocherhomjee", "adilene-constante", "amber-sharma",
        "brenda-sukh", "brian-martinez", "carly-gordon", "cherri-hartigan",
        "enrique-novoa", "eunji-song", "jasmine-anderson", "kanad-bahalkar",
        "kelaiya-parikah", "lavie-ruan", "linda-xiong", "lupita-davila",
        "mariela-p-smith", "matthew-ma", "maximilian-hofer", "melhjingoy-david",
        "mike-jonas", "neil-scheuermann", "oscar-parra", "pak-chu",
        "paul-do", "pauly-quintero", "ronnie-brown", "roya-lofti",
        "simran-anand", "simran-kaur-anand", "steven-shen",
        "theerut-foongkiatcharoen", "undisclosed-female", "undisclosed-male",
        "valeria-oshiro", "wen-tran",
      ].map((slug) => ({
        source: `/blog/${slug}`,
        destination: "/mentoring",
        permanent: true,
      })),

      // ── Dedup redirects: old slugs → canonical slugs ──────
      ...dedupRedirects,
    ];
  },
};

export default nextConfig;
