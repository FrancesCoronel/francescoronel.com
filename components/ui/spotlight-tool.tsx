import { clsx } from "clsx";

/**
 * SpotlightTool — inspired by Tailwind Plus Spotlight /uses page.
 * Named tool entry: title (tool name) + description.
 * Grouped under a SpotlightToolsSection heading.
 */

interface SpotlightToolProps {
  title: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function SpotlightTool({
  title,
  href,
  children,
  className,
}: SpotlightToolProps) {
  return (
    <li className={clsx("group relative flex flex-col", className)}>
      <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-horchata-600 dark:hover:text-horchata-400"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </p>
      <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{children}</p>
    </li>
  );
}

/**
 * SpotlightToolsSection — groups tools under a sub-heading within a SpotlightSection.
 */
interface SpotlightToolsSectionProps {
  heading: string;
  children: React.ReactNode;
  className?: string;
}

export function SpotlightToolsSection({
  heading,
  children,
  className,
}: SpotlightToolsSectionProps) {
  return (
    <div className={clsx("space-y-6", className)}>
      <h3 className="text-sm font-semibold text-navy-800 dark:text-navy-100">
        {heading}
      </h3>
      <ul className="space-y-6">{children}</ul>
    </div>
  );
}
