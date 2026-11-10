import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { BookingParamsScrub, GoogleAdsTag, googleAdsTagEnabled } from "@/components/layout/google-ads-tag";

// Where cal.com (and the payment provider) send people once a mentoring session is
// booked and paid for. Only reachable from that redirect, so it stays out of search
// engines, the sitemap and site search.
export const metadata: Metadata = buildMetadata({
  title: "Thank You for Booking",
  description:
    "Your mentoring session with Frances Coronel is booked. Here's what happens next and how to get the most out of our time.",
  path: "/mentoring/thank-you",
  ogImage: "/images/og/mentoring.jpg",
  robots: { index: false, follow: false },
});

const nextSteps = [
  {
    emoji: "📬",
    title: "Check your inbox",
    text: "A confirmation email is on its way with the calendar invite, the video call link, and your payment receipt. Don't see it in a few minutes? Check your spam folder.",
  },
  {
    emoji: "📝",
    title: "Bring a specific goal",
    text: "One clear question or outcome works best. Have your resume, portfolio, or job posting ready to share if we're reviewing it together.",
  },
  {
    emoji: "⏰",
    title: "Show up on time",
    text: "We'll hit the ground running. Join from somewhere quiet with a working camera and mic so we can use every minute.",
  },
];

export default function MentoringThankYouPage() {
  return (
    <div data-pagefind-ignore="all">
      {/* Must stay first: strips the attendee details cal.com puts in the URL */}
      <BookingParamsScrub />
      {/* Hero — light */}
      <PageHeader
        label="Booking Confirmed"
        heading="Thank You 🎉"
        description="Your mentoring session is booked and your payment went through. I'm looking forward to meeting you and digging into what you're working on."
        aside={
          <Image
            src="/images/assets/frances-thumbs-up-memoji.png"
            alt="Frances memoji smiling and giving a peace sign"
            width={310}
            height={385}
            className="h-auto w-[160px] object-contain drop-shadow-lg sm:w-[200px] md:w-[260px]"
            priority
            fetchPriority="high"
          />
        }
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/mentoring"
            className="rounded-full bg-horchata-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
          >
            Back to Mentoring <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/essays"
            className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700"
          >
            Read the Essays <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </PageHeader>

      {/* What happens next — dark */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
            Next Steps
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            What Happens Next 🗓️
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {nextSteps.map((step) => (
              <li
                key={step.title}
                className="rounded-2xl border border-horchata-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800"
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {step.emoji}
                </span>
                <h3 className="mt-3 text-lg font-bold text-navy-900 dark:text-horchata-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-navy-600 dark:text-white/70">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-navy-600 dark:text-white/70">
            Need to reschedule? Use the link in your confirmation email. Sessions are non-refundable but can be transferred with written notice. Anything else,{" "}
            <Link
              href="/contact"
              className="font-medium text-horchata-600 underline hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-300"
            >
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      <ConnectCTA variant="follow" />
      {/* Reports the booking to Google Ads at the price of the session that was booked */}
      <GoogleAdsTag enabled={googleAdsTagEnabled()} purchase={{ halfHour: 30, hour: 65 }} />
    </div>
  );
}
