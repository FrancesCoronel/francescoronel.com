import type { Metadata } from "next";

export const siteConfig = {
  title: "Frances Coronel",
  description:
    "Senior Software Engineer at Slack with 8+ years in frontend engineering and an MS in Computer Science from Cornell Tech. Speaker at 100+ events and mentor focused on helping underrepresented engineers grow into technical leadership.",
  siteUrl: "https://francescoronel.com",
  author: "Frances Coronel",
  social: {
    twitter: "@faborel",
    github: "FrancesCoronel",
    linkedin: "francescoronel",
  },
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "",
};

const defaultOgImage = {
  url: `${siteConfig.siteUrl}/images/og/home.png`,
  width: 1200,
  height: 630,
  alt: "Frances Coronel",
};

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  publishedTime?: string;
  robots?: Metadata["robots"];
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = "website",
  publishedTime,
  robots,
}: BuildMetadataOptions = {}): Metadata {
  const url = path ? `${siteConfig.siteUrl}${path}` : siteConfig.siteUrl;
  const metaTitle = title || siteConfig.title;
  const metaDescription = description || siteConfig.description;
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: metaTitle }]
    : [defaultOgImage];

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: title
      ? title
      : { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
    description: metaDescription,
    alternates: path ? { canonical: url } : undefined,
    openGraph: {
      type: ogType,
      locale: "en_US",
      url,
      siteName: siteConfig.title,
      title: metaTitle,
      description: metaDescription,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      creator: siteConfig.social.twitter,
      title: metaTitle,
      description: metaDescription,
      images,
    },
    robots: robots ?? { index: true, follow: true },
  };
}
