import Image from "next/image";
import { clsx } from "clsx";

/**
 * PhotoGallery — inspired by Tailwind Plus Spotlight homepage.
 * A horizontal strip of 5 photos with alternating slight rotations,
 * each in an aspect-[9/10] rounded-xl frame with a white ring.
 */

const DEFAULT_ROTATIONS = [
  "rotate-2",
  "-rotate-2",
  "rotate-2",
  "rotate-2",
  "-rotate-2",
];

export interface PhotoItem {
  src: string;
  alt: string;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  className?: string;
}

export function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  return (
    <div
      className={clsx(
        "-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8",
        className
      )}
    >
      {photos.slice(0, 5).map((photo, index) => (
        <div
          key={index}
          className={clsx(
            "relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl sm:w-72 sm:rounded-2xl",
            DEFAULT_ROTATIONS[index % DEFAULT_ROTATIONS.length],
            "ring-2 ring-horchata-200 dark:ring-navy-700"
          )}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 640px) 18rem, 11rem"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
