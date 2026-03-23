import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import localFont from "next/font/local";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { AnalyticsProviders } from "@/components/layout/analytics";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/layout/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { BackToTop } from "@/components/ui/back-to-top";
import "./globals.css";

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "swap",
});

const latina = localFont({
  src: [
    { path: "../public/fonts/latina-essential-medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/latina-essential-medium-italic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/latina-essential-bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/latina-essential-bold-italic.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/latina-essential-heavy.woff2", weight: "900", style: "normal" },
    { path: "../public/fonts/latina-essential-heavy-italic.woff2", weight: "900", style: "italic" },
  ],
  variable: "--font-latina",
  display: "swap",
});

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
  other: {
    "llms.txt": "https://francescoronel.com/llms.txt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cabin.variable} ${latina.variable}`} suppressHydrationWarning>
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
