"use client";

interface PaginationNavProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export function PaginationNav({ page, totalPages, onPage }: PaginationNavProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-4">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="cursor-pointer rounded-lg border border-horchata-300 px-4 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-400 dark:hover:bg-horchata-400 dark:hover:text-navy-900"
      >
        Previous
      </button>
      <span className="text-sm text-navy-500 dark:text-horchata-400">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="cursor-pointer rounded-lg border border-horchata-300 px-4 py-2 text-sm font-medium text-navy-700 transition-all hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:text-white/70 dark:hover:border-horchata-400 dark:hover:bg-horchata-400 dark:hover:text-navy-900"
      >
        Next
      </button>
    </nav>
  );
}
