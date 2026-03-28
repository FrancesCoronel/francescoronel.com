import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = buildMetadata({
  title: "Now",
  description:
    "What Frances Coronel is focused on right now: current projects, learning, and life.",
  path: "/now",
});

const entries = [
  {
    date: "March 2026",
    id: "march-2026",
    sections: [
      {
        emoji: "💼",
        label: "Work",
        items: [
          <>
            Transitioning from the <strong>Sidebar Systems team</strong> to the{" "}
            <strong>DevXP team at Slack</strong>, shifting focus toward developer
            experience and tooling.
          </>,
          <>
            Bringing everything learned in sidebar architecture and AI adoption
            into building better tools for engineers.
          </>,
        ],
      },
      {
        emoji: "🛠️",
        label: "Side Projects",
        items: [
          <>
            Rebuilding <strong>this website</strong> from the ground up,
            migrating from Webflow to a fully self-owned Next.js stack.
          </>,
          <>
            Going deep on <strong>AI-assisted development workflows</strong>,
            integrating Claude Code and MCP servers into my daily engineering
            practice.
          </>,
        ],
      },
      {
        emoji: "🌱",
        label: "Personal",
        items: [
          <>
            Spending free time with my two corgis{" "}
            <strong>Luna and Sueño</strong> 🐾 and my boyfriend{" "}
            <a
              href="https://www.linkedin.com/in/andrew-rodriguez/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:decoration-navy-500 dark:hover:text-horchata-400"
            >
              Andrew
            </a>
            , living in the East Bay.
          </>,
          <>
            Pursuing my{" "}
            <strong>PADI Master Scuba Diver certification</strong> 🤿, less than
            2% of divers reach this level. ~100 dives logged and counting.
          </>,
        ],
      },
    ],
  },
];

export default function NowPage() {
  return (
    <>
      <PageHeader
        label="Right Now"
        heading="Now 📍"
        description="A snapshot of what I'm currently focused on, updated whenever something changes."
        aside={
          <Image
            src="/images/assets/memoji-laptop.png"
            alt=""
            width={256}
            height={256}
            className="h-48 w-48 object-contain drop-shadow-lg md:h-56 md:w-56"
            aria-hidden="true"
          />
        }
      />

      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-3xl px-6">

          {/* Changelog entries */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 left-0 hidden h-full w-px bg-horchata-300 dark:bg-navy-600 sm:block" aria-hidden="true" />

            <div className="space-y-16">
              {entries.map((entry) => (
                <div key={entry.id} id={entry.id} className="relative sm:pl-10">
                  {/* Date dot */}
                  <div className="absolute -left-1.5 top-1 hidden h-3 w-3 rounded-full bg-horchata-400 ring-4 ring-horchata-100 dark:bg-horchata-500 dark:ring-navy-950 sm:block" aria-hidden="true" />

                  {/* Date label */}
                  <p className="mb-6 text-xs font-bold uppercase tracking-widest text-horchata-800 dark:text-horchata-400">
                    {entry.date}
                  </p>

                  {/* Sections */}
                  <div className="space-y-8">
                    {entry.sections.map((section) => (
                      <div key={section.label}>
                        <h2 className="flex items-center gap-1.5 text-base font-bold text-navy-900 dark:text-horchata-100">
                          <span>{section.emoji}</span>
                          {section.label}
                        </h2>
                        <ul className="mt-3 list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-navy-700 dark:text-horchata-200">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-14 text-sm text-navy-500 dark:text-horchata-400">
            This is a{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:decoration-navy-500 dark:hover:text-horchata-400"
            >
              /now page
            </a>
            . If you have a website, you should make one too.
          </p>
        </div>
      </section>

      <ConnectCTA />
    </>
  );
}
