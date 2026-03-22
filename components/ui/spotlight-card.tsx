import Link from "next/link";
import { clsx } from "clsx";

/**
 * SpotlightCard — inspired by Tailwind Plus Spotlight template.
 * Wraps content in a card with a hover "fill" background effect:
 * the background scales from 95% → 100% and fades in on hover.
 */

interface SpotlightCardLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function SpotlightCardLink({ href, children, className }: SpotlightCardLinkProps) {
  return (
    <div className={clsx("group relative flex flex-col", className)}>
      <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 rounded-2xl bg-horchata-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-navy-800/50 sm:-inset-x-6" />
      <Link href={href} className="relative z-10">
        {children}
      </Link>
    </div>
  );
}

interface SpotlightCardEyebrowProps {
  children: React.ReactNode;
  decorate?: boolean;
  className?: string;
  dateTime?: string;
}

function SpotlightCardEyebrow({
  children,
  decorate = false,
  className,
  dateTime,
}: SpotlightCardEyebrowProps) {
  const Tag = dateTime ? "time" : "p";
  return (
    <Tag
      dateTime={dateTime}
      className={clsx(
        "relative z-10 flex items-center text-sm font-medium text-horchata-500 dark:text-horchata-400",
        decorate && "pl-3.5",
        className
      )}
    >
      {decorate && (
        <span
          className="absolute inset-y-0 left-0 flex items-center"
          aria-hidden="true"
        >
          <span className="h-4 w-0.5 rounded-full bg-horchata-400 dark:bg-horchata-500" />
        </span>
      )}
      {children}
    </Tag>
  );
}

interface SpotlightCardTitleProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

function SpotlightCardTitle({ children, href, className }: SpotlightCardTitleProps) {
  return (
    <h2
      className={clsx(
        "mt-1 text-base font-semibold tracking-tight text-navy-800 dark:text-navy-100",
        className
      )}
    >
      {href ? (
        <>
          <SpotlightCardLink href={href}>
            <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
            <span className="relative z-10">{children}</span>
          </SpotlightCardLink>
        </>
      ) : (
        children
      )}
    </h2>
  );
}

interface SpotlightCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function SpotlightCardDescription({ children, className }: SpotlightCardDescriptionProps) {
  return (
    <p
      className={clsx(
        "relative z-10 mt-2 text-sm text-navy-600 dark:text-navy-400",
        className
      )}
    >
      {children}
    </p>
  );
}

interface SpotlightCardCtaProps {
  children: React.ReactNode;
  className?: string;
}

function SpotlightCardCta({ children, className }: SpotlightCardCtaProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "relative z-10 mt-4 flex items-center text-sm font-medium text-horchata-500 dark:text-horchata-400",
        className
      )}
    >
      {children}
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
  );
}

/**
 * Standalone SpotlightCard with hover-fill effect — use as a wrapper
 * around any block content.
 */
export interface SpotlightCardProps {
  href: string;
  eyebrow?: string;
  eyebrowDate?: string;
  decorate?: boolean;
  title: string;
  description?: string;
  cta?: string;
  className?: string;
}

export function SpotlightCard({
  href,
  eyebrow,
  eyebrowDate,
  decorate = false,
  title,
  description,
  cta,
  className,
}: SpotlightCardProps) {
  return (
    <article className={clsx("group relative flex flex-col", className)}>
      {/* Hover fill background */}
      <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 rounded-2xl bg-horchata-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-navy-800/50 sm:-inset-x-6" />

      {eyebrow && (
        <SpotlightCardEyebrow decorate={decorate} dateTime={eyebrowDate}>
          {eyebrow}
        </SpotlightCardEyebrow>
      )}

      <p className="relative z-10 mt-1 text-base font-semibold tracking-tight text-navy-800 dark:text-navy-100">
        <Link href={href}>
          <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          {title}
        </Link>
      </p>

      {description && (
        <p className="relative z-10 mt-2 text-sm text-navy-600 dark:text-navy-400">
          {description}
        </p>
      )}

      {cta && (
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
      )}
    </article>
  );
}

// Sub-components for composable use
SpotlightCard.Link = SpotlightCardLink;
SpotlightCard.Eyebrow = SpotlightCardEyebrow;
SpotlightCard.Title = SpotlightCardTitle;
SpotlightCard.Description = SpotlightCardDescription;
SpotlightCard.Cta = SpotlightCardCta;
