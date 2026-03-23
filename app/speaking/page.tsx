import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPostsByCategory, getOrganizations, getTestimonials, getCategoryMaps } from "@/lib/content";
import { SpeakingListClient } from "@/components/ui/speaking-list-client";
import { OrgLogo } from "@/components/ui/org-logo";
import { UpcomingEvents } from "@/components/ui/upcoming-events";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Speaking",
  description:
    "Frances Coronel has spoken at 100+ events on topics ranging from diversity in tech to TypeScript, Progressive Web Apps, and community building.",
  path: "/speaking",
  ogImage: "/images/og/speaking.jpg",
});

const upcomingEvents: { org: string; talk: string; date: string; url: string; description: string; links?: { label: string; url: string }[] }[] = [];

const featuredTalks = [
{ org: "Dreamforce", orgSlug: "dreamforce", talk: "Exploring AI Agents in Slack", postSlug: "speaking-at-dreamforce-exploring-ai-agents-in-slack", image: "/images/speaking/dreamforce.jpg", topics: ["AI", "Slack"] },
  { org: "Ripple", orgSlug: "ripple", talk: "Mujeres Fuertes: Honoring Latina Leadership in Tech", postSlug: "mujeres-fuertes-honoring-latina-leadership-in-tech-at-ripples-fireside-chat", image: "", topics: ["Latinx Leadership", "Diversity"] },
  { org: "Doximity", orgSlug: "doximity", talk: "Women of Color in Engineering Fireside Chat", postSlug: "reflections-on-my-fireside-chat-with-doximity-women-of-color-in-engineering", image: "", topics: ["Diversity", "Women in Engineering"] },
  { org: "Techqueria", orgSlug: "techqueria", talk: "Community & Career Growth at Salesforce Tower", postSlug: "celebrating-community-and-career-growth-with-techqueria-at-salesforce-tower", image: "", topics: ["Community", "Career Growth"] },
  { org: "Pluralsight", orgSlug: "pluralsight", talk: "The Unsuspecting Beauty & Complexity of Web Forms", postSlug: "the-unsuspecting-beauty-complexity-of-web-forms", image: "/images/speaking/pluralsight.png", topics: ["TypeScript", "Web Dev"] },
  { org: "Unidos US", orgSlug: "unidos-us", talk: "Latinas in Tech: Breaking the Digital Ceiling", postSlug: "latinas-in-tech", image: "/images/speaking/unidos-us.jpg", topics: ["Latinx in Tech", "Diversity"] },
  { org: "Asana", orgSlug: "asana", talk: "Real Talk: Diversity in Tech", postSlug: "real-talk-finding-your-voice-in-tech", image: "/images/speaking/asana.png", topics: ["Diversity", "Career"] },
  { org: "Stanford University", orgSlug: "stanford-university", talk: "Future of Work", postSlug: "", image: "", topics: ["Future of Work"] },
  { org: "LTX Fest", orgSlug: "ltx-fest", talk: "Latinx Level Up, LIT Rising Stars", postSlug: "ltx-fest", image: "/images/speaking/ltx-fest.png", topics: ["Latinx in Tech", "Career"] },
  { org: "Coro Northern California", orgSlug: "coro-northern-california", talk: "Women in Leadership Alumni Panel", postSlug: "coro-women-in-leadership-alumnae-panel", image: "/images/speaking/coro.jpg", topics: ["Women in Leadership", "Diversity"] },
  { org: "CodeNewbie", orgSlug: "codenewbie", talk: "What are Progressive Web Apps?", postSlug: "codenewbie-podcast-what-are-progressive-web-apps", image: "/images/speaking/codenewbie.png", topics: ["PWA", "Web Dev"] },
  { org: "Tech Intersections", orgSlug: "tech-intersections", talk: "Leveling Up on LinkedIn for Software Engineers", postSlug: "leveling-up-on-linkedin-for-software-engineers", image: "", topics: ["LinkedIn", "Career"] },
];

export default function SpeakingPage() {
  const speakingPosts = getBlogPostsByCategory("speaking");
  const organizations = getOrganizations();
  const speakingKeywords = ["speak", "talk", "present", "panel", "workshop", "keynote", "fireside", "audience", "session", "stage"];
  const speakingTestimonials = getTestimonials()
    .filter((t) => {
      const text = (t.quote + " " + t.role).toLowerCase();
      return speakingKeywords.some((kw) => text.includes(kw));
    })
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
        heading="Speaking 🎤"
        description="Senior Software Engineer at Slack with 8+ years in frontend engineering. Speaker and mentor, with a focus on helping underrepresented engineers grow into technical leadership."
        aside={
          <Image
            src="/images/assets/speaking-microphone.png"
            alt="3D microphone illustration"
            width={400}
            height={400}
            className="h-auto w-[200px] object-contain drop-shadow-lg sm:w-[260px] md:w-[360px]"
            priority
          />
        }
      />

      {/* Upcoming Events */}
      <UpcomingEvents events={upcomingEvents} />

      {/* Featured Talks Grid */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-horchata-50 dark:bg-navy-700">
                      <OrgLogo
                        src={talk.logo}
                        orgUrl={talk.orgUrl}
                        name={talk.org}
                        size={32}
                        className="h-8 w-8 object-contain"
                        avatarClassName="h-8 w-8 text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-navy-500 dark:text-horchata-400">
                        {talk.org}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100 dark:group-hover:text-horchata-300">
                        {talk.talk}
                      </p>
                      {talk.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {talk.topics.map((topic) => (
                            <span key={topic} className="rounded-full bg-horchata-100 px-2 py-0.5 text-xs font-medium text-horchata-800 dark:bg-navy-700 dark:text-horchata-300">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Archive
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Past Events 📅 <span className="text-lg font-normal text-navy-400 dark:text-white/40">({posts.length})</span>
          </h2>
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
