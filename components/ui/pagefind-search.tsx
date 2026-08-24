"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

export function PagefindSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefind, setPagefind] = useState<{
    search: (q: string) => Promise<PagefindResponse>;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Load Pagefind on first focus
  const loadPagefind = useCallback(async () => {
    if (pagefind) return;
    try {
      const pf = await import(
        // @ts-expect-error — Pagefind is generated at build time
        /* webpackIgnore: true */ "/pagefind/pagefind.js"
      );
      await pf.init();
      setPagefind(pf);
    } catch {
      // Pagefind not available in dev mode — silently fail
    }
  }, [pagefind]);

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
          response.results.slice(0, 10).map((r) => r.data())
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
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, pagefind]);

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-600 dark:text-horchata-500"
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
          type="search"
          placeholder="Search all content..."
          value={query}
          onFocus={loadPagefind}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-horchata-200 bg-white py-3 pl-10 pr-4 text-sm text-navy-900 placeholder-navy-400 transition-colors focus:border-horchata-400 focus:outline-none focus:ring-2 focus:ring-horchata-200 dark:border-navy-600 dark:bg-navy-800 dark:text-horchata-100 dark:placeholder-horchata-500 dark:focus:border-navy-400 dark:focus:ring-navy-600"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-horchata-300 border-t-horchata-600" />
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {query.trim() && (results.length > 0 || (!loading && pagefind)) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-horchata-200 bg-white shadow-xl dark:border-navy-600 dark:bg-navy-800">
          {results.length > 0 ? (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.url}-${i}`}>
                  <Link
                    href={r.url}
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                    }}
                    className="block border-b border-horchata-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-horchata-50 dark:border-navy-700 dark:hover:bg-navy-700"
                  >
                    <p className="text-sm font-semibold text-navy-900 dark:text-horchata-100">
                      {r.title}
                    </p>
                    <p
                      className="mt-1 line-clamp-2 text-xs text-navy-600 dark:text-horchata-400"
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            !loading && (
              <p className="px-4 py-6 text-center text-sm text-navy-600 dark:text-horchata-400">
                No results for &ldquo;{query}&rdquo;
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
