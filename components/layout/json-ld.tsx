import { siteConfig } from "@/lib/metadata";

export function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    givenName: "Frances",
    familyName: "Coronel",
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/images/avatar-placeholder.svg`,
    jobTitle: "Senior Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Slack",
      url: "https://slack.com",
      parentOrganization: {
        "@type": "Organization",
        name: "Salesforce",
        url: "https://salesforce.com",
      },
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Cornell Tech",
        url: "https://tech.cornell.edu",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Hampton University",
        url: "https://www.hamptonu.edu",
      },
    ],
    knowsAbout: [
      "Software Engineering",
      "TypeScript",
      "React",
      "JavaScript",
      "Web Development",
      "Public Speaking",
      "Mentoring",
    ],
    nationality: {
      "@type": "Country",
      name: "Peru",
    },
    sameAs: [
      `https://github.com/${siteConfig.social.github}`,
      `https://linkedin.com/in/${siteConfig.social.linkedin}`,
      `https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`,
      "https://youtube.com/@fvcproductions",
      "https://instagram.com/fvcproductions",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BlogPostJsonLd({
  title,
  description,
  date,
  slug,
  image,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
  image?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    url: `${siteConfig.siteUrl}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/blog/${slug}`,
    },
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    url: siteConfig.siteUrl,
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    description: siteConfig.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
