import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { formatPressDate, getPressGroups, type PressItem } from "@/lib/press";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Press & Elsewhere",
  description:
    "Podcasts, interviews, features and citations of Frances Coronel, plus her writing and profiles on other sites.",
  path: "/press",
});

const DARK_SECTION =
  "border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950";
const LIGHT_SECTION = "bg-horchata-50 py-16 md:py-20 dark:bg-navy-900";

/** Sections after the page header alternate dark, light, dark, ... */
const sectionClass = (index: number) =>
  index % 2 === 0 ? DARK_SECTION : LIGHT_SECTION;

const linkClass =
  "text-sm font-bold text-horchata-600 hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-200";

function PressCard({ item }: { item: PressItem }) {
  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-horchata-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800">
      <p className="text-xs font-medium text-navy-600 dark:text-horchata-400">
        {item.outlet}
        {item.date && (
          <>
            {" · "}
            <time dateTime={item.date}>{formatPressDate(item.date)}</time>
          </>
        )}
      </p>
      <h3 className="text-lg font-bold text-navy-900 dark:text-horchata-100">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-horchata-700 dark:hover:text-horchata-300"
        >
          {item.title}
        </a>
      </h3>
      <p className="flex-1 text-sm text-navy-600 dark:text-white/70">
        {item.description}
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {item.post && (
          <li>
            <Link href={`/posts/${item.post}`} className={linkClass}>
              My post about it →
            </Link>
          </li>
        )}
        {item.links?.map((link) => (
          <li key={link.url}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {link.label} →
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PressPage() {
  const groups = getPressGroups();

  return (
    <>
      <PageHeader
        label="Press"
        heading="Press & Elsewhere 📣"
        description="Podcasts I've been on, interviews and features, places my work has been cited, and where else you can find me online."
      />

      {groups.map((group, i) => (
        <section key={group.label} className={sectionClass(i)}>
          <div className="mx-auto max-w-[var(--container-max)] px-6">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
              {group.label}
            </p>
            <h2 className="mt-1 text-xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
              {group.heading}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <PressCard key={item.url} item={item} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <ConnectCTA variant="speaking" />
    </>
  );
}
