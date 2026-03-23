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
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline for hydration scripts; unsafe-eval for dev HMR
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      // Images come from many external CDNs across 665 blog posts
      "img-src 'self' data: https:",
      "font-src 'self'",
      // API calls: Vercel Analytics/Speed Insights, GA4, Buttondown newsletter
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://region1.google-analytics.com https://api.buttondown.email",
      // Cal.com booking embed
      "frame-src https://cal.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
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
      { protocol: "https", hostname: "i.stack.imgur.com" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
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
      { protocol: "https", hostname: "www.engjobsearch.com" },
      { protocol: "https", hostname: "ktebrbhzg9wasky1.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      // ── Unified /posts namespace ───────────────────────────
      // More specific blog post exceptions must come BEFORE the wildcard catch-all
      { source: "/blog/chris-lanus", destination: "/testimonials/chris-lanus", permanent: true },
      { source: "/blog/gabriel-rowe", destination: "/testimonials/gabriel-rowe", permanent: true },
      { source: "/blog/franklin-lee", destination: "/testimonials/franklin-lee", permanent: true },
      { source: "/blog/angel-riera", destination: "/testimonials/angel-riera", permanent: true },
      { source: "/blog/:slug", destination: "/posts/:slug", permanent: true },
      { source: "/projects/:slug", destination: "/posts/:slug", permanent: true },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/portfolio", destination: "/work", permanent: true },

      // ── Deduped project slug redirects ────────────────────
      { source: "/posts/byteboard-candidate-actions", destination: "/posts/client-platform-candidate-actions", permanent: true },
      { source: "/posts/byteboard-interview-hub", destination: "/posts/pre-interview-comms-interview-hub-revamp", permanent: true },
      { source: "/posts/byteboard-skills-report-redesign", destination: "/posts/skills-report-redesign", permanent: true },
      { source: "/posts/byteboard-zero-state-dashboard", destination: "/posts/zero-state-dashboard", permanent: true },
      { source: "/posts/fullstack-academy", destination: "/posts/fullstack-academy-3", permanent: true },
      { source: "/posts/pacific-shores-shuttle", destination: "/posts/pacific-shores-shuttle-app", permanent: true },

      // ── /blog and /newsletter → /posts ────────────────────
      { source: "/blog", destination: "/posts", permanent: true },
      { source: "/newsletter", destination: "/posts", permanent: true },

      // ── Index routes that redirect to about page sections ─────
      { source: "/experience", destination: "/about#experience", permanent: true },
      { source: "/education", destination: "/about#education", permanent: true },
      { source: "/awards", destination: "/about#awards", permanent: true },
      { source: "/awards/:slug", destination: "/about#awards", permanent: true },
      // ── Webflow CMS template URL patterns ─────────────────
      {
        source: "/detail_blog/:slug",
        destination: "/posts/:slug",
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
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/",
        destination: "/posts/:slug",
        permanent: true,
      },
      // Two-segment date patterns (WordPress-style /YYYY/MM/slug)
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },

      // ── Hugo content directory patterns ───────────────────
      // Hugo v2 used content/adventures/; Hugo v3 used /posts/ (now canonical, no redirect needed)
      {
        source: "/adventures/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/adventures/:slug/",
        destination: "/posts/:slug",
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

      // ── Duplicate WordPress posts → Webflow canonical slugs ──
      { source: "/blog/im-obsessed-with-labs", destination: "/blog/im-obsessed-with-labs-f3e5b", permanent: true },
      { source: "/blog/mindot-tour", destination: "/blog/mindot-tour-2", permanent: true },
      { source: "/blog/new-epoch-new-exploits-%f0%9f%98%88", destination: "/blog/new-epoch-new-exploits-f0-9f-98-88", permanent: true },
      { source: "/blog/smash-academy-at-stanford-%f0%9f%8e%93", destination: "/blog/smash-academy-at-stanford-f0-9f-8e-93", permanent: true },

      // ── Blog posts migrated to projects ──────────────────
      { source: "/blog/fullstack-academy-3", destination: "/projects/fullstack-academy", permanent: true },
      // Slack work projects
      { source: "/blog/contact-sales-form", destination: "/projects/contact-sales-form", permanent: true },
      { source: "/blog/slack-interactive-demo-homepage", destination: "/projects/slack-interactive-demo-homepage", permanent: true },
      { source: "/blog/slack-native-app-homepage", destination: "/projects/slack-native-app-homepage", permanent: true },
      { source: "/blog/slack-immersive-homepage", destination: "/projects/slack-immersive-homepage", permanent: true },
      { source: "/blog/slack-simplified-homepage", destination: "/projects/slack-simplified-homepage", permanent: true },
      { source: "/blog/university-recruiting-page", destination: "/projects/university-recruiting-page", permanent: true },
      { source: "/blog/new-enterprise-page", destination: "/projects/slack-enterprise-page", permanent: true },
      { source: "/blog/refreshed-downloads-experience-on-slack-com", destination: "/projects/slack-downloads-page", permanent: true },
      { source: "/blog/slack-partner-referral-form", destination: "/projects/slack-partner-referral-form", permanent: true },
      { source: "/blog/consent-updates-on-slack-com-forms", destination: "/projects/slack-com-consent-updates", permanent: true },
      { source: "/blog/slack-com-webinar-form-registration", destination: "/projects/slack-com-webinar-form", permanent: true },
      { source: "/blog/lists-feature-launch-files-column", destination: "/projects/slack-lists-files-column", permanent: true },
      // Byteboard work projects
      { source: "/blog/skills-report-redesign", destination: "/projects/byteboard-skills-report-redesign", permanent: true },
      { source: "/blog/client-platform-candidate-actions", destination: "/projects/byteboard-candidate-actions", permanent: true },
      { source: "/blog/pre-interview-comms-interview-hub-revamp", destination: "/projects/byteboard-interview-hub", permanent: true },
      { source: "/blog/zero-state-dashboard", destination: "/projects/byteboard-zero-state-dashboard", permanent: true },
      // Techqueria projects
      { source: "/blog/techquerias-job-board", destination: "/projects/techqueria-job-board", permanent: true },

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
