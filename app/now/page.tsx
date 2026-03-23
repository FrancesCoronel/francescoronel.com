import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = buildMetadata({
  title: "Now",
  description:
    "What Frances Coronel is focused on right now — current projects, learning, and life.",
  path: "/now",
});

// Last updated date — update this when you update the page content
const LAST_UPDATED = "March 2026";

export default function NowPage() {
  return (
    <>
      <PageHeader
        label="Right Now"
        heading="Now 📍"
        description={`A snapshot of what I'm currently focused on. Last updated: ${LAST_UPDATED}.`}
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
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="grid gap-8 md:grid-cols-3">

            {/* Work */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-horchata-100">
                Work 💼
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-navy-700 dark:text-horchata-200">
                <li>
                  Transitioning from the <strong>Sidebar Systems team</strong> to the <strong>DevXP team at Slack</strong> — shifting focus toward developer experience and tooling.
                </li>
                <li>
                  Excited to bring everything I learned in sidebar architecture and AI adoption into building better tools for engineers.
                </li>
              </ul>
            </div>

            {/* Side Projects */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-horchata-100">
                Side Projects 🛠️
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-navy-700 dark:text-horchata-200">
                <li>
                  Rebuilding <strong>this website</strong> from the ground up — migrating from Webflow to a fully self-owned Next.js stack.
                </li>
                <li>
                  Going deep on <strong>AI-assisted development workflows</strong> — integrating Claude Code and MCP servers into my daily engineering practice.
                </li>
              </ul>
            </div>

            {/* Personal */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-horchata-100">
                Personal 🌱
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-navy-700 dark:text-horchata-200">
                <li>
                  Spending free time with my two corgis <strong>Luna and Sueño</strong> 🐾 and my boyfriend{" "}
                  <a
                    href="https://www.linkedin.com/in/andrew-rodriguez/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:decoration-navy-500 dark:hover:text-horchata-400"
                  >
                    Andrew
                  </a>{" "}
                  — living in the East Bay.
                </li>
                <li>
                  Pursuing my <strong>PADI Master Scuba Diver certification</strong> 🤿 — less than 2% of divers reach this level. ~100 dives logged and counting.
                </li>
              </ul>
            </div>

          </div>

          <p className="mt-12 text-sm text-navy-400 dark:text-horchata-500">
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
