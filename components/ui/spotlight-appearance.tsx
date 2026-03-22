import Link from "next/link";
import { clsx } from "clsx";

/**
 * SpotlightAppearance — inspired by Tailwind Plus Spotlight speaking page.
 * Speaking/event entry with an eyebrow decoration (left bar accent),
 * hover fill background, title, description, and CTA link.
 */

export interface SpotlightAppearanceProps {
  title: string;
  description: string;
  event: string;
  cta: string;
  href: string;
  className?: string;
}

export function SpotlightAppearance({
  title,
  description,
  event,
  cta,
  href,
  className,
}: SpotlightAppearanceProps) {
  return (
    <article className={clsx("group relative flex flex-col", className)}>
      {/* Hover fill background */}
      <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 rounded-2xl bg-horchata-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-navy-800/50 sm:-inset-x-6" />

      {/* Eyebrow with left-bar decoration */}
      <p className="relative z-10 flex items-center pl-3.5 text-sm font-medium text-horchata-500 dark:text-horchata-400">
        <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
          <span className="h-4 w-0.5 rounded-full bg-horchata-400 dark:bg-horchata-500" />
        </span>
        {event}
      </p>

      <p className="relative z-10 mt-2 text-base font-semibold tracking-tight text-navy-800 dark:text-navy-100">
        <Link href={href}>
          <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          {title}
        </Link>
      </p>

      <p className="relative z-10 mt-2 text-sm text-navy-600 dark:text-navy-400">
        {description}
      </p>

      <div
        aria-hidden="true"
        className="relative z-10 mt-4 flex items-center text-sm font-medium text-horchata-500 dark:text-horchata-400"
      >
        {cta}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="ml-1 h-4 w-4 stroke-current"
        >
          <path
            d="M6.75 5.75 9.25 8l-2.5 2.25"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </article>
  );
}

/**
 * SpotlightSpeakingSection — groups appearances under a heading (e.g. "Conferences")
 * within a SpotlightSection.
 */
interface SpotlightSpeakingSectionProps {
  heading: string;
  appearances: SpotlightAppearanceProps[];
}

export function SpotlightSpeakingSection({
  heading,
  appearances,
}: SpotlightSpeakingSectionProps) {
  return (
    <div className="space-y-16">
      <h3 className="text-sm font-semibold text-navy-400 dark:text-navy-500">
        {heading}
      </h3>
      <div className="space-y-10">
        {appearances.map((a) => (
          <SpotlightAppearance key={a.href} {...a} />
        ))}
      </div>
    </div>
  );
}
