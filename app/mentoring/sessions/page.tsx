import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SessionsTable } from "@/components/ui/sessions-table";

export const metadata: Metadata = buildMetadata({
  title: "Mentoring Sessions",
  description: "Browse 820+ mentoring sessions with software engineers — filterable by year, type, and source.",
  path: "/mentoring/sessions",
});

export default function MentoringSessionsPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
        Mentoring
      </p>
      <h1 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
        Sessions Log 🗂️
      </h1>
      <p className="mt-2 text-navy-500 dark:text-white/60">
        Every session I can account for — Calendly (2015–2023), Formation (2023–present), and cal.com (live). Names are visible in your browser but not indexed by search engines.
      </p>
      <div className="mt-8">
        <SessionsTable />
      </div>
    </div>
  );
}
