"use client";

import { useEffect, useMemo, useState } from "react";
import mentoringData from "@/content/mentoring-sessions.json";
import { MentoringStats } from "@/components/ui/mentoring-stats";

interface Session {
  date: string;
  name: string;
  type: string;
  eventTypeName: string;
  topic: string | null;
  source?: string;
  durationMinutes?: number;
}

// Normalize raw types to 3 display categories
function normalizeType(raw: string): "mentoring" | "interview-prep" | "community" {
  if (raw === "interview") return "interview-prep";
  if (raw === "community" || raw === "partner" || raw === "podcast") return "community";
  return "mentoring";
}

const CATEGORY_LABELS: Record<string, string> = {
  mentoring: "Mentoring",
  "interview-prep": "Interview Prep",
  community: "Community",
};

const CATEGORY_COLORS: Record<string, string> = {
  mentoring: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  "interview-prep": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  community: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
};

const SOURCE_LABELS: Record<string, string> = {
  "cal.com": "cal.com",
  formation: "Formation",
  calendly: "Calendly",
  leland: "Leland",
};

const SOURCE_COLORS: Record<string, string> = {
  "cal.com": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  formation: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  calendly: "bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300",
  leland: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const { _meta, sessions: historicalSessions } = mentoringData as {
  _meta: {
    totalSessions: number;
    totalMinutes: number;
    totalHours: number;
    uniqueMentees: number;
    byYear: Record<string, number>;
    byType: Record<string, number>;
    dateRange: { start: string; end: string };
  };
  sessions: Session[];
};

const YEAR_ORDER = Object.keys(_meta.byYear).sort();
const MAX_BY_YEAR = Math.max(...Object.values(_meta.byYear));

const ALL_YEARS = [...new Set(historicalSessions.map((s) => s.date.slice(0, 4)))].sort().reverse();

const PAGE_SIZE = 50;

export function SessionsTable() {
  const [liveSessions, setLiveSessions] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/mentoring-sessions")
      .then((r) => r.json())
      .then((d) => {
        if (d.sessions?.length) setLiveSessions(d.sessions);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const allSessions = useMemo<Session[]>(() => {
    const merged = loaded
      ? [
          ...liveSessions,
          ...historicalSessions.filter(
            (h) => !liveSessions.some((l) => l.date === h.date && l.name === h.name)
          ),
        ]
      : [...historicalSessions];
    return merged.sort((a, b) => b.date.localeCompare(a.date));
  }, [loaded, liveSessions]);

  const totalCount = _meta.totalSessions + liveSessions.length;

  // Build byYear including live sessions
  const byYear = { ..._meta.byYear };
  for (const s of liveSessions) {
    const year = s.date.slice(0, 4);
    if (!historicalSessions.some((h) => h.date === s.date && h.name === s.name)) {
      byYear[year] = (byYear[year] ?? 0) + 1;
    }
  }
  const allYears = Object.keys(byYear).sort();
  const maxCount = Math.max(...Object.values(byYear));

  const filtered = useMemo(() => {
    return allSessions.filter((s) => {
      if (yearFilter !== "all" && !s.date.startsWith(yearFilter)) return false;
      if (categoryFilter !== "all" && normalizeType(s.type) !== categoryFilter) return false;
      if (sourceFilter !== "all") {
        const src = s.source ?? "calendly";
        if (src !== sourceFilter) return false;
      }
      return true;
    });
  }, [allSessions, yearFilter, categoryFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  const allYearsWithLive = loaded
    ? [...new Set([...ALL_YEARS, ...liveSessions.map((s) => s.date.slice(0, 4))])].sort().reverse()
    : ALL_YEARS;

  return (
    <div>
      {/* Stats row */}
      <MentoringStats totalSessions={totalCount} />

      {/* Activity bar chart by year */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-navy-400 dark:text-white/40">
          Sessions per year
        </p>
        <div className="flex items-end gap-1.5">
          {allYears.map((year) => {
            const count = byYear[year] ?? 0;
            const heightPct = Math.round((count / maxCount) * 100);
            return (
              <div key={year} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-navy-400 dark:text-white/40">
                  {count}
                </span>
                <div
                  className="w-full rounded-t bg-horchata-400 dark:bg-horchata-600"
                  style={{ height: `${Math.max(4, heightPct * 0.6)}px` }}
                />
                <span className="text-[10px] text-navy-400 dark:text-white/40">
                  {year.slice(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-3">
        <select
          value={yearFilter}
          onChange={(e) => { setYearFilter(e.target.value); resetPage(); }}
          className="rounded-lg border border-horchata-200 bg-white px-3 py-1.5 text-sm text-navy-700 dark:border-navy-700 dark:bg-navy-800 dark:text-horchata-200"
        >
          <option value="all">All years</option>
          {allYearsWithLive.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); resetPage(); }}
          className="rounded-lg border border-horchata-200 bg-white px-3 py-1.5 text-sm text-navy-700 dark:border-navy-700 dark:bg-navy-800 dark:text-horchata-200"
        >
          <option value="all">All categories</option>
          <option value="mentoring">Mentoring</option>
          <option value="interview-prep">Interview Prep</option>
          <option value="community">Community</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); resetPage(); }}
          className="rounded-lg border border-horchata-200 bg-white px-3 py-1.5 text-sm text-navy-700 dark:border-navy-700 dark:bg-navy-800 dark:text-horchata-200"
        >
          <option value="all">All sources</option>
          <option value="calendly">Calendly</option>
          <option value="formation">Formation</option>
          <option value="cal.com">cal.com</option>
          <option value="leland">Leland</option>
        </select>

        <span className="ml-auto self-center text-sm text-navy-500 dark:text-white/50">
          {filtered.length} sessions
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-horchata-200 dark:border-navy-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-horchata-200 bg-horchata-50 text-left dark:border-navy-700 dark:bg-navy-800">
              <th className="px-4 py-3 font-semibold text-navy-700 dark:text-horchata-200">Date</th>
              <th className="px-4 py-3 font-semibold text-navy-700 dark:text-horchata-200">Name</th>
              <th className="px-4 py-3 font-semibold text-navy-700 dark:text-horchata-200">Topic</th>
              <th className="px-4 py-3 font-semibold text-navy-700 dark:text-horchata-200">Category</th>
              <th className="px-4 py-3 font-semibold text-navy-700 dark:text-horchata-200">Source</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((session, i) => {
              const src = session.source ?? "calendly";
              const topic = session.topic ?? (src === "formation" ? session.eventTypeName : null);
              const category = normalizeType(session.type);
              return (
                <tr
                  key={`${session.date}-${i}`}
                  className="border-b border-horchata-100 last:border-0 odd:bg-white even:bg-horchata-50/50 dark:border-navy-700 dark:odd:bg-navy-900 dark:even:bg-navy-800/50"
                >
                  <td className="whitespace-nowrap px-4 py-2.5 text-navy-500 dark:text-white/50">
                    {formatDate(session.date)}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-navy-900 dark:text-horchata-100">
                    {session.name}
                  </td>
                  <td className="max-w-xs px-4 py-2.5 text-navy-500 dark:text-white/50">
                    {topic ? (
                      <span className="line-clamp-1 cursor-help" title={topic}>{topic}</span>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[category]}`}>
                      {CATEGORY_LABELS[category]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${SOURCE_COLORS[src] ?? SOURCE_COLORS["calendly"]}`}>
                      {SOURCE_LABELS[src] ?? src}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-horchata-200 bg-white px-5 py-2.5 text-navy-700 disabled:opacity-40 dark:border-navy-700 dark:bg-navy-800 dark:text-horchata-200"
          >
            ← Previous
          </button>
          <span className="text-navy-500 dark:text-white/50">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-horchata-200 bg-white px-5 py-2.5 text-navy-700 disabled:opacity-40 dark:border-navy-700 dark:bg-navy-800 dark:text-horchata-200"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
