import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import {
  getOrganizations,
  getContentByOrganization,
  getCategoryMaps,
} from "@/lib/content";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDate, formatDateRange } from "@/lib/utils";
import { BlogCard } from "@/components/ui/blog-card";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { ExpandableGrid } from "@/components/ui/expandable-grid";
import { siteConfig } from "@/lib/metadata";
import {
  BreadcrumbJsonLd,
} from "@/components/layout/json-ld";

export function generateStaticParams() {
  return getOrganizations().map((org) => ({ slug: org.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getContentByOrganization(slug);
  if (!result) return { title: "Organization Not Found" };

  const { org } = result;
  const description = org.description ||
    `Everything related to ${org.name} — blog posts, experience, testimonials, and more.`;
  return buildMetadata({
    title: org.name,
    description,
    path: `/organizations/${slug}`,
    ogImage: org.logo || undefined,
  });
}

export default async function OrganizationDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const result = getContentByOrganization(slug);
  if (!result) notFound();

  const { org, posts, experiences, testimonials, awards, education } = result;
  const { categoryImages } = getCategoryMaps();
  const hasContent =
    posts.length > 0 ||
    experiences.length > 0 ||
    testimonials.length > 0 ||
    awards.length > 0 ||
    education.length > 0;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.siteUrl },
          { name: "Organizations", url: `${siteConfig.siteUrl}/organizations` },
          {
            name: org.name,
            url: `${siteConfig.siteUrl}/organizations/${org.slug}`,
          },
        ]}
      />

      <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
        {/* Header */}
        <div className="flex items-start gap-6">
          {org.logo ? (
            <Image
              src={resolveImageUrl(org.logo)}
              alt={org.name}
              width={96}
              height={96}
              className="h-20 w-20 flex-shrink-0 rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-horchata-100 text-3xl font-bold text-horchata-600 dark:bg-navy-700 dark:text-horchata-400">
              {org.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-horchata-100 md:text-4xl">
              {org.name}
            </h1>
            {org.description && (
              <p className="mt-2 text-lg text-navy-600 dark:text-white/70">
                {org.description}
              </p>
            )}
            {org.url && (
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
              >
                Visit website
                <svg className="ml-1 inline h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </a>
            )}
          </div>
        </div>

        {!hasContent && (
          <p className="mt-12 text-navy-500 dark:text-horchata-400">
            No associated content found yet for {org.name}.
          </p>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Experience 💼 ({experiences.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {experiences.map((exp) => (
                <Link
                  key={exp.slug}
                  href={`/experience/${exp.slug}`}
                  className="group rounded-xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800"
                >
                  <p className="text-xs font-medium text-navy-500 dark:text-horchata-400">
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100 dark:group-hover:text-horchata-400">
                    {exp.title}
                  </h3>
                  {exp.location && (
                    <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">
                      {exp.location}
                    </p>
                  )}
                  {exp.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-navy-600 dark:text-white/70">
                      {exp.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Education 🎓 ({education.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {education.map((edu) => (
                <Link
                  key={edu.slug}
                  href={`/education/${edu.slug}`}
                  className="group rounded-xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800"
                >
                  <p className="text-xs font-medium text-navy-500 dark:text-horchata-400">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100 dark:group-hover:text-horchata-400">
                    {edu.degree}
                  </h3>
                  {edu.field && (
                    <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">
                      {edu.field}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {posts.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Blog Posts ✍🏽 ({posts.length})
            </h2>
            <ExpandableGrid initialCount={6} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} categoryImages={categoryImages} />
              ))}
            </ExpandableGrid>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Testimonials 💬 ({testimonials.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <TestimonialCard key={t.slug} testimonial={t} />
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Awards 🏆 ({awards.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {awards.map((award) => (
                <Link
                  key={award.slug}
                  href={`/awards/${award.slug}`}
                  className="group rounded-xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800"
                >
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100">
                    {award.title}
                  </h3>
                  <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">
                    {award.date}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/organizations"
            className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            &larr; All organizations
          </Link>
        </div>
      </div>
    </>
  );
}
