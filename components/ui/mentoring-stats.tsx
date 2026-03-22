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
      <div className="rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
        <p className="text-3xl font-bold text-horchata-700 dark:text-horchata-400">
          {totalSessions}+
        </p>
        <p className="mt-0.5 text-xs text-navy-500 dark:text-white/60">Total sessions</p>
      </div>
      <div className="rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
        <p className="text-3xl font-bold text-horchata-700 dark:text-horchata-400">
          {_meta.uniqueMentees}+
        </p>
        <p className="mt-0.5 text-xs text-navy-500 dark:text-white/60">Unique mentees</p>
      </div>
      <div className="rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
        <p className="text-3xl font-bold text-horchata-700 dark:text-horchata-400">
          {YEARS_COUNT}
        </p>
        <p className="mt-0.5 text-xs text-navy-500 dark:text-white/60">Years of mentoring</p>
      </div>
      <div className="rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
        <p className="text-3xl font-bold text-horchata-700 dark:text-horchata-400">
          {HOURS_LOGGED}h
        </p>
        <p className="mt-0.5 text-xs text-navy-500 dark:text-white/60">Hours logged</p>
      </div>
    </div>
  );
}
