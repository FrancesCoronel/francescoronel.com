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

  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: post.postType === "project" ? 0.7 : 0.6,
  }));

  const categories = getCategories().map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tags = getTags().map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const experiences = getExperiences().map((exp) => ({
    url: `${baseUrl}/experience/${exp.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const education = getEducation().map((edu) => ({
    url: `${baseUrl}/education/${edu.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const awards = getAwards().map((award) => ({
    url: `${baseUrl}/awards/${award.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const organizations = getOrganizations().map((org) => ({
    url: `${baseUrl}/organizations/${org.slug}`,
    lastModified: new Date(),
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
