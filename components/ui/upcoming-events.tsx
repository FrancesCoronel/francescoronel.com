"use client";

interface UpcomingEvent {
  org: string;
  talk: string;
  date: string;
  url: string;
  description: string;
}

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter((e) => new Date(e.date + "T23:59:59") >= today);
  const past = events.filter((e) => new Date(e.date + "T23:59:59") < today);

  if (upcoming.length === 0 && past.length === 0) return null;

  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-12 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        {upcoming.length > 0 && (
          <>
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
              Upcoming
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Next Up 📅
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <a
                  key={event.url}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-horchata-300 bg-white p-5 transition-all hover:border-horchata-500 hover:shadow-lg dark:border-navy-600 dark:bg-navy-800 dark:hover:border-navy-500"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Upcoming
                    </span>
                    <span className="text-xs text-navy-400 dark:text-white/40">{event.org}</span>
                  </div>
                  <p className="mt-3 font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100">
                    {event.talk}
                  </p>
                  <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                    {event.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-horchata-700 dark:text-horchata-400">
                    📅 {formatEventDate(event.date)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-horchata-600 dark:text-horchata-400">
                    Register →
                  </p>
                </a>
              ))}
            </div>
          </>
        )}

        {past.length > 0 && (
          <div className={upcoming.length > 0 ? "mt-10" : ""}>
            {upcoming.length === 0 && (
              <>
                <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                  Upcoming
                </p>
                <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
                  Next Up 📅
                </h2>
              </>
            )}
            <p className={`text-sm font-semibold text-navy-500 dark:text-horchata-400 ${upcoming.length > 0 ? "mt-6 mb-3" : "mt-4 mb-3"}`}>
              Recently Past
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <a
                  key={event.url}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-horchata-200 bg-white/60 p-5 transition-all hover:border-horchata-400 hover:shadow-md dark:border-navy-700 dark:bg-navy-800/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-horchata-100 px-2.5 py-0.5 text-xs font-medium text-horchata-700 dark:bg-navy-700 dark:text-horchata-400">
                      Past
                    </span>
                    <span className="text-xs text-navy-400 dark:text-white/40">{event.org}</span>
                  </div>
                  <p className="mt-3 font-bold text-navy-700 group-hover:text-horchata-600 dark:text-horchata-200">
                    {event.talk}
                  </p>
                  <p className="mt-1 text-sm text-navy-500 dark:text-white/60">
                    {event.description}
                  </p>
                  <p className="mt-3 text-xs text-navy-400 dark:text-horchata-500">
                    📅 {formatEventDate(event.date)}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
