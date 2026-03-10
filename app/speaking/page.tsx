import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPostsByCategory, getOrganizations, getTestimonials, getCategoryMaps } from "@/lib/content";
import { SpeakingListClient } from "@/components/ui/speaking-list-client";
import { resolveImageUrl } from "@/lib/cloudinary";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Speaking",
  description:
    "Frances Coronel has spoken at 100+ events on topics ranging from diversity in tech to TypeScript, Progressive Web Apps, and community building.",
  path: "/speaking",
  ogImage: "/images/og/speaking.png",
});

const featuredTalks = [
  { org: "Dreamforce", orgSlug: "dreamforce", talk: "Exploring AI Agents in Slack", postSlug: "speaking-at-dreamforce-exploring-ai-agents-in-slack", image: "/images/speaking/dreamforce.jpg" },
  { org: "Pluralsight", orgSlug: "pluralsight", talk: "The Unsuspecting Beauty & Complexity of Web Forms", postSlug: "the-unsuspecting-beauty-complexity-of-web-forms", image: "/images/speaking/pluralsight.png" },
  { org: "Unidos US", orgSlug: "unidos-us", talk: "Latinas in Tech: Breaking the Digital Ceiling", postSlug: "latinas-in-tech", image: "/images/speaking/unidos-us.jpg" },
  { org: "Asana", orgSlug: "asana", talk: "Real Talk: Diversity in Tech", postSlug: "real-talk-finding-your-voice-in-tech", image: "/images/speaking/asana.png" },
  { org: "Stanford University", orgSlug: "stanford-university", talk: "Future of Work", postSlug: "", image: "" },
  { org: "LTX Fest", orgSlug: "ltx-fest", talk: "Latinx Level Up, LIT Rising Stars", postSlug: "ltx-fest", image: "/images/speaking/ltx-fest.png" },
  { org: "Coro Northern California", orgSlug: "coro-northern-california", talk: "Women in Leadership Alumni Panel", postSlug: "coro-women-in-leadership-alumnae-panel", image: "/images/speaking/coro.jpg" },
  { org: "Women Who Code", orgSlug: "women-who-code", talk: "TypeScript 101", postSlug: "typescript-101", image: "/images/speaking/women-who-code.png" },
  { org: "SMASH", orgSlug: "smash", talk: "My Journey in Tech", postSlug: "smash-academy-at-stanford-f0-9f-8e-93", image: "/images/speaking/smash.jpg" },
  { org: "CodeNewbie", orgSlug: "codenewbie", talk: "What are Progressive Web Apps?", postSlug: "codenewbie-podcast-what-are-progressive-web-apps", image: "/images/speaking/codenewbie.png" },
  { org: "Somos", orgSlug: "somos", talk: "Latinx in the Workplace", postSlug: "latinx-in-the-workplace", image: "/images/speaking/somos.jpg" },
  { org: "Outco", orgSlug: "outco", talk: "The Future of Diversity & Inclusion in Tech", postSlug: "outco-software-sesh", image: "/images/speaking/outco.png" },
];

export default function SpeakingPage() {
  const speakingPosts = getBlogPostsByCategory("speaking");
  const organizations = getOrganizations();
  const speakingTestimonials = getTestimonials()
    .filter(
      (t) =>
        t.quote.toLowerCase().includes("speak") ||
        t.quote.toLowerCase().includes("talk") ||
        t.quote.toLowerCase().includes("present")
    )
    .slice(0, 3);
  const displayTestimonials =
    speakingTestimonials.length >= 3
      ? speakingTestimonials
      : getTestimonials().slice(0, 3);

  const posts = speakingPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readingTime: p.readingTime,
    featuredImage: p.featuredImage,
    categories: p.categories,
  }));

  const { categoryImages } = getCategoryMaps();

  // Get logos for featured talk orgs (match by slug first, then name)
  const featuredWithLogos = featuredTalks.map((ft) => {
    const org = organizations.find((o) => o.slug === ft.orgSlug) ||
      organizations.find((o) => o.name.toLowerCase() === ft.org.toLowerCase());
    return { ...ft, logo: org?.logo || "", orgUrl: org?.url || "" };
  });

  return (
    <>
      {/* Hero */}
      <PageHeader
        label="Events"
        heading="Speaking 💬"
        description="I've spoken at 100+ events on diverse topics ranging from driving D&I in the tech industry to community building — covering TypeScript, Progressive Web Apps, JavaScript, and more."
        aside={
          <Image
            src="/images/assets/speaking-microphone.png"
            alt="3D microphone illustration"
            width={400}
            height={400}
            className="h-auto w-[200px] drop-shadow-lg sm:w-[260px] md:w-[360px]"
            priority
          />
        }
      />

      {/* Featured Talks Grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Highlights
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Featured Talks 🎤
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWithLogos.map((talk) => {
              const href = talk.postSlug
                ? `/blog/${talk.postSlug}`
                : talk.orgUrl || `/organizations/${talk.orgSlug}`;

              return (
                <Link
                  key={talk.org + talk.talk}
                  href={href}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-horchata-200 bg-white transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                >
                  <div className="flex items-start gap-4 p-5">
                    {talk.logo ? (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-horchata-50 dark:bg-navy-700">
                        <Image
                          src={resolveImageUrl(talk.logo)}
                          alt={talk.org}
                          width={40}
                          height={40}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-horchata-100 text-base font-bold text-horchata-600 dark:bg-navy-700 dark:text-horchata-400">
                        {talk.org[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-navy-500 dark:text-horchata-400">
                        {talk.org}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100 dark:group-hover:text-horchata-300">
                        {talk.talk}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Archive
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">Past Events ({posts.length})</h2>
          <div className="mt-10">
            <SpeakingListClient posts={posts} categoryImages={categoryImages} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsPreview testimonials={displayTestimonials} heading="What Attendees Say" />

      <ConnectCTA variant="speaking" />
    </>
  );
}
