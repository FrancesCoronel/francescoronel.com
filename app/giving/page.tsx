import type { Metadata } from "next";
import giving from "@/content/giving.json";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { OrgLogo } from "@/components/ui/org-logo";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Where I Give",
  description:
    "The nonprofits, causes and campaigns Frances Coronel supports with her money and her time.",
  path: "/giving",
});

interface GivingOrg {
  name: string;
  url: string;
  cta: string;
  status: string;
  description: string;
  logo?: string;
  emoji?: string;
}

interface GivingGroup {
  label: string;
  heading: string;
  description?: string;
  orgs: GivingOrg[];
}

const DARK_SECTION =
  "border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950";
const LIGHT_SECTION = "bg-horchata-50 py-16 md:py-20 dark:bg-navy-900";

/** Sections after the page header alternate dark, light, dark, ... */
const sectionClass = (index: number) =>
  index % 2 === 0 ? DARK_SECTION : LIGHT_SECTION;

function GivingCard({ org }: { org: GivingOrg }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-horchata-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center gap-4">
        {org.emoji ? (
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-horchata-100 text-2xl dark:bg-navy-700"
            aria-hidden="true"
          >
            {org.emoji}
          </span>
        ) : (
          <OrgLogo
            src={org.logo}
            name={org.name}
            size={48}
            decorative
            className="h-12 w-12 flex-shrink-0 rounded-xl object-contain"
            avatarClassName="flex-shrink-0"
          />
        )}
        <span className="inline-flex items-center rounded-full bg-horchata-200 px-2.5 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-600 dark:text-horchata-100">
          {org.status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-navy-900 dark:text-horchata-100">
        {org.name}
      </h3>
      <p className="flex-1 text-sm text-navy-600 dark:text-white/70">
        {org.description}
      </p>
      <a
        href={org.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold text-horchata-600 hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-200"
      >
        {org.cta} →
      </a>
    </article>
  );
}

export default function GivingPage() {
  const groups = giving as GivingGroup[];

  return (
    <>
      <PageHeader
        label="Giving Back"
        heading="Where I Give 💛"
        description="Wealth in the US is more concentrated than at any point in modern records. I can't fix that alone, but I can put my money where my values are. These are the organizations I've supported with my dollars and my time, shared so giving feels normal, not secret."
      />

      {groups.map((group, i) => (
        <section
          key={group.label}
          className={sectionClass(i)}
        >
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
              {group.label}
            </p>
            <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
              {group.heading}
            </h2>
            {group.description && (
              <p className="mt-4 max-w-2xl text-sm text-navy-600 dark:text-white/70">
                {group.description}
              </p>
            )}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.orgs.map((org) => (
                <GivingCard key={org.name} org={org} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className={sectionClass(groups.length)}>
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
            Your Turn
          </p>
          <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
            Make Your Giving Go Further 🙌🏽
          </h2>
          <p className="mt-4 max-w-2xl text-base text-navy-600 dark:text-white/70">
            Small monthly gifts help nonprofits plan ahead. And if your employer
            matches donations, use it. It doubles your impact for free.
          </p>
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
