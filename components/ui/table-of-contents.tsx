"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/extract-headings";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headingEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    // Track which headings are visible; active = topmost visible one
    const visible = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        // Pick the first heading in document order that is visible
        const first = headingEls.find((el) => visible.has(el.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    for (const el of headingEls) observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-navy-400 dark:text-horchata-600">
        On this page
      </p>
      <ul className="relative border-l-2 border-horchata-200 dark:border-navy-700">
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="relative">
              {isActive && (
                <span
                  className="absolute -left-[2px] top-0 h-full w-[2px] rounded-full bg-horchata-500 dark:bg-horchata-400"
                  aria-hidden="true"
                />
              )}
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(id);
                }}
                className={[
                  "block py-1.5 text-sm leading-snug transition-colors",
                  level === 3 ? "pl-6" : "pl-4",
                  isActive
                    ? "font-semibold text-horchata-600 dark:text-horchata-400"
                    : "text-navy-400 hover:text-navy-700 dark:text-white/40 dark:hover:text-white/70",
                ].join(" ")}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
