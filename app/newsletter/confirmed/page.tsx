import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

// Where the newsletter confirmation link lands (app/api/newsletter/confirm).
// Only reachable from that redirect, so it stays out of search engines, the
// sitemap and site search.
export const metadata: Metadata = buildMetadata({
  title: "Newsletter Confirmation",
  description: "Confirm your subscription to Frances Coronel's newsletter.",
  path: "/newsletter/confirmed",
  robots: { index: false, follow: false },
});

type Status = "success" | "invalid" | "error";

const content: Record<
  Status,
  { label: string; heading: string; description: string; image: { src: string; alt: string; width: number; height: number } }
> = {
  success: {
    label: "Subscription Confirmed",
    heading: "You're In 🎉",
    description:
      "Thanks for confirming your email. New posts will land in your inbox as soon as they're published.",
    image: { src: "/images/assets/frances-thumbs-up-memoji.png", alt: "Frances memoji smiling and giving a peace sign", width: 310, height: 385 },
  },
  invalid: {
    label: "Link Expired",
    heading: "That Link Didn't Work 🔗",
    description:
      "This confirmation link is invalid or more than 7 days old. Sign up again and I'll send you a fresh one.",
    image: { src: "/images/assets/memoji-thinking.png", alt: "Frances memoji thinking", width: 420, height: 420 },
  },
  error: {
    label: "Something Went Wrong",
    heading: "Let's Try That Again 🔁",
    description:
      "I couldn't confirm your subscription just now. Open the link in your email again in a few minutes, or sign up again for a new one.",
    image: { src: "/images/assets/memoji-thinking.png", alt: "Frances memoji thinking", width: 420, height: 420 },
  },
};

const whatToExpect = [
  {
    emoji: "✍🏽",
    title: "New posts",
    text: "Essays and posts on engineering, careers, mentoring and building community, sent when they're published.",
  },
  {
    emoji: "📭",
    title: "No spam",
    text: "Only new writing and the occasional update. Your email is never shared or sold.",
  },
  {
    emoji: "👋🏽",
    title: "Leave anytime",
    text: "Every email has an unsubscribe link at the bottom, so you can opt out in one click.",
  },
];

const linkClass =
  "font-medium text-horchata-600 underline hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-300";

export default async function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const { status: raw } = await searchParams;
  const status: Status = raw === "invalid" || raw === "error" ? raw : "success";
  const page = content[status];
  const success = status === "success";

  return (
    <div data-pagefind-ignore="all">
      {/* Hero: light */}
      <PageHeader
        label={page.label}
        heading={page.heading}
        description={page.description}
        aside={
          <Image
            src={page.image.src}
            alt={page.image.alt}
            width={page.image.width}
            height={page.image.height}
            className="h-auto w-[160px] object-contain drop-shadow-lg sm:w-[200px] md:w-[260px]"
            priority
            fetchPriority="high"
          />
        }
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={success ? "/posts" : "/#newsletter"}
            className="rounded-full bg-horchata-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
          >
            {success ? "Browse All Posts" : "Sign Up Again"} <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700"
          >
            Back to Home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </PageHeader>

      {/* Details: dark */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          {success ? (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
                Newsletter
              </p>
              <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                What to Expect 📬
              </h2>
              <ul className="mt-10 grid gap-6 md:grid-cols-3">
                {whatToExpect.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-horchata-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800"
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-navy-900 dark:text-horchata-100">{item.title}</h3>
                    <p className="mt-2 text-sm text-navy-600 dark:text-white/70">{item.text}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
                Need a Hand
              </p>
              <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                Getting Subscribed 🤝🏽
              </h2>
              <p className="mt-4 max-w-2xl text-base text-navy-600 dark:text-white/70">
                Use the{" "}
                <Link href="/#newsletter" className={linkClass}>
                  signup form on the homepage
                </Link>{" "}
                and open the newest confirmation email, since each link works for 7 days. Still stuck?{" "}
                <Link href="/contact" className={linkClass}>
                  Get in touch
                </Link>{" "}
                and I&apos;ll add you by hand.
              </p>
            </>
          )}
        </div>
      </section>

      <ConnectCTA variant="follow" />
    </div>
  );
}
