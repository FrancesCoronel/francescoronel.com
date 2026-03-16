import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { CredentialsMarquee } from "@/components/sections/credentials-marquee";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { BlogCard } from "@/components/ui/blog-card";
import { Timeline } from "@/components/ui/timeline";
import {
  getAllBlogPosts,
  getExperiences,
  getEducation,
  getCategoryMaps,
  getOrganizationByName,
  getProjects,
} from "@/lib/content";
import { formatDateRange } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import mentoringData from "@/content/mentoring-sessions.json";

export const metadata: Metadata = buildMetadata({
  path: "/",
  ogType: "profile",
  ogImage: "/images/og/home.png",
});

export default function HomePage() {
  const recentPosts = getAllBlogPosts().slice(0, 4);
  const activeProjects = getProjects().filter((p) => p.status === "active").slice(0, 4);
  const allPosts = getAllBlogPosts();
  const mentoringSessionCount = (mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions;
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;
  const experiences = getExperiences().filter((exp) => {
    const t = exp.title.toLowerCase();
    if (t.includes("mentor")) return false;
    if (t.includes("managing partner")) return false;
    if (t.includes("ambassador")) return false;
    if (t.includes("instructor")) return false;
    if (t.includes("curriculum")) return false;
    return true;
  }).slice(0, 3);
  const education = getEducation().filter(
    (edu) =>
      edu.degree.includes("Bachelor") || edu.degree.includes("Master")
  );
  const { categoryImages } = getCategoryMaps();

  return (
    <>
      {/* Hero + Marquee fill the viewport so the marquee sits at the bottom of the first screen */}
      <div className="flex min-h-[calc(100svh-57px)] flex-col">
        <Hero />
        <div className="mt-auto">
          <CredentialsMarquee />
        </div>
      </div>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                  Blog
                </p>
                <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
                  Latest Posts ✍🏽
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
              >
                Browse all posts →
              </Link>
            </div>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} categoryImages={categoryImages} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Experience Highlights */}
      {experiences.length > 0 && (() => {
        const experienceItems = experiences.map((exp) => {
          const org = getOrganizationByName(exp.company);
          return {
            title: exp.title,
            subtitle: exp.company,
            subtitleHref: org ? `/organizations/${org.slug}` : undefined,
            logo: exp.companyLogo || "",
            slug: exp.slug,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
            linkPrefix: "/experience",
          };
        });
        return (
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-[var(--container-max)] px-6">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                    Career
                  </p>
                  <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">Experience 💼</h2>
                </div>
                <Link
                  href="/about#experience"
                  className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
                >
                  View all positions →
                </Link>
              </div>
              <Timeline items={experienceItems} />
            </div>
          </section>
        );
      })()}

      {/* Education — dark */}
      {education.length > 0 && (
        <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                  Education
                </p>
                <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">Degrees 🎓</h2>
              </div>
              <Link
                href="/about#education"
                className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
              >
                View all degrees →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {education.map((edu) => (
                <Link
                  key={edu.slug}
                  href={`/education/${edu.slug}`}
                  className="group flex cursor-pointer items-start gap-5 rounded-2xl border border-horchata-200 bg-white p-6 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                >
                  {edu.logo && (
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-horchata-50 dark:bg-navy-700">
                      <Image
                        src={edu.logo}
                        alt={edu.institution}
                        width={56}
                        height={56}
                        className="h-11 w-11 rounded-lg object-contain"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold leading-snug text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100 dark:group-hover:text-horchata-300">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-navy-600 dark:text-white/70">
                      {edu.institution}
                    </p>
                    <p className="mt-1 text-xs font-medium text-navy-400 dark:text-horchata-400">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </p>
                    {edu.description && (
                      <p className="mt-2 text-sm text-navy-500 dark:text-horchata-400">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                  Projects
                </p>
                <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
                  Active Projects 🛠️
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-sm font-medium text-horchata-800 hover:text-horchata-600 dark:text-horchata-400 dark:hover:text-horchata-200"
              >
                All projects →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-horchata-200 bg-white p-5 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                >
                  {project.logo ? (
                    <Image
                      src={project.logo}
                      alt={project.title}
                      width={40}
                      height={40}
                      className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-lg object-contain"
                    />
                  ) : (
                    <span className="mt-0.5 text-2xl">🛠️</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100">
                      {project.title}
                    </p>
                    <p className="mt-0.5 text-sm text-navy-500 dark:text-white/60 line-clamp-2">
                      {project.tagline}
                    </p>
                  </div>
                  <svg className="mt-1 h-4 w-4 flex-shrink-0 text-horchata-400 group-hover:text-horchata-600 dark:text-navy-500 dark:group-hover:text-horchata-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: `${mentoringSessionCount}+`, label: "Mentoring sessions logged" },
              { stat: `${allPosts.length}+`, label: "Blog posts published" },
              { stat: "100+", label: "Speaking events since 2015" },
              { stat: `${yearsOfExperience}+`, label: "Years of experience" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-5xl font-black text-navy-900 dark:text-horchata-100">{stat}</p>
                <p className="mt-2 text-sm text-navy-500 dark:text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <ConnectCTA />
    </>
  );
}
