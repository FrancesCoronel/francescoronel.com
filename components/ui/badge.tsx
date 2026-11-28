import type { ReactNode } from "react";

export type BadgeTone = "success" | "info" | "warning" | "danger" | "neutral";

const tones: Record<BadgeTone, string> = {
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-horchata-100 text-horchata-700 dark:bg-navy-700 dark:text-horchata-300",
};

const sizes = {
  // 16px: the one size below the 20px floor, for small pills next to titles
  sm: "px-2 py-0.5 text-2xs",
  md: "px-3 py-1 text-xs",
};

/** Project categories share the status hues */
export const CATEGORY_TONES: Record<string, BadgeTone> = {
  "open-source": "success",
  hackathon: "info",
  podcast: "warning",
};

export function Badge({
  tone = "neutral",
  size = "sm",
  weight = "semibold",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  size?: keyof typeof sizes;
  weight?: "medium" | "semibold";
  className?: string;
  children: ReactNode;
}) {
  const font = weight === "medium" ? "font-medium" : "font-semibold";
  return (
    <span className={`rounded-full ${sizes[size]} ${font} ${tones[tone]} ${className}`.trim()}>
      {children}
    </span>
  );
}
