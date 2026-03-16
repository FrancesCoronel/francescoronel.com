"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PagefindResult {
  id: string;
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    image?: string;
  };
  sub_results?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

interface PagefindResponse {
  results: Array<{
    id: string;
    data: () => Promise<PagefindResult>;
  }>;
}

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pagefind, setPagefind] = useState<{
    search: (q: string) => Promise<PagefindResponse>;
  } | null>(null);
  const [pagefindError, setPagefindError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();

  // Load Pagefind
  useEffect(() => {
    (async () => {
      try {
        const pf = await import(
          // @ts-expect-error — Pagefind is generated at build time
          /* webpackIgnore: true */ "/pagefind/pagefind.js"
        );
        await pf.init();
        setPagefind(pf);
      } catch {
        setPagefindError(true);
      }
    })();
  }, []);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Search
  useEffect(() => {
    if (!pagefind || !query.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await pagefind.search(query);
        const data = await Promise.all(
          response.results.slice(0, 12).map((r) => r.data())
        );
        setResults(
          data.map((d) => ({
            url: d.url
              .replace(/\.html$/, "")
              .replace(/\/index$/, "")
              .replace(/^\/?/, "/"),
            title: d.meta?.title || d.url,
            excerpt: d.excerpt,
          }))
        );
        setSelectedIndex(0);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, pagefind]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].url);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-[10vh] w-full max-w-2xl -translate-x-1/2 px-4">
        <div className="overflow-hidden rounded-2xl border border-horchata-200 bg-white shadow-2xl dark:border-navy-600 dark:bg-navy-800">
          {/* Search input */}
          <div className="flex items-center border-b border-horchata-200 px-4 dark:border-navy-700">
            <svg
              className="h-5 w-5 flex-shrink-0 text-navy-400 dark:text-horchata-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search all content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent px-3 py-4 text-sm text-navy-900 placeholder-navy-400 outline-none dark:text-horchata-100 dark:placeholder-horchata-500"
            />
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-horchata-300 border-t-horchata-600" />
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-2 hidden rounded-md bg-horchata-100 px-2 py-1 text-xs font-medium text-navy-500 sm:block dark:bg-navy-700 dark:text-horchata-400"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <ul>
                  {results.map((r, i) => (
                    <li key={`${r.url}-${i}`}>
                      <Link
                        href={r.url}
                        onClick={onClose}
                        className={`block border-b border-horchata-100 px-4 py-3 transition-colors last:border-b-0 dark:border-navy-700 ${
                          i === selectedIndex
                            ? "bg-horchata-50 dark:bg-navy-700"
                            : "hover:bg-horchata-50 dark:hover:bg-navy-700"
                        }`}
                      >
                        <p className="text-sm font-semibold text-navy-900 dark:text-horchata-100">
                          {r.title}
                        </p>
                        <p
                          className="mt-1 line-clamp-2 text-xs text-navy-500 dark:text-horchata-400"
                          dangerouslySetInnerHTML={{ __html: r.excerpt }}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                !loading && (
                  pagefindError ? (
                    <p className="px-4 py-8 text-center text-sm text-navy-500 dark:text-horchata-400">
                      Search requires a production build. Run{" "}
                      <code className="rounded bg-horchata-100 px-1 dark:bg-navy-700">npm run build</code>{" "}
                      to enable search.
                    </p>
                  ) : pagefind ? (
                    <p className="px-4 py-8 text-center text-sm text-navy-500 dark:text-horchata-400">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  ) : (
                    <p className="px-4 py-8 text-center text-sm text-navy-500 dark:text-horchata-400">
                      Loading search index&hellip;
                    </p>
                  )
                )
              )}
            </div>
          )}

          {/* Footer hint */}
          {!query.trim() && (
            <div className="px-4 py-6 text-center text-xs text-navy-400 dark:text-horchata-500">
              Search across all 844+ pages — blog posts, projects, talks, and
              more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track if we're in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-full p-2 text-navy-500 transition-colors hover:bg-horchata-100 hover:text-navy-700 dark:text-horchata-400 dark:hover:bg-navy-700 dark:hover:text-horchata-200"
        aria-label="Search (⌘K)"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Portal the overlay to document.body so it escapes the nav stacking context */}
      {mounted && open && createPortal(
        <SearchOverlay onClose={close} />,
        document.body
      )}
    </>
  );
}
