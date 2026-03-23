import mentoringData from "@/content/mentoring-sessions.json";

const { _meta } = mentoringData as {
  _meta: {
    totalSessions: number;
    totalMinutes: number;
    uniqueMentees: number;
    byYear: Record<string, number>;
  };
};

const YEARS_COUNT = Object.keys(_meta.byYear).length;
const HOURS_LOGGED = Math.round(_meta.totalMinutes / 60);

interface MentoringStatsProps {
  /** Override total sessions count (e.g. when live sessions are merged in) */
  totalSessions?: number;
}

export function MentoringStats({ totalSessions = _meta.totalSessions }: MentoringStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { emoji: "💬", value: `${totalSessions}`, label: "Total sessions" },
        { emoji: "👩🏽‍💻", value: `${_meta.uniqueMentees}`, label: "Unique mentees" },
        { emoji: "📅", value: `${YEARS_COUNT}`, label: "Years of mentoring" },
        { emoji: "⏱️", value: `${HOURS_LOGGED}h`, label: "Hours logged" },
      ].map(({ emoji, value, label }) => (
        <div key={label} className="rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
          <p className="text-2xl" aria-hidden="true">{emoji}</p>
          <p className="mt-1 text-3xl font-bold text-horchata-700 dark:text-horchata-400">
            {value}
          </p>
          <p className="mt-0.5 text-xs text-navy-500 dark:text-white/60">{label}</p>
        </div>
      ))}
    </div>
  );
}
