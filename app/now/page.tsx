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

      <section className="bg-horchata-100 py-16 md:py-20 dark:bg-navy-800">
        <div className="mx-auto max-w-3xl px-6 space-y-12">

          {/* Work */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Work 💼
            </h2>
            <ul className="mt-4 space-y-3 text-navy-700 dark:text-horchata-200">
              <li>
                Currently on the <strong>Sidebar Systems team at Slack</strong> (within Messaging), focused on building the best-in-class messaging platform — notifications, sidebar architecture, and the systems that power how teams communicate every day.
              </li>
              <li>
                Continuing to mentor engineers through <strong>Formation</strong> — behavioral mock interviews and seed development sessions.
              </li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Learning 📚
            </h2>
            <ul className="mt-4 space-y-3 text-navy-700 dark:text-horchata-200">
              <li>
                Pursuing my <strong>PADI Master Scuba Diver certification</strong> 🤿 — less than 2% of divers ever reach this level. I first fell in love with scuba in February 2023 when I spotted my first Garibaldi fish amongst the sea kelp in Catalina. Since then I&apos;ve logged ~100 dives and earned my Open Water, Advanced, and Rescue certs. The Master Diver course is a long journey but I&apos;m so excited for the challenge.
              </li>
              <li>
                Going deep on <strong>AI-assisted development workflows</strong> — integrating Claude Code and MCP servers into my daily engineering practice.
              </li>
            </ul>
          </div>

          {/* Building */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Building 🛠️
            </h2>
            <ul className="mt-4 space-y-3 text-navy-700 dark:text-horchata-200">
              <li>
                Rebuilding <strong>this website</strong> from the ground up — migrating from Webflow to a fully self-owned Next.js stack with full data ownership.
              </li>
            </ul>
          </div>

          {/* Life */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Life 🌱
            </h2>
            <ul className="mt-4 space-y-3 text-navy-700 dark:text-horchata-200">
              <li>
                Spending most of my free time with my two corgis <strong>Luna and Sueño</strong> 🐾 and my boyfriend{" "}
                <a
                  href="https://www.linkedin.com/in/andrew-rodriguez/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-600 dark:decoration-navy-500 dark:hover:text-horchata-400"
                >
                  Andrew
                </a>{" "}
                — living in the East Bay.
              </li>
              <li>
                Honoring my father&apos;s legacy and spending quality time with family.
              </li>
            </ul>
          </div>

          <p className="text-sm text-navy-400 dark:text-horchata-500">
            This is a{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-600 dark:decoration-navy-500 dark:hover:text-horchata-400"
            >
              /now page
            </a>
            , inspired by Derek Sivers. If you have a website, you should make one too.
          </p>
        </div>
      </section>

      <ConnectCTA />
    </>
  );
}
