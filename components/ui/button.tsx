import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Brick red in light mode, brick tint with dark text in dark mode
  primary: "bg-brand-fill text-on-brand hover:bg-brand-fill-hover",
  secondary:
    "border border-navy-300 text-navy-900 hover:border-navy-400 hover:bg-white dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3 text-sm",
};

/** Class string for a button, for the rare element that can't be a Button or ButtonLink */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

type StyleProps = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: StyleProps & Omit<ComponentProps<"button">, "className">) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

/** A link that looks like a button. Internal paths use next/link; others render a plain anchor */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  ...props
}: StyleProps & { href: string } & Omit<ComponentProps<"a">, "className" | "href">) {
  const classes = buttonClasses({ variant, size, className });
  if (href.startsWith("/") && !href.startsWith("//")) {
    return <Link href={href} className={classes} {...props} />;
  }
  return <a href={href} className={classes} {...props} />;
}
