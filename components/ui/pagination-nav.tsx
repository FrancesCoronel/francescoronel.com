"use client";

interface PaginationNavProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export function PaginationNav({ page, totalPages, onPage }: PaginationNavProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => {
      if (p === 1 || p === totalPages) return true;
      if (Math.abs(p - page) <= 2) return true;
      return false;
    })
    .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
      acc.push(p);
      return acc;
    }, []);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="cursor-pointer rounded-lg border border-horchata-200 px-3 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-500 dark:hover:bg-horchata-500 dark:hover:text-navy-900"
        aria-label="Previous"
      >
        <span aria-hidden="true" className="sm:hidden">&larr;</span>
        <span aria-hidden="true" className="hidden sm:inline">Previous</span>
      </button>

      {pages.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-navy-600 dark:text-horchata-500">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPage(item)}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              page === item
                ? "border-horchata-500 bg-horchata-500 text-navy-900 dark:border-horchata-500 dark:bg-horchata-500 dark:text-navy-900"
                : "border-horchata-200 text-navy-700 hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-500 dark:hover:bg-horchata-500 dark:hover:text-navy-900"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="cursor-pointer rounded-lg border border-horchata-200 px-3 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-500 dark:hover:bg-horchata-500 dark:hover:text-navy-900"
        aria-label="Next"
      >
        <span aria-hidden="true" className="sm:hidden">&rarr;</span>
        <span aria-hidden="true" className="hidden sm:inline">Next</span>
      </button>
    </nav>
  );
}
