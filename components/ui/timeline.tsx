import Link from "next/link";
import { OrgLogo } from "@/components/ui/org-logo";
import { formatDateRange } from "@/lib/utils";

interface TimelineItem {
  title: string;
  subtitle: string;
  subtitleHref?: string;
  logo: string;
  orgUrl?: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  description: string;
  linkPrefix: string;
}

export function Timeline({ items, dark }: { items: TimelineItem[]; dark?: boolean }) {
  return (
    <div className={`relative space-y-8 sm:space-y-10 sm:pl-16 sm:before:absolute sm:before:left-6 sm:before:top-0 sm:before:h-full sm:before:w-0.5 ${dark ? "sm:before:bg-navy-700" : "sm:before:bg-horchata-200 dark:sm:before:bg-navy-700"}`}>
      {items.map((item) => (
        <div key={item.slug} className="relative">
          {/* Mobile logo: inline above content */}
          <div className={`mb-2 flex h-10 w-10 overflow-hidden rounded-full border-2 sm:hidden ${dark ? "border-horchata-600 bg-navy-700" : "border-horchata-400 bg-white dark:border-horchata-600 dark:bg-navy-700"}`}>
            <OrgLogo
              src={item.logo}
              orgUrl={item.orgUrl}
              name={item.subtitle}
              size={40}
              className="h-full w-full rounded-full object-contain p-1"
              avatarClassName={`h-full w-full text-xs font-bold ${dark ? "text-horchata-400" : "text-horchata-700 dark:text-horchata-400"}`}
            />
          </div>
          {/* Desktop: Dot on the timeline */}
          <div className={`hidden sm:block absolute -left-16 top-0 h-12 w-12 overflow-hidden rounded-full border-2 ${dark ? "border-horchata-600 bg-navy-700" : "border-horchata-400 bg-white dark:border-horchata-600 dark:bg-navy-700"}`}>
            <OrgLogo
              src={item.logo}
              orgUrl={item.orgUrl}
              name={item.subtitle}
              size={48}
              className="h-full w-full rounded-full object-contain p-1.5"
              avatarClassName={`h-full w-full text-sm font-bold ${dark ? "text-horchata-400" : "text-horchata-700 dark:text-horchata-400"}`}
            />
          </div>

          <div>
            <p className={`text-xs font-medium ${dark ? "text-white/70" : "text-navy-600 dark:text-horchata-400"}`}>
              {formatDateRange(item.startDate, item.endDate)}
            </p>
            <h3 className={`mt-1 text-base font-bold sm:text-lg ${dark ? "text-horchata-100" : "text-navy-900 dark:text-horchata-100"}`}>
              <Link
                href={`${item.linkPrefix}/${item.slug}`}
                className="hover:text-horchata-700 dark:hover:text-horchata-400"
              >
                {item.title}
              </Link>
            </h3>
            <p className={`text-sm ${dark ? "text-white/80" : "text-navy-600 dark:text-white/70"}`}>
              {item.subtitleHref ? (
                <Link
                  href={item.subtitleHref}
                  className={`underline underline-offset-2 transition-colors ${dark ? "decoration-white/30 hover:text-white" : "decoration-horchata-300 hover:text-horchata-700 dark:decoration-navy-500 dark:hover:text-horchata-400"}`}
                >
                  {item.subtitle}
                </Link>
              ) : (
                item.subtitle
              )}
            </p>
            {item.description && (
              <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/70" : "text-navy-600 dark:text-white/70"}`}>
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
