"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import mentoringData from "@/content/mentoring-sessions.json";
import { MentoringStats } from "@/components/ui/mentoring-stats";

interface Session {
  date: string;
  name: string;
  type: string;
  eventTypeName: string;
  topic?: string | null;
  source?: string;
}

const { _meta, sessions: historicalSessions } = mentoringData as unknown as {
  _meta: {
    totalSessions: number;
    byYear: Record<string, number>;
    byType: Record<string, number>;
    dateRange: { start: string; end: string };
  };
  sessions: Session[];
};

export function MentoringSessionsFeed() {
  const [liveSessions, setLiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch("/api/mentoring-sessions")
      .then((r) => r.json())
      .then((d) => {
        if (d.sessions?.length) setLiveSessions(d.sessions);
      })
      .catch(() => {});
  }, []);

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

  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
          Track Record
        </p>
        <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
          Mentoring Sessions 📈
        </h2>

        {/* Stats row */}
        <div className="mt-6">
          <MentoringStats totalSessions={totalCount} />
        </div>

        {/* Activity bar chart by year */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-navy-600 dark:text-white/60">
            Sessions per year
          </p>
          <div className="flex items-end gap-1.5">
            {allYears.map((year) => {
              const count = byYear[year] ?? 0;
              const heightPct = Math.round((count / maxCount) * 100);
              return (
                <div key={year} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-navy-600 dark:text-white/60">
                    {count}
                  </span>
                  <div
                    className="w-full rounded-t bg-horchata-400 dark:bg-horchata-600"
                    style={{ height: `${Math.max(4, heightPct * 0.6)}px` }}
                  />
                  <span className="text-[10px] text-navy-600 dark:text-white/60">
                    {year.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Link to full sessions page */}
        <div className="mt-8">
          <Link
            href="/mentoring/sessions"
            className="inline-flex items-center gap-2 rounded-xl border border-horchata-200 bg-white px-5 py-3 text-sm font-medium text-navy-700 transition-colors hover:bg-horchata-50 dark:border-navy-700 dark:bg-navy-900 dark:text-horchata-200 dark:hover:bg-navy-800"
          >
            Browse all {totalCount}+ sessions →
          </Link>
        </div>
      </div>
    </section>
  );
}
