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
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { BioSection } from "@/components/sections/bio-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { LanguagesSection } from "@/components/sections/languages-section";
import { MemojiSection } from "@/components/sections/memoji-section";
import { AwardsSection } from "@/components/sections/awards-section";
import { OrganizationsPreview } from "@/components/sections/organizations-preview";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Frances Coronel is a senior software engineer at Slack with 10+ years of experience. Speaker, mentor, and proud Peruvian-American. 👩🏽‍💻",
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
    label: "First Person",
    content: (
      <>
        <p>
          Hi! I&apos;m Frances Coronel — a senior software engineer, speaker,
          mentor, and proud Corgi mom.
        </p>
        <p>
          I&apos;ve been coding professionally since 2015, building my career at the intersection of design,
          product, and engineering. My sweet spot is crafting{" "}
          user-centered, high-impact experiences in{" "}
          React and TypeScript that help millions of
          people get work done more efficiently.
        </p>
        <p>
          Right now, I work at Slack on the <strong>Messaging team</strong>,
          where I&apos;m focused on frontend architecture, notifications, and sidebar systems —
          the foundation of how teams communicate and collaborate every day.
        </p>
        <p>
          Beyond my day-to-day engineering work, I&apos;m passionate about{" "}
          mentorship and representation in tech. I&apos;ve
          mentored hundreds of engineers through organizations like
          Formation, served as Executive Director of Techqueria, and
          spoken at over 100 events.
        </p>
        <p>
          As a proud Peruvian-American, I care deeply about creating
          more visibility and access for underrepresented communities in
          engineering and leadership roles. I grew up in Norfolk, Virginia,
          and now live in the Bay Area with my two Corgis and my boyfriend Andrew.
        </p>
      </>
    ),
  },
  {
    label: "Third Person",
    content: (
      <>
        <p>
          Frances Coronel is a senior software engineer,
          speaker, mentor, and proud Corgi mom.
        </p>
        <p>
          Since 2015, she has built a career at the intersection of product, design, and
          engineering — crafting user-centered, high-impact experiences
          that help millions of people get work done more efficiently.
        </p>
        <p>
          She currently works at Slack on the <strong>Messaging team</strong>,
          focused on frontend architecture, notifications, and sidebar systems —
          the foundation of how teams communicate and collaborate every day.
        </p>
        <p>
          Beyond her engineering work, Frances is deeply committed to
          mentorship, community building, and representation in tech.
          She has mentored hundreds of aspiring and experienced engineers
          through programs like Formation, served as Executive Director of Techqueria,
          and spoken at over 100 events.
        </p>
        <p>
          Originally from Norfolk, Virginia,
          Frances now calls the Bay Area home, where she
          lives with her two Corgis, Luna and Sueño, and her boyfriend Andrew.
        </p>
      </>
    ),
  },
  {
    label: "Short Bio",
    content: (
      <p>
        Frances Coronel is a Senior Software Engineer at Slack, speaker,
        and mentor passionate about building intuitive, high-impact
        experiences that empower teams worldwide. A proud
        Peruvian-American and Corgi mom based in the Bay Area, she loves
        scuba diving, Netflix marathons, and laughing with her partner
        Andrew.
      </p>
    ),
  },
  {
    label: "Social Media",
    content: (
      <p>
        Senior Software Engineer @ Slack 👩🏽‍💻 | Speaker & Mentor 🚀 |
        Corgi Mom 🐾 | 40 Under 40 Latinos in Bay Area 🌉 | Empowering
        the next generation of engineers 💛
      </p>
    ),
  },
  {
    label: "Press",
    colSpan: 2,
    content: (
      <>
        <p>
          Frances Coronel is a Senior Software Engineer at{" "}
          Slack, where she builds core messaging
          experiences that help millions of people work more efficiently
          every day.
        </p>
        <p>
          With nearly a decade of experience in{" "}
          frontend engineering, Frances specializes in{" "}
          React and TypeScript, bridging
          design and development to deliver elegant, user-centered
          solutions at scale.
        </p>
        <p>
          A proud Peruvian-American, Frances is also a{" "}
          speaker, mentor, and diversity advocate who has
          mentored hundreds of engineers and spoken at more than 100 events.
          Originally from Norfolk, Virginia, Frances now lives in
          the Bay Area with her two Corgis,{" "}
          Luna and Sueño.
        </p>
      </>
    ),
  },
];

export default function AboutPage() {
  const experiences = getExperiences();
  const education = getEducation();
  const mentoringSessionCount = (mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions;
  const allPostsCount = getAllBlogPosts().length;
  const speakingCount = getBlogPostsByCategory("speaking").length;
  const startYear = 2017;
  const yearsOfExperience = new Date().getFullYear() - startYear;
  const awards = getAwards();
  const organizations = getOrganizationsByActivity()
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
        description="I'm Frances Coronel — a senior software engineer at Slack with 10+ years of experience building products used by millions. I craft frontend experiences in React and TypeScript, mentor the next generation of engineers, and speak at conferences worldwide to make tech more inclusive."
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
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Skills &amp; Technologies 🛠️
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.slug}
                className="rounded-full border border-horchata-200 bg-white px-4 py-1.5 text-sm font-medium text-navy-700 dark:border-navy-700 dark:text-horchata-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations */}
      <OrganizationsPreview organizations={organizations} />

      {/* Testimonials */}
      <TestimonialsPreview testimonials={displayTestimonials} />

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
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: `${mentoringSessionCount}+`, label: "Mentoring sessions logged", href: "/mentoring" },
              { stat: `${allPostsCount}+`, label: "Blog posts published", href: "/blog" },
              { stat: `${speakingCount}+`, label: "Speaking events since 2015", href: "/speaking" },
              { stat: `${yearsOfExperience}+`, label: "Years of full-time experience", href: "#experience" },
            ].map(({ stat, label, href }) => (
              <Link key={label} href={href} className="group rounded-2xl p-4 transition-colors hover:bg-horchata-200 dark:hover:bg-navy-800">
                <p className="text-5xl font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-400">{stat}</p>
                <p className="mt-2 text-sm text-navy-500 dark:text-white/60">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
