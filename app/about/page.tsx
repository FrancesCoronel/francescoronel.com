import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getExperiences,
  getEducation,
  getAwards,
  getOrganizationsByActivity,
  getOrganizationByName,
  getTestimonials,
  getAllBlogPosts,
  getBlogPostsByCategory,
  EXCLUDED_FROM_FEATURED_ORGS,
} from "@/lib/content";
import skills from "@/content/skills.json";
import mentoringData from "@/content/mentoring-sessions.json";
import { buildMetadata, YEARS_OF_EXPERIENCE } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { BioSection } from "@/components/sections/bio-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { LanguagesSection } from "@/components/sections/languages-section";
import { MemojiSection } from "@/components/sections/memoji-section";
import { SkillIcon, getSkillUrl, getSkillEmoji, hasSkillIcon } from "@/components/ui/skill-icon";
import { AwardsSection } from "@/components/sections/awards-section";
import { OrganizationsPreview } from "@/components/sections/organizations-preview";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Frances Coronel is a Senior Software Engineer at Slack with 8+ years of experience in frontend engineering and AI adoption. Speaker, mentor, and proud Peruvian-American. 👩🏽‍💻",
  path: "/about",
  ogImage: "/images/og/about.jpg",
});

const awardBlogPosts: Record<string, string> = {
  "latinos-40-under-40": "",
  "goldman-sachs-small-businesses-student-challenge-winner": "discover-goldman-sachs",
  "abc7-news-latino-heritage-month": "abc7-news-latino-heritage-month",
  "sentry-open-source-grant": "sentry-open-source-grant",
  "grow-with-google-udacity-scholarship": "grow-with-google-udacity-scholarship",
  "scholarship-recipient-cra-women-grad-cohort-workshop": "scholarship-recipient-cra-women-grad-cohort-workshop",
  "project-alloy-grant-recipient": "project-alloy-grant-recipient",
  "fellow-student-research-conference-and-luncheon-virginia-space-grant-consortium": "fellow-student-research-conference-and-luncheon-virginia-space-grant-consortium",
  "the-connector-award-by-the-buildies": "the-connector-award-by-the-buildies",
  "ricardo-salinas-scholar": "aspen-executive-seminar-on-leadership",
  "canvas-mentorship-cohort-awardee": "canvas-mentorship-accelerator",
  "best-device-privacy-hack-kent-hack-enough": "kent-hack-enough",
  "treehacks-dropbox-social-impact": "treehacks",
};

const bioVariants = [
  {
    label: "Short Bio",
    content: (
      <p>
        Senior Software Engineer at Slack with 8+ years in frontend engineering
        and an MS in Computer Science from Cornell Tech. Speaker at 100+ events
        and mentor focused on helping underrepresented engineers grow into
        technical leadership.
      </p>
    ),
  },
  {
    label: "Social Media",
    content: (
      <p>
        Senior Software Engineer @ Slack 👩🏽‍💻 | Speaker &amp; Mentor 🚀 |
        Corgi Mom 🐕 | 40 Under 40 Latinos in Bay Area 🌉 | Empowering
        the next generation of engineers 💛
      </p>
    ),
  },
  {
    label: "First Person",
    content: (
      <>
        <p>
          Hi! I&apos;m Frances Coronel, a Senior Software Engineer at Slack, speaker,
          mentor, and proud Corgi mom.
        </p>
        <p>
          I hold a Bachelor&apos;s in Computer Science from Hampton University and a Master&apos;s
          in Computer Science from Cornell Tech. I&apos;ve been working full-time as a software
          engineer since 2017, specializing in frontend engineering with React and TypeScript.
        </p>
        <p>
          I&apos;m currently on Slack&apos;s DevXP pillar, focused on AI adoption
          and developer productivity, building agentic workflows and tooling that help engineers
          move faster with AI, and helping non-engineers confidently use those same tools
          alongside them.
        </p>
        <p>
          Beyond Slack, I enjoy mentoring other engineers and I&apos;ve logged 250+ hours of
          technical and behavioral interview prep. I&apos;ve also spoken at 100+ events on
          frontend engineering topics and building a career in tech with intention.
        </p>
        <p>
          As a proud Peruvian-American from Norfolk, Virginia, I care about making technical
          leadership more accessible, especially for Latinas and underrepresented engineers.
          I now live in the Bay Area with my two Corgis, Luna and Sueño, and my partner Andrew.
        </p>
      </>
    ),
  },
  {
    label: "Third Person",
    content: (
      <>
        <p>
          Frances Coronel is a Senior Software Engineer at Slack,
          speaker, mentor, and proud Corgi mom.
        </p>
        <p>
          She holds a Bachelor&apos;s in Computer Science from Hampton University and a Master&apos;s
          in Computer Science from Cornell Tech. She has been working full-time as a software
          engineer since 2017, specializing in frontend engineering with React and TypeScript.
        </p>
        <p>
          She currently works on Slack&apos;s DevXP pillar, focused on AI adoption
          and developer productivity, building agentic workflows and tooling that help engineers
          move faster with AI, and helping non-engineers confidently use those same tools
          alongside them.
        </p>
        <p>
          Beyond Slack, Frances enjoys mentoring other engineers and has logged 250+ hours of
          technical and behavioral interview prep. She has also spoken at 100+ events on
          frontend engineering topics and building a career in tech with intention.
        </p>
        <p>
          As a proud Peruvian-American from Norfolk, Virginia, Frances cares about making
          technical leadership more accessible, especially for Latinas and underrepresented
          engineers. She now lives in the Bay Area with her two Corgis, Luna and Sueño,
          and her partner Andrew.
        </p>
      </>
    ),
  },
  {
    label: "Press",
    colSpan: 2,
    content: (
      <>
        <p>
          Frances Coronel is a Senior Software Engineer at Slack, where she works
          on the DevXP pillar focused on AI adoption and developer productivity,
          building agentic workflows and internal tooling that help engineers move
          faster with AI.
        </p>
        <p>
          With 8+ years of experience in frontend engineering, Frances specializes
          in React and TypeScript, bridging design and development to deliver
          elegant, user-centered solutions at scale. Her work on Slack&apos;s settings
          redesign drove a 5x increase in user engagement.
        </p>
        <p>
          A proud Peruvian-American, Frances is also a speaker, mentor, and
          diversity advocate who has mentored hundreds of engineers and spoken
          at more than 100 events. Originally from Norfolk, Virginia, Frances
          now lives in the Bay Area with her two Corgis, Luna and Sueño,
          and her partner Andrew.
        </p>
      </>
    ),
  },
];

export default function AboutPage() {
  const experiences = getExperiences();
  const education = getEducation();
  const roundDown = (n: number) => n >= 1000 ? Math.floor(n / 1000) * 1000 : n >= 100 ? Math.floor(n / 100) * 100 : Math.floor(n / 10) * 10;
  const mentoringSessionCount = roundDown((mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions);
  const allPostsCount = roundDown(getAllBlogPosts().length);
  const speakingCount = roundDown(getBlogPostsByCategory("speaking").length);
  const yearsOfExperience = YEARS_OF_EXPERIENCE;
  const awardsCount = roundDown(getAwards().length);
  const testimonialsCount = roundDown(getTestimonials().length);
  const allOrganizations = getOrganizationsByActivity();
  const awards = getAwards().map((a) => {
    const org = allOrganizations.find(
      (o) => o.name.toLowerCase() === a.organization.toLowerCase()
    );
    return { ...a, orgLogo: org?.logo ?? "" };
  });
  const organizations = allOrganizations
    .filter((o) => o.logo && !EXCLUDED_FROM_FEATURED_ORGS.has(o.slug))
    .slice(0, 10);
  const testimonials = getTestimonials()
    .filter((t) => t.featured)
    .slice(0, 3);
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : getTestimonials().slice(0, 3);

  const experienceItems = experiences.filter((exp) => exp.type !== "project").map((exp) => {
    const org = getOrganizationByName(exp.company);
    return {
      title: exp.title,
      subtitle: exp.company,
      subtitleHref: org ? `/organizations/${org.slug}` : undefined,
      logo: exp.companyLogo,
      slug: exp.slug,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      linkPrefix: "/experience",
    };
  });

  const educationItems = education.map((edu) => {
    const org = getOrganizationByName(edu.institution);
    return {
      title: edu.degree || edu.institution,
      subtitle: edu.institution,
      subtitleHref: org ? `/organizations/${org.slug}` : undefined,
      logo: edu.logo,
      slug: edu.slug,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
      linkPrefix: "/education",
    };
  });

  return (
    <>
      {/* Hero */}
      <PageHeader
        label="Engineer, Speaker & Mentor"
        heading="About 👩🏽‍💻"
        description="I'm Frances Coronel, a Senior Software Engineer at Slack with 8+ years in frontend engineering. I build AI-powered developer tooling, speak at conferences, and mentor engineers at all levels. I care deeply about making technical leadership more accessible, especially for Latinas and underrepresented engineers in tech."
        aside={
          <div className="h-56 w-56 overflow-hidden rounded-full bg-horchata-100 ring-4 ring-horchata-200 dark:bg-navy-700 dark:ring-navy-600 sm:h-72 sm:w-72 md:h-96 md:w-96">
            <Image
              src="/images/assets/frances-slack.jpg"
              alt="Frances Coronel"
              width={384}
              height={384}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        }
      >
        <a
          href="https://linkedin.com/in/francescoronel"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Follow on LinkedIn
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </a>
      </PageHeader>

      {/* Bio */}
      <BioSection variants={bioVariants} />

      {/* Experience Timeline */}
      <TimelineSection
        id="experience"
        label="Career"
        heading="Experience 💼"
        items={experienceItems}
      />

      {/* Education Timeline */}
      <TimelineSection
        id="education"
        label="Education"
        heading="Education 🎓"
        items={educationItems}
        dark
      />

      {/* Languages */}
      <LanguagesSection />

      {/* Memoji */}
      <MemojiSection />

      {/* Awards */}
      <div id="awards">
        <AwardsSection awards={awards} blogPostMap={awardBlogPosts} />
      </div>

      {/* Skills */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Expertise
          </p>
          <h2 className="mt-1 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
            Skills &amp; Technologies 🛠️
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {skills.map((skill) => {
              const url = getSkillUrl(skill.slug);
              const emoji = getSkillEmoji(skill.slug);
              const isInternal = url?.startsWith("/");
              const inner = (
                <>
                  <SkillIcon slug={skill.slug} size={18} />
                  {emoji && !hasSkillIcon(skill.slug) && (
                    <span className="text-base leading-none" aria-hidden="true">{emoji}</span>
                  )}
                  {skill.name}
                </>
              );
              const cls = "inline-flex items-center gap-2 rounded-full border border-horchata-200 bg-white px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:border-horchata-400 hover:bg-horchata-50 dark:border-navy-700 dark:bg-navy-800 dark:text-horchata-200 dark:hover:border-navy-500 dark:hover:bg-navy-700 dark:hover:text-white";
              if (!url) return <span key={skill.slug} className={cls + " cursor-default"}>{inner}</span>;
              if (isInternal) return <Link key={skill.slug} href={url} className={cls}>{inner}</Link>;
              return <a key={skill.slug} href={url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
            })}
          </div>
        </div>
      </section>

      {/* Organizations */}
      <OrganizationsPreview organizations={organizations} />

      {/* Testimonials */}
      <TestimonialsPreview testimonials={displayTestimonials} sectionClassName="border-y border-horchata-200 bg-horchata-50 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-900" />

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
              { stat: `${allPostsCount}+`, label: "Blog posts", sublabel: "published since 2014", icon: "✍🏽", href: "/posts" },
              { stat: `${speakingCount}+`, label: "Speaking events", sublabel: "at conferences since 2015", icon: "🎤", href: "/speaking" },
              { stat: `${yearsOfExperience}+`, label: "Years of experience", sublabel: "full-time in industry", icon: "💼", href: "#experience" },
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
                  <p className="text-xs text-navy-600 dark:text-white/60">{sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
