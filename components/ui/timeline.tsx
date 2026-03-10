import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/cloudinary";
import { formatDateRange } from "@/lib/utils";

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

export function Timeline({ items, dark }: { items: TimelineItem[]; dark?: boolean }) {
  return (
    <div className={`relative space-y-10 pl-16 before:absolute before:left-6 before:top-0 before:h-full before:w-0.5 ${dark ? "before:bg-navy-700" : "before:bg-horchata-200 dark:before:bg-navy-700"}`}>
      {items.map((item) => (
        <div key={item.slug} className="relative">
          {/* Dot on the timeline */}
          <div className={`absolute -left-16 top-0 h-12 w-12 overflow-hidden rounded-full border-2 ${dark ? "border-horchata-600 bg-navy-700" : "border-horchata-400 bg-white dark:border-horchata-600 dark:bg-navy-700"}`}>
            {item.logo ? (
              <Image
                src={resolveImageUrl(item.logo)}
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center text-sm font-bold ${dark ? "text-horchata-400" : "text-horchata-600 dark:text-horchata-400"}`}>
                {item.subtitle.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <p className={`text-xs font-medium ${dark ? "text-white/70" : "text-navy-500 dark:text-horchata-400"}`}>
              {formatDateRange(item.startDate, item.endDate)}
            </p>
            <h3 className={`mt-1 text-lg font-bold ${dark ? "text-horchata-100" : "text-navy-900 dark:text-horchata-100"}`}>
              <Link
                href={`${item.linkPrefix}/${item.slug}`}
                className="hover:text-horchata-400"
              >
                {item.title}
              </Link>
            </h3>
            <p className={`text-sm ${dark ? "text-white/80" : "text-navy-600 dark:text-white/70"}`}>
              {item.subtitleHref ? (
                <Link
                  href={item.subtitleHref}
                  className={`underline underline-offset-2 transition-colors ${dark ? "decoration-white/30 hover:text-white" : "decoration-horchata-300 hover:text-horchata-600 dark:decoration-navy-500 dark:hover:text-horchata-400"}`}
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
