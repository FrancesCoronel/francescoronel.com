import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata, YEARS_OF_EXPERIENCE } from "@/lib/metadata";
import { ContactForm } from "@/components/ui/contact-form";
import { PageHeader } from "@/components/ui/page-header";
import { getAllBlogPosts, getBlogPostsByCategory, getAwards, getTestimonials } from "@/lib/content";
import mentoringData from "@/content/mentoring-sessions.json";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Frances Coronel for speaking, mentoring, or collaboration.",
  path: "/contact",
  ogImage: "/images/og/contact.jpg",
});

const roundDown = (n: number) => n >= 1000 ? Math.floor(n / 1000) * 1000 : n >= 100 ? Math.floor(n / 100) * 100 : Math.floor(n / 10) * 10;

export default function ContactPage() {
  const allPosts = getAllBlogPosts();
  const mentoringSessionCount = roundDown((mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions);
  const speakingCount = roundDown(getBlogPostsByCategory("speaking").length);
  const awardsCount = roundDown(getAwards().length);
  const testimonialsCount = roundDown(getTestimonials().length);

  const stats = [
    { stat: `${mentoringSessionCount}+`, label: "Mentoring sessions", sublabel: "logged on ADPList & Calendly", icon: "💬", href: "/mentoring" },
    { stat: `${roundDown(allPosts.length)}+`, label: "Blog posts", sublabel: "published since 2014", icon: "✍🏽", href: "/blog" },
    { stat: `${speakingCount}+`, label: "Speaking events", sublabel: "at conferences since 2015", icon: "🎤", href: "/speaking" },
    { stat: `${YEARS_OF_EXPERIENCE}+`, label: "Years of experience", sublabel: "full-time in industry", icon: "💼", href: "/about#experience" },
    { stat: `${awardsCount}+`, label: "Awards & recognition", sublabel: "from organizations & publications", icon: "🏆", href: "/awards" },
    { stat: `${testimonialsCount}+`, label: "Testimonials", sublabel: "from mentees, peers & leaders", icon: "⭐", href: "/testimonials" },
  ];

  return (
    <>
      {/* Hero */}
      <PageHeader
        label="Let's Work Together"
        heading="Contact 📨"
        description="I'm available for speaking engagements, mentoring sessions, and collaborations. Let's connect."
        aside={
          <Image
            src="/images/assets/heart-chat-bubble.webp"
            alt=""
            width={360}
            height={360}
            className="h-auto w-[200px] object-contain drop-shadow-lg sm:w-[260px] md:w-[360px]"
            aria-hidden="true"
          />
        }
      />

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
            {stats.map(({ stat, label, sublabel, icon, href }) => (
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

      {/* Contact Form + CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: CTA copy */}
            <div className="flex flex-col justify-center">
              <Image
                src="/images/assets/heart-chat-bubble.webp"
                alt=""
                width={160}
                height={160}
                className="mb-6 h-28 w-28 object-contain drop-shadow-lg md:h-36 md:w-36"
                aria-hidden="true"
              />
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                Let&apos;s Work Together
              </p>
              <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
                Send me a message 💌
              </h2>
              <p className="mt-3 text-lg text-navy-600 dark:text-white/70">
                Have a question, a speaking invite, or just want to say hi? I&apos;d love to hear from you.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/mentoring"
                  className="rounded-full border border-navy-300 px-6 py-2.5 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-horchata-50 dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700"
                >
                  Book Mentoring &rarr;
                </Link>
                <a
                  href="https://www.linkedin.com/in/francescoronel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-navy-300 px-6 py-2.5 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-horchata-50 dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Follow on LinkedIn
                </a>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
