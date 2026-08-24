import Link from "next/link";

interface PrevNextItem {
  slug: string;
  title: string;
}

interface PrevNextNavProps {
  prev: PrevNextItem | null;
  next: PrevNextItem | null;
  basePath: string;
  allLabel?: string;
}

export function PrevNextNav({ prev, next, basePath, allLabel }: PrevNextNavProps) {
  const label = allLabel ?? basePath.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "All";
  const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div>
      <Link
        href={basePath}
        className="inline-flex items-center gap-1.5 text-sm text-horchata-700 transition-colors hover:text-horchata-900 dark:text-horchata-400 dark:hover:text-horchata-200"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
        All {displayLabel}
      </Link>

      {(prev || next) && (
        <div className="mt-6 border-t border-horchata-200 dark:border-navy-700">
          <div className="grid grid-cols-1 divide-y divide-horchata-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-navy-700">
            <div className="py-6 pr-0 sm:pr-8">
              {prev && (
                <Link
                  href={`${basePath}/${encodeURIComponent(prev.slug)}`}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-navy-600 dark:text-white/60">
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
                  href={`${basePath}/${encodeURIComponent(next.slug)}`}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-navy-600 dark:text-white/60">
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
      )}
    </div>
  );
}
