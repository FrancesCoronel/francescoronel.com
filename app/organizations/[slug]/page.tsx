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
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";
import { formatDateRange } from "@/lib/utils";
import { BlogCard } from "@/components/ui/blog-card";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { ExpandableGrid } from "@/components/ui/expandable-grid";
import { siteConfig } from "@/lib/metadata";
import {
  BreadcrumbJsonLd,
} from "@/components/layout/json-ld";

const DARK_SECTION = "border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950";
const LIGHT_SECTION = "bg-white py-16 md:py-20 dark:bg-navy-900";

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
    `Everything related to ${org.name}: blog posts, experience, testimonials, and more.`;
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

  const { org, posts, experiences, testimonials, awards, education, projects } = result;
  const { categoryImages } = getCategoryMaps();

  const allOrgs = getOrganizations();
  const currentIndex = allOrgs.findIndex((o) => o.slug === slug);
  const prevOrg = currentIndex > 0 ? allOrgs[currentIndex - 1] : null;
  const nextOrg = currentIndex < allOrgs.length - 1 ? allOrgs[currentIndex + 1] : null;

  // Build ordered list of sections that have content, for alternating bg assignment
  const sectionOrder = [
    { id: "experience", show: experiences.length > 0 },
    { id: "education", show: education.length > 0 },
    { id: "projects", show: projects.length > 0 },
    { id: "posts", show: posts.length > 0 },
    { id: "testimonials", show: testimonials.length > 0 },
    { id: "awards", show: awards.length > 0 },
  ].filter((s) => s.show);

  const sectionBg: Record<string, string> = {};
  sectionOrder.forEach(({ id }, i) => {
    sectionBg[id] = i % 2 === 0 ? DARK_SECTION : LIGHT_SECTION;
  });

  const hasContent = sectionOrder.length > 0;

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

      {/* Header — always light */}
      <section className="bg-horchata-50 py-16 md:py-20 dark:bg-navy-900">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex items-start gap-4 sm:gap-6">
            {org.logo ? (
              <Image
                src={org.logo}
                alt={org.name}
                width={96}
                height={96}
                className="h-20 w-20 flex-shrink-0 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-horchata-100 text-3xl font-bold text-horchata-700 dark:bg-navy-700 dark:text-horchata-400">
                {org.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
                Organization
              </p>
              <h1 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl md:text-4xl">
                {org.name}
              </h1>
              {org.description && (
                <p className="mt-2 text-base text-navy-600 dark:text-white/70 sm:text-lg">
                  {org.description}
                </p>
              )}
              {org.url && (
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
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
        </div>
      </section>

      {/* Experience */}
      {experiences.length > 0 && (
        <section className={sectionBg["experience"]}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Work
            </p>
            <h2 className="mt-1 mb-6 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
              Experience 💼
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
                  <h3 className="mt-1 text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-400">
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
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className={sectionBg["education"]}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Academic
            </p>
            <h2 className="mt-1 mb-6 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
              Education 🎓
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
                  <h3 className="mt-1 text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-400">
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
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={sectionBg["projects"]}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Built
            </p>
            <h2 className="mt-1 mb-6 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
              Projects 🛠️
            </h2>
            <ExpandableGrid initialCount={6} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/posts/${project.slug}`}
                  className="group relative flex flex-col items-start rounded-2xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800/50"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-horchata-100 text-xl dark:bg-navy-700">
                    {project.emoji ?? "🛠️"}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-navy-800 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-400">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy-600 dark:text-white/60">
                    {project.tagline}
                  </p>
                </Link>
              ))}
            </ExpandableGrid>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      {posts.length > 0 && (
        <section className={sectionBg["posts"]}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Writing
            </p>
            <h2 className="mt-1 mb-6 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
              Blog Posts ✍🏽
            </h2>
            <ExpandableGrid initialCount={6} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} categoryImages={categoryImages} basePath="/posts" />
              ))}
            </ExpandableGrid>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className={sectionBg["testimonials"]}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Praise
            </p>
            <h2 className="mt-1 mb-6 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
              Testimonials 💬
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <TestimonialCard key={t.slug} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section className={sectionBg["awards"]}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Recognition
            </p>
            <h2 className="mt-1 mb-6 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
              Awards 🏆
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {awards.map((award) => (
                <Link
                  key={award.slug}
                  href={`/awards/${award.slug}`}
                  className="group rounded-xl border border-horchata-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800"
                >
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                    {award.title}
                  </h3>
                  <p className="mt-1 text-sm text-navy-500 dark:text-horchata-400">
                    {award.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[var(--container-max)] px-6 py-10">
        <PrevNextNav
          prev={prevOrg ? { slug: prevOrg.slug, title: prevOrg.name } : null}
          next={nextOrg ? { slug: nextOrg.slug, title: nextOrg.name } : null}
          basePath="/organizations"
        />
      </div>

      <NewsletterCTA />

      <ConnectCTA variant="hire" />
    </>
  );
}
