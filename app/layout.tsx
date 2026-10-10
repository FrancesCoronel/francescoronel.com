import type { Metadata } from "next";
import { preload } from "react-dom";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { AnalyticsProviders } from "@/components/layout/analytics";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/layout/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { BackToTop } from "@/components/ui/back-to-top";
import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata(),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed",
    },
  },
  verification: {
    // Get this from Google Search Console → Settings → Ownership verification → HTML tag
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "llms.txt": "https://francescoronel.com/llms.txt",
    // Add your Bing Webmaster Tools verification key here once obtained from https://www.bing.com/webmasters
    // "msvalidate.01": "YOUR_BING_KEY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preload only the faces used above the fold: medium (body text) and bold (headings)
  preload("/fonts/latina-essential-medium.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/latina-essential-bold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* IndieWeb rel="me" for IndieLogin identity verification */}
        <link rel="me" href="https://github.com/FrancesCoronel" />
        <link rel="me" href="https://bsky.app/profile/francescoronel.bsky.social" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <PersonJsonLd />
          <WebSiteJsonLd />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-horchata-900 focus:px-4 focus:py-2 focus:text-white">
            Skip to main content
          </a>
          <Nav />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <AnalyticsProviders />
        </ThemeProvider>
      </body>
    </html>
  );
}
