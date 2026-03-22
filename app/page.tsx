import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { CredentialsMarquee } from "@/components/sections/credentials-marquee";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { BlogCard } from "@/components/ui/blog-card";
import { Timeline } from "@/components/ui/timeline";
import {
  getAllBlogPosts,
  getBlogPostsByCategory,
  getExperiences,
  getEducation,
  getCategoryMaps,
  getOrganizationByName,
  getProjects,
  getAwards,
  getTestimonials,
} from "@/lib/content";
import { formatDateRange } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import mentoringData from "@/content/mentoring-sessions.json";
import { getMultipleRepoStars } from "@/lib/github";

export const metadata: Metadata = buildMetadata({
  path: "/",
  ogType: "profile",
  ogImage: "/images/og/home.png",
});

export default async function HomePage() {
  const recentPosts = getAllBlogPosts().slice(0, 4);
  const activeProjects = getProjects().filter((p) => p.status === "active").slice(0, 4);
  const allPosts = getAllBlogPosts();
  const mentoringSessionCount = (mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions;
  const speakingCount = getBlogPostsByCategory("speaking").length;
  const startYear = 2017; // First full-time engineering role (Accenture)
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;
  const awardsCount = getAwards().length;
  const testimonialsCount = getTestimonials().length;
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

  // Fetch GitHub stars for active projects
  const activeProjectRepos = Object.fromEntries(
    activeProjects.filter((p) => p.github).map((p) => [p.slug, p.github as string])
  );
  const activeProjectStars = await getMultipleRepoStars(activeProjectRepos);

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
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
                className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
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
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                    Career
                  </p>
                  <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">Experience 💼</h2>
                </div>
                <Link
                  href="/about#experience"
                  className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
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
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                  Education
                </p>
                <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">Degrees 🎓</h2>
              </div>
              <Link
                href="/about#education"
                className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
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
                    <h3 className="text-lg font-bold leading-snug text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-300">
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
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
                className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
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
                    <p className="font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                      {project.title}
                    </p>
                    <p className="mt-0.5 text-sm text-navy-500 dark:text-white/60 line-clamp-2">
                      {project.tagline}
                    </p>
                    {project.github && (
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-navy-400 dark:text-white/40">
                        <svg className="h-3 w-3 flex-shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        <span className="font-mono">{project.github.split("/")[1] ?? project.github}</span>
                        {activeProjectStars[project.slug] != null && (
                          <>
                            <span>·</span>
                            <svg className="h-3 w-3 flex-shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            {(activeProjectStars[project.slug] as number).toLocaleString()}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <svg className="mt-1 h-4 w-4 flex-shrink-0 text-horchata-400 group-hover:text-horchata-700 dark:text-navy-500 dark:group-hover:text-horchata-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
              By the Numbers
            </p>
            <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
              Impact at a Glance 📊
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { stat: `${mentoringSessionCount}+`, label: "Mentoring sessions", sublabel: "logged on ADPList & Calendly", icon: "💬", href: "/mentoring" },
              { stat: `${allPosts.length}+`, label: "Blog posts", sublabel: "published since 2014", icon: "✍🏽", href: "/blog" },
              { stat: `${speakingCount}+`, label: "Speaking events", sublabel: "at conferences since 2015", icon: "🎤", href: "/speaking" },
              { stat: `${yearsOfExperience}+`, label: "Years of experience", sublabel: "full-time in industry", icon: "💼", href: "/about#experience" },
              { stat: `${awardsCount}+`, label: "Awards & recognition", sublabel: "from organizations & publications", icon: "🏆", href: "/awards" },
              { stat: `${testimonialsCount}+`, label: "Testimonials", sublabel: "from mentees, peers & leaders", icon: "⭐", href: "/testimonials" },
            ].map(({ stat, label, sublabel, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-5 rounded-2xl border border-horchata-200 bg-white px-6 py-5 transition-all hover:border-horchata-400 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
              >
                <span className="text-3xl" aria-hidden="true">{icon}</span>
                <div className="min-w-0">
                  <p className="text-3xl font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-400">
                    {stat}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-navy-700 dark:text-white/80">{label}</p>
                  <p className="text-xs text-navy-400 dark:text-white/40">{sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <ConnectCTA />
    </>
  );
}
