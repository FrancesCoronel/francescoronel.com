import Link from "next/link";

interface PrevNextItem {
  slug: string;
  title: string;
}

interface PrevNextNavProps {
  prev: PrevNextItem | null;
  next: PrevNextItem | null;
  basePath: string;
}

export function PrevNextNav({ prev, next, basePath }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="border-t border-horchata-200 dark:border-navy-700">
      <div className="grid grid-cols-1 divide-y divide-horchata-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-navy-700">
        <div className="py-6 pr-0 sm:pr-8">
          {prev && (
            <Link
              href={`${basePath}/${prev.slug}`}
              className="group flex flex-col gap-1"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-navy-400 dark:text-white/40">
                ← Previous
              </span>
              <span className="text-sm font-medium text-navy-700 transition-colors group-hover:text-horchata-700 dark:text-white/70 dark:group-hover:text-horchata-400 line-clamp-2">
                {prev.title}
              </span>
            </Link>
          )}
        </div>
        <div className="py-6 pl-0 text-left sm:pl-8 sm:text-right">
          {next && (
            <Link
              href={`${basePath}/${next.slug}`}
              className="group flex flex-col gap-1"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-navy-400 dark:text-white/40">
                Next →
              </span>
              <span className="text-sm font-medium text-navy-700 transition-colors group-hover:text-horchata-700 dark:text-white/70 dark:group-hover:text-horchata-400 line-clamp-2">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
