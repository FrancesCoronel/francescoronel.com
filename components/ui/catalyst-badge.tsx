import { clsx } from "clsx";

const colorMap = {
  navy: "bg-navy-500/15 text-navy-700 dark:bg-navy-400/15 dark:text-navy-300",
  horchata: "bg-horchata-500/15 text-horchata-800 dark:bg-horchata-400/15 dark:text-horchata-300",
  green: "bg-green-500/15 text-green-700 dark:bg-green-400/15 dark:text-green-300",
  red: "bg-red-500/15 text-red-700 dark:bg-red-400/15 dark:text-red-300",
  yellow: "bg-yellow-500/15 text-yellow-700 dark:bg-yellow-400/15 dark:text-yellow-300",
  purple: "bg-purple-500/15 text-purple-700 dark:bg-purple-400/15 dark:text-purple-300",
  pink: "bg-pink-500/15 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300",
  sky: "bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  zinc: "bg-zinc-500/15 text-zinc-700 dark:bg-zinc-400/15 dark:text-zinc-600",
} as const;

export type BadgeColor = keyof typeof colorMap;

interface CatalystBadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

export function CatalystBadge({
  color = "zinc",
  children,
  className,
}: CatalystBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
