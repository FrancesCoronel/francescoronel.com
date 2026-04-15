import { Timeline } from "@/components/ui/timeline";

interface TimelineItem {
  title: string;
  subtitle: string;
  subtitleHref?: string;
  logo: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  description: string;
  linkPrefix: string;
}

interface TimelineSectionProps {
  id: string;
  label: string;
  heading: string;
  items: TimelineItem[];
  dark?: boolean;
}

export function TimelineSection({
  id,
  label,
  heading,
  items,
  dark = false,
}: TimelineSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      className={`scroll-mt-20 py-16 md:py-20 ${
        dark
          ? "border-y border-horchata-200 bg-horchata-100 dark:border-navy-700 dark:bg-navy-950"
          : ""
      }`}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
          {label}
        </p>
        <h2 className="mt-1 text-lg font-bold text-navy-900 dark:text-horchata-100 sm:text-2xl">
          {heading}
        </h2>
        <div className="mt-8">
          <Timeline items={items} />
        </div>
      </div>
    </section>
  );
}
