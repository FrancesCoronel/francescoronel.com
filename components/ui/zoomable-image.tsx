"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  children: React.ReactNode; // the rendered <img> or <Image> element
}

export function ZoomableImage({
  src,
  alt,
  className,
  children,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <span
        className={`group relative inline-block cursor-zoom-in ${className ?? ""}`}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Zoom: ${alt}`}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {children}
        {/* Zoom hint badge */}
        <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          🔍 zoom
        </span>
      </span>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={close}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
            onClick={close}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Full-size image — stop propagation so clicking the image itself doesn't close */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] cursor-zoom-out rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
