import type { ReactNode } from "react";

const titleSizes = {
  sm: "text-lg sm:text-2xl",
  md: "text-2xl",
  lg: "text-xl sm:text-3xl",
};

/**
 * The label + heading pair every section opens with (see AGENTS.md, Section
 * Header Format): a short uppercase label, then the title with its emoji.
 */
export function SectionHeader({
  label,
  title,
  as: Heading = "h2",
  size = "lg",
  id,
  className = "",
  titleClassName = "",
}: {
  label: ReactNode;
  title: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof titleSizes;
  id?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={className || undefined}>
      <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-accent-light">
        {label}
      </p>
      <Heading
        id={id}
        className={`mt-1 ${titleSizes[size]} font-bold text-navy-900 dark:text-horchata-100 ${titleClassName}`.trim()}
      >
        {title}
      </Heading>
    </div>
  );
}
