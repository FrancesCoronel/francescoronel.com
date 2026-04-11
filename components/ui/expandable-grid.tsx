"use client";

import { useState, type ReactNode } from "react";

interface ExpandableGridProps {
  children: ReactNode[];
  initialCount?: number;
  className?: string;
}

export function ExpandableGrid({
  children,
  initialCount = 6,
  className = "",
}: ExpandableGridProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? children : children.slice(0, initialCount);
  const remaining = children.length - initialCount;

  return (
    <>
      <div className={className}>{visible}</div>
      {!showAll && remaining > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 cursor-pointer text-sm font-medium text-horchata-800 transition-colors hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
        >
          Show {remaining} more ↓
        </button>
      )}
    </>
  );
}
