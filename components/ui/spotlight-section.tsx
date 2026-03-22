import { clsx } from "clsx";

/**
 * SpotlightSection — inspired by Tailwind Plus Spotlight template.
 * Two-column layout: sticky title on the left, content grid on the right.
 * Left border accent at md+ breakpoints.
 */

interface SpotlightSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SpotlightSection({
  title,
  children,
  className,
}: SpotlightSectionProps) {
  return (
    <section
      className={clsx(
        "md:border-l md:border-horchata-200 md:pl-6 dark:md:border-navy-700",
        className
      )}
    >
      <div className="grid max-w-3xl grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
        <h2 className="text-sm font-semibold text-navy-800 dark:text-navy-100">
          {title}
        </h2>
        <div className="md:col-span-3">{children}</div>
      </div>
    </section>
  );
}

/**
 * SpotlightSectionGroup — stacks multiple SpotlightSections with spacing.
 */
interface SpotlightSectionGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightSectionGroup({
  children,
  className,
}: SpotlightSectionGroupProps) {
  return (
    <div className={clsx("space-y-20", className)}>{children}</div>
  );
}
