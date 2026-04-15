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
import { buildMetadata, YEARS_OF_EXPERIENCE } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import mentoringData from "@/content/mentoring-sessions.json";
import { getMultipleRepoStars } from "@/lib/github";

export const metadata: Metadata = buildMetadata({
  path: "/",
  ogType: "profile",
  ogImage: "/images/og/home.jpg",
});

export default async function HomePage() {
  const recentPosts = getAllBlogPosts().slice(0, 4);
  const allPosts = getAllBlogPosts();
  const roundDown = (n: number) => n >= 1000 ? Math.floor(n / 1000) * 1000 : n >= 100 ? Math.floor(n / 100) * 100 : Math.floor(n / 10) * 10;
  const mentoringSessionCount = roundDown((mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions);
  const speakingCount = roundDown(getBlogPostsByCategory("speaking").length);
  const yearsOfExperience = YEARS_OF_EXPERIENCE;
  const awardsCount = roundDown(getAwards().length);
  const testimonialsCount = roundDown(getTestimonials().length);
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

  const FEATURED_SLUGS = ["latina-dev", "apprenticeships-me", "hire-me"];
  const allProjects = getProjects();
  const featuredProjects = FEATURED_SLUGS.map((slug) => allProjects.find((p) => p.slug === slug)).filter(Boolean) as typeof allProjects;

  // Fetch GitHub stars for featured projects
  const featuredProjectRepos = Object.fromEntries(
    featuredProjects.filter((p) => p.github).map((p) => [p.slug, p.github as string])
  );
  const featuredProjectStars = await getMultipleRepoStars(featuredProjectRepos);

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
                <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
                  Latest Posts ✍🏽
                </h2>
              </div>
              <Link
                href="/posts"
                className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
              >
                Browse all posts →
              </Link>
            </div>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} categoryImages={categoryImages} basePath="/posts" />
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
                  <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">Experience 💼</h2>
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
                <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">Degrees 🎓</h2>
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
                  className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-horchata-200 bg-white p-4 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500 sm:gap-5 sm:p-6"
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
                    <h3 className="text-base font-bold leading-snug text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-300 sm:text-lg">
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

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                  Pinned
                </p>
                <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
                  Featured Projects ⭐
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
              >
                All projects →
              </Link>
            </div>
            <div>
              {featuredProjects.map((project) => {
                const stars = featuredProjectStars[project.slug];
                return (
                  <div key={project.slug} className="group relative flex items-start gap-6 border-b border-horchata-200 py-8 last:border-b-0 dark:border-navy-700">
                    <div className="absolute -inset-x-4 inset-y-2 z-0 rounded-2xl border border-horchata-300 bg-white opacity-0 shadow-sm transition group-hover:opacity-100 dark:border-navy-600 dark:bg-navy-800" />
                    <Link href={`/posts/${project.slug}`} className="absolute inset-0 z-20" aria-label={project.title} />
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-navy-900/5 shadow-navy-900/10 dark:bg-navy-700 dark:ring-white/10">
                      {project.logo ? (
                        <Image src={project.logo} alt={project.title} width={32} height={32} className="h-8 w-8 rounded-full object-contain" />
                      ) : (
                        <span className="text-xl">{project.emoji ?? "🛠️"}</span>
                      )}
                    </div>
                    <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-base font-semibold tracking-tight text-navy-800 dark:text-horchata-100">
                          {project.title}
                        </h3>
                        {project.status === "active" && (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-navy-600 dark:text-white/60">{project.tagline}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-navy-400 dark:text-white/40">
                        <span>{formatDateRange(project.startDate, project.endDate)}</span>
                        {stars != null && stars > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 fill-current text-horchata-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            {stars.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative z-10 flex-shrink-0 self-center">
                      <svg className="h-5 w-5 text-navy-300 transition-colors group-hover:text-horchata-700 dark:text-navy-600 dark:group-hover:text-horchata-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
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
            <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
              Impact at a Glance 📊
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { stat: `${mentoringSessionCount}+`, label: "Mentoring sessions", sublabel: "logged on Cal.com & Calendly", icon: "💬", href: "/mentoring" },
              { stat: `${roundDown(allPosts.length)}+`, label: "Blog posts", sublabel: "published since 2014", icon: "✍🏽", href: "/posts" },
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
