import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, getTags, getExperiences, getEducation, getAwards, getOrganizations } from "@/lib/content";
import { siteConfig } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;

  const staticPages = [
    "", "/about", "/blog", "/contact", "/speaking",
    "/mentoring", "/portfolio", "/testimonials", "/organizations",
    "/for-llms", "/projects", "/uses", "/now",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const allPosts = getAllPosts();

  // Google only trusts lastmod when it reflects real changes, so derive it from content
  // dates instead of the build time. Pages with no meaningful date omit it.
  const latestDate = (postList: typeof allPosts) =>
    postList.reduce<Date | undefined>((latest, p) => {
      const d = new Date(p.updated ?? p.date);
      return !latest || d > latest ? d : latest;
    }, undefined);

  const posts = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly" as const,
    priority: post.postType === "project" ? 0.7 : 0.6,
  }));

  const categories = getCategories().map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: latestDate(allPosts.filter((p) => p.categories.includes(cat.slug))),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tags = getTags().map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: latestDate(allPosts.filter((p) => p.tags.includes(tag.slug))),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const experiences = getExperiences().map((exp) => ({
    url: `${baseUrl}/experience/${exp.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const education = getEducation().map((edu) => ({
    url: `${baseUrl}/education/${edu.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const awards = getAwards().map((award) => ({
    url: `${baseUrl}/awards/${award.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const organizations = getOrganizations().map((org) => ({
    url: `${baseUrl}/organizations/${org.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...posts,
    ...categories,
    ...tags,
    ...experiences,
    ...education,
    ...awards,
    ...organizations,
  ];
}
