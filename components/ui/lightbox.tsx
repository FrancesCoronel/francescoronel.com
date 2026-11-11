"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxState {
  images: LightboxImage[];
  index: number;
  /** Shown at full size, pannable, instead of fitted to the screen */
  zoomed: boolean;
}

/**
 * The best source for the viewer: the full-size file a ZoomableImage wrapper names, else the
 * candidate the browser picked from srcset, else the plain src.
 */
function viewerSrc(el: HTMLImageElement): string {
  const wrapper = el.closest<HTMLElement>("[data-zoom-src]");
  return wrapper?.dataset.zoomSrc || el.currentSrc || el.src;
}

export function Lightbox({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lb, setLb] = useState<LightboxState | null>(null);

  // Collect all images and open at the clicked index
  const open = useCallback((clicked: HTMLImageElement) => {
    // Only called from the container's own click and keydown listeners, so the ref is set
    // and the clicked image is one of these
    const imgs = Array.from(containerRef.current!.querySelectorAll("img")).filter(
      (el) => !el.closest("a") // skip linked images that should navigate
    );
    const images = imgs.map((el) => ({ src: viewerSrc(el), alt: el.alt || "" }));
    setLb({ images, index: imgs.indexOf(clicked), zoomed: false });
  }, []);

  // Event delegation — one listener on the container
  useEffect(() => {
    const el = containerRef.current!;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const img = target.closest("img");
      if (!img || img.closest("a")) return;
      e.preventDefault();
      // MDX images are also wrapped in ZoomableImage, whose own single-image
      // viewer would open underneath this one. React listens at the root, so
      // stopping the native event here keeps it to one viewer.
      e.stopPropagation();
      open(img);
    };
    // Keyboard users reach images through ZoomableImage's focusable wrapper:
    // open the same carousel for them instead of the single-image viewer
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const target = e.target as HTMLElement;
      if (target.closest("a")) return;
      const img = target.querySelector("img");
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      open(img);
    };
    el.addEventListener("click", handler);
    el.addEventListener("keydown", keyHandler);
    // Add cursor pointer to all non-linked images
    el.querySelectorAll("img").forEach((img) => {
      if (!img.closest("a")) img.style.cursor = "zoom-in";
    });
    return () => {
      el.removeEventListener("click", handler);
      el.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  const close = useCallback(() => setLb(null), []);
  const prev = useCallback(() => setLb((s) => s && { ...s, zoomed: false, index: (s.index - 1 + s.images.length) % s.images.length }), []);
  const next = useCallback(() => setLb((s) => s && { ...s, zoomed: false, index: (s.index + 1) % s.images.length }), []);
  const toggleZoom = useCallback(() => setLb((s) => s && { ...s, zoomed: !s.zoomed }), []);

  useEffect(() => {
    if (!lb) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lb, close, prev, next]);

  const current = lb ? lb.images[lb.index] : null;

  return (
    <>
      <div ref={containerRef} className={className}>
        {children}
      </div>

      {lb && current && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Image: fitted to the screen, or full size and pannable once zoomed.
              The scroll area has its own layer so the controls stay put while panning. */}
          <div className="absolute inset-0 flex overflow-auto overscroll-contain">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className={
                lb.zoomed
                  ? "m-auto max-w-none shrink-0 cursor-zoom-out rounded-lg shadow-2xl"
                  : "m-auto max-h-[90vh] max-w-[90vw] cursor-zoom-in rounded-lg object-contain shadow-2xl"
              }
              onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
            />
          </div>

          {/* Zoom toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
            className="absolute top-4 right-16 flex h-10 items-center justify-center gap-1.5 rounded-full bg-black/60 px-4 text-sm font-medium text-white transition-colors hover:bg-black/80"
            aria-pressed={lb.zoomed}
          >
            {lb.zoomed ? "Fit to screen" : "Full size"}
          </button>

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {lb.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next */}
          {lb.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {lb.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white">
              {lb.index + 1} / {lb.images.length}
            </div>
          )}

          {/* Alt caption */}
          {current.alt && !lb.zoomed && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-md text-center text-sm text-white/70">
              {current.alt}
            </div>
          )}
        </div>
      )}
    </>
  );
}
