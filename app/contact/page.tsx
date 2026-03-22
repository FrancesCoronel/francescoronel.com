import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/ui/contact-form";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";
import { getAllBlogPosts, getBlogPostsByCategory, getAwards, getTestimonials } from "@/lib/content";
import mentoringData from "@/content/mentoring-sessions.json";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Frances Coronel for speaking, mentoring, or collaboration.",
  path: "/contact",
  ogImage: "/images/og/contact.jpg",
});

export default function ContactPage() {
  const mentoringSessionCount = (mentoringData as { _meta: { totalSessions: number } })._meta.totalSessions;
  const allPosts = getAllBlogPosts();
  const speakingCount = getBlogPostsByCategory("speaking").length;
  const startYear = 2017;
  const yearsOfExperience = new Date().getFullYear() - startYear;
  const awardsCount = getAwards().length;
  const testimonialsCount = getTestimonials().length;

  const stats = [
    { stat: `${mentoringSessionCount}+`, label: "Mentoring sessions", sublabel: "logged on ADPList & Calendly", icon: "💬", href: "/mentoring" },
    { stat: `${allPosts.length}+`, label: "Blog posts", sublabel: "published since 2014", icon: "✍🏽", href: "/blog" },
    { stat: `${speakingCount}+`, label: "Speaking events", sublabel: "at conferences since 2015", icon: "🎤", href: "/speaking" },
    { stat: `${yearsOfExperience}+`, label: "Years of experience", sublabel: "full-time in industry", icon: "💼", href: "/about#experience" },
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
            width={256}
            height={256}
            className="h-48 w-48 object-contain drop-shadow-lg md:h-56 md:w-56"
            aria-hidden="true"
          />
        }
      />

      {/* Stats */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
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

      {/* Contact Form */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Send me a message 💌
          </h2>
          <ContactForm />
        </div>
      </section>

      <NewsletterCTA />

      {/* CTA Banner */}
      <ConnectCTA variant="contact" />
    </>
  );
}
