"use client";

import Image from "next/image";
import { useState } from "react";

export function getClearbitLogoUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return null;
  }
}

type FallbackState = "clearbit" | "original" | "letter";

interface OrgLogoProps {
  /** Stored logo URL (local path or remote URL) */
  src?: string | null;
  /** Org website URL — used to derive the Clearbit logo domain */
  orgUrl?: string | null;
  /** Org name — used for alt text and the letter-avatar fallback */
  name: string;
  size?: number;
  className?: string;
  /** Extra classes for the letter-avatar div fallback */
  avatarClassName?: string;
}

export function OrgLogo({
  src,
  orgUrl,
  name,
  size = 64,
  className,
  avatarClassName,
}: OrgLogoProps) {
  const clearbitUrl = getClearbitLogoUrl(orgUrl);
  const resolvedSrc = src ?? null;

  // If a stored logo is defined, use it exclusively — no Clearbit.
  // Only use Clearbit when no stored logo is provided.
  const initial: FallbackState = resolvedSrc
    ? "original"
    : clearbitUrl
    ? "clearbit"
    : "letter";

  const [state, setState] = useState<FallbackState>(initial);

  function handleError() {
    // Never fall through to Clearbit if a stored logo was defined
    setState("letter");
  }

  if (state === "letter") {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-horchata-100 font-bold text-horchata-700 dark:bg-navy-700 dark:text-horchata-400 ${avatarClassName ?? ""}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.375) }}
        aria-label={name}
      >
        {name.charAt(0)}
      </div>
    );
  }

  const imgSrc = state === "original" ? resolvedSrc! : clearbitUrl!;

  return (
    <Image
      src={imgSrc}
      alt={name}
      width={size}
      height={size}
      className={className}
      onError={handleError}
    />
  );
}
