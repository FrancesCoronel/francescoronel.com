const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "francescoronel";

/**
 * Build a Cloudinary delivery URL with optional transformations.
 *
 * Usage:
 *   cloudinaryUrl("blog/my-image.jpg")
 *   cloudinaryUrl("blog/my-image.jpg", { width: 800, height: 400 })
 */
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformStr = transforms.join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
}

/**
 * Resolve a content image reference to a full URL.
 * Supports both cloudinary:// protocol and plain URLs.
 */
export function resolveImageUrl(src: string): string {
  if (src.startsWith("cloudinary://")) {
    const publicId = src.replace("cloudinary://", "");
    return cloudinaryUrl(publicId);
  }
  return src;
}

/**
 * Generate an Open Graph image URL via Cloudinary transformations.
 */
export function ogImageUrl(publicId: string): string {
  return cloudinaryUrl(publicId, {
    width: 1200,
    height: 630,
    crop: "fill",
    quality: "80",
    format: "jpg",
  });
}
