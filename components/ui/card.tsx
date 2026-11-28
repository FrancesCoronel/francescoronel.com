import type { ElementType, ReactNode } from "react";

/** The site's card surface: white on linen, navy-800 in dark mode */
export const cardClasses = "rounded-2xl border border-line bg-surface-raised";

export function Card<T extends ElementType = "div">({
  as,
  interactive = false,
  className = "",
  children,
  ...props
}: {
  as?: T;
  /** Adds the hover lift used on clickable cards */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">) {
  const Tag: ElementType = as ?? "div";
  const hover = interactive ? "transition-shadow hover:shadow-md" : "";
  return (
    <Tag className={`${cardClasses} ${hover} ${className}`.replace(/\s+/g, " ").trim()} {...props}>
      {children}
    </Tag>
  );
}
