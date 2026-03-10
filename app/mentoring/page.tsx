import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTestimonials } from "@/lib/content";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { buildMetadata } from "@/lib/metadata";
import { CalEmbed } from "@/components/ui/cal-embed";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Mentoring",
  description:
    "Book a mentoring call with Frances Coronel — career guidance, technical interviews, resume reviews, and more for current and aspiring software engineers.",
  path: "/mentoring",
  ogImage: "/images/og/mentoring.png",
});

const pricingTiers = [
  {
    price: "$30",
    label: "30-Minute Call",
    description: "Quick career check-in or focused Q&A",
    href: "https://cal.com/francescoronel/mentoring",
    cta: "Book a call",
  },
  {
    price: "$70",
    label: "1-Hour Call",
    description: "Deep dive on career strategy, interview prep, or portfolio review",
    href: "https://cal.com/francescoronel/mentoring-hour",
    cta: "Book a call",
    featured: true,
  },
  {
    price: "$200",
    original: "$210",
    label: "3-Call Package",
    description: "Three 1-hour sessions — $10 savings",
    href: "https://buy.stripe.com/9AQeYVdyk7dn65i9AK",
    cta: "Purchase package",
  },
  {
    price: "$400",
    original: "$420",
    label: "6-Call Package",
    description: "Six 1-hour sessions — $20 savings",
    href: "https://buy.stripe.com/3csg2ZeCobtD3Xa9AL",
    cta: "Purchase package",
  },
];

const helpTopics = [
  "Expert advice from a senior engineer with 10+ years in SaaS",
  "Job search strategy — differentiate yourself and land interviews",
  "Self-advocacy strategies for women and underrepresented engineers",
  "Behavioral interview practice with real-time feedback",
  "Salary negotiation coaching",
  "Navigating promotion cycles",
  "Open source contribution guidance",
  "Resume and LinkedIn optimization",
  "Conference talk preparation",
];

const expertiseAreas = [
  {
    title: "Software Engineering Careers 💻",
    topics: [
      "Resume optimization and portfolio reviews",
      "Promotion planning and self-advocacy",
      "Avoiding 'glue work' and staying on the technical track",
      "Bootcamp to career transitions",
      "Getting started with open source",
    ],
  },
  {
    title: "Diversity & Inclusion 🌎",
    topics: [
      "Recruiting underrepresented groups in tech",
      "Building and scaling Latinx ERGs",
      "ERG launch strategies and resources",
      "Community building in the tech industry",
    ],
  },
  {
    title: "Technical Skills 🛠️",
    topics: [
      "TypeScript and React best practices",
      "Progressive Web Apps (PWAs)",
      "Static site generators and modern web tooling",
      "Web performance optimization",
      "Accessibility (a11y) and internationalization (i18n)",
    ],
  },
];

export default function MentoringPage() {
  const allTestimonials = getTestimonials();
  // Show testimonials from mentoring-related roles or just the first 6
  const mentoringTestimonials = allTestimonials
    .filter(
      (t) =>
        t.quote.toLowerCase().includes("mentor") ||
        t.quote.toLowerCase().includes("career") ||
        t.quote.toLowerCase().includes("guidance")
    )
    .slice(0, 6);
  const testimonials =
    mentoringTestimonials.length >= 3
      ? mentoringTestimonials
      : allTestimonials.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <PageHeader
        label="1-on-1 Coaching"
        heading="Mentoring 🚀"
        description="I provide guidance for current and aspiring software engineers. With 10+ years of full-time SaaS experience, I can help whether you're considering a bootcamp, prepping for interviews, or navigating your next career move."
        aside={
          <Image
            src="/images/assets/speaking-hero-image.webp"
            alt="Speech bubbles illustration"
            width={400}
            height={400}
            className="h-auto w-[200px] drop-shadow-lg sm:w-[280px] md:w-[380px]"
            priority
          />
        }
      >
        <div className="mt-6 rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
          <p className="text-sm font-bold text-navy-700 dark:text-horchata-200">
            Before our call, please:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-navy-600 dark:text-white/70">
            <li>📝 Prepare your discussion topics beforehand</li>
            <li>⏰ Arrive punctually to maximize our time together</li>
          </ul>
        </div>
      </PageHeader>

      {/* Pricing Tiers */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <h2 className="text-center text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Pricing
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier, i) => (
              <a
                key={tier.label}
                href={tier.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
                  tier.featured
                    ? "border-horchata-400 bg-horchata-50 ring-2 ring-horchata-400 dark:border-horchata-500 dark:bg-navy-800 dark:ring-horchata-500"
                    : "border-horchata-200 bg-white dark:border-navy-700 dark:bg-navy-800"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-horchata-700 px-4 py-1 text-xs font-bold text-white shadow-md dark:bg-horchata-500 dark:text-navy-900">
                    Most Popular
                  </span>
                )}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
                      {tier.price}
                    </span>
                    {tier.original && (
                      <span className="text-sm text-navy-400 line-through dark:text-horchata-500">
                        {tier.original}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-navy-700 dark:text-horchata-200">
                    {tier.label}
                  </p>
                </div>
                <p className="flex-1 text-sm text-navy-600 dark:text-white/70">
                  {tier.description}
                </p>
                <svg className="mt-4 h-5 w-5 self-end text-horchata-400 transition-colors group-hover:text-navy-900 dark:text-navy-500 dark:group-hover:text-horchata-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                {/* Memoji accent on the last card */}
                {i === pricingTiers.length - 1 && (
                  <div className="pointer-events-none absolute -bottom-4 -right-4 hidden lg:block">
                    <Image
                      src="/images/assets/frances-memoji-nice-job.png"
                      alt=""
                      width={100}
                      height={100}
                      className="h-[80px] w-[80px] object-contain drop-shadow-md"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Embed */}
      <section className="border-y border-horchata-200 bg-white py-16 dark:border-navy-700 dark:bg-navy-800/50">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Availability
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Book a Session 📅
          </h2>
          <div className="mt-8">
            <CalEmbed />
          </div>
        </div>
      </section>

      {/* How I Can Help */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                Mentoring
              </p>
              <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">How I Can Help</h2>
            </div>
            <Image
              src="/images/assets/rocket-illustration.webp"
              alt="Rocket illustration"
              width={140}
              height={140}
              className="hidden h-[110px] w-[110px] flex-shrink-0 object-contain drop-shadow-lg sm:block md:h-[130px] md:w-[130px]"
            />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-start gap-3 rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800"
              >
                <span className="mt-0.5 text-horchata-500 dark:text-horchata-400">✓</span>
                <p className="text-sm text-navy-700 dark:text-horchata-200">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Expertise */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Areas of Expertise 🎯
          </h2>
          <div className="mt-10 grid gap-6 md:gap-8 md:grid-cols-3">
            {expertiseAreas.map((area) => (
              <div key={area.title}>
                <h3 className="text-lg font-bold text-navy-900 dark:text-horchata-100">
                  {area.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {area.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-baseline gap-2 text-sm text-navy-600 dark:text-white/70"
                    >
                      <span className="inline-block h-1.5 w-1.5 flex-shrink-0 translate-y-[-1px] rounded-full bg-horchata-400" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsPreview testimonials={testimonials} heading="What Mentees Say" />

      {/* Refund Policy */}
      <section className="py-16">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <h2 className="text-xl font-bold text-navy-900 dark:text-horchata-100">
            Refund Policy 📋
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                No refunds
              </p>
              <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                All purchases are final
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                12-month window
              </p>
              <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                Packages must be used within 12 months of purchase
              </p>
            </div>
            <div className="rounded-xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
              <p className="font-medium text-navy-900 dark:text-horchata-100">
                Transferable
              </p>
              <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                Sessions can be transferred with written notice
              </p>
            </div>
          </div>
        </div>
      </section>

      <ConnectCTA variant="mentoring" />
    </>
  );
}
