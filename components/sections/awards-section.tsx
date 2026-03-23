import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Award {
  slug: string;
  title: string;
  date: string;
  url?: string;
  organization?: string;
}

interface AwardsSectionProps {
  awards: Award[];
  blogPostMap?: Record<string, string>;
}


function AwardCard({
  award,
  blogSlug,
}: {
  award: Award;
  blogSlug?: string;
}) {
  const isExternal = !blogSlug && !!award.url;
  const href = blogSlug ? `/blog/${blogSlug}` : award.url || `/awards/${award.slug}`;

  const inner = (
    <div className="flex items-start gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-bold leading-snug text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
          {award.title}
          {isExternal && (
            <svg
              className="ml-1.5 inline h-3.5 w-3.5 text-navy-400 transition-colors group-hover:text-horchata-700 dark:text-navy-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          )}
        </h3>
        {award.organization && (
          <p className="mt-0.5 text-xs font-medium text-navy-500 dark:text-white/50">
            {award.organization}
          </p>
        )}
        <p className="mt-1 text-xs text-navy-500 dark:text-horchata-400">
          {formatDate(award.date)}
        </p>
      </div>
    </div>
  );

  const linkedClassName =
    "group rounded-2xl border border-horchata-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-navy-700 dark:bg-navy-800";
  const plainClassName =
    "rounded-2xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800";

  if (!href) {
    return <div className={plainClassName}>{inner}</div>;
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkedClassName}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={linkedClassName}>
      {inner}
    </Link>
  );
}

export function AwardsSection({ awards, blogPostMap = {} }: AwardsSectionProps) {
  if (awards.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
          Recognition
        </p>
        <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
          Awards 🏆
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award) => (
            <AwardCard
              key={award.slug}
              award={award}
              blogSlug={blogPostMap[award.slug]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
