import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

/**
 * SpotlightAboutLayout — inspired by Tailwind Plus Spotlight about page.
 * Two-column layout: large body copy on the left, rotated portrait photo +
 * social links on the right (stacked on mobile).
 */

export interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SpotlightAboutLayoutProps {
  heading: string;
  paragraphs: string[];
  photo: { src: string; alt: string };
  socialLinks: SocialLink[];
  resumeHref?: string;
  className?: string;
}

export function SpotlightAboutLayout({
  heading,
  paragraphs,
  photo,
  socialLinks,
  resumeHref,
  className,
}: SpotlightAboutLayoutProps) {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12",
        className
      )}
    >
      {/* Photo — top-right on desktop */}
      <div className="lg:pl-20">
        <div className="max-w-xs px-2.5 lg:max-w-none">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={800}
            height={800}
            className="aspect-square rotate-3 rounded-2xl object-cover shadow-xl ring-2 ring-horchata-200 dark:ring-navy-700"
          />
        </div>
      </div>

      {/* Text content — left column on desktop, spans second row */}
      <div className="lg:order-first lg:row-span-2">
        <h1 className="text-4xl font-bold tracking-tight text-navy-800 dark:text-navy-100 sm:text-5xl">
          {heading}
        </h1>
        <div className="mt-6 space-y-7 text-base text-navy-600 dark:text-navy-400">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Social links + resume — stacked under photo */}
      <div className="lg:pl-20">
        <ul className="space-y-4">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center text-sm font-medium text-navy-700 transition-colors hover:text-horchata-600 dark:text-navy-200 dark:hover:text-horchata-400"
              >
                <span className="mr-3 h-5 w-5 flex-shrink-0 text-navy-400 transition-colors group-hover:text-horchata-500 dark:text-navy-500">
                  {link.icon}
                </span>
                {link.label}
              </a>
            </li>
          ))}

          {resumeHref && (
            <>
              <li className="mt-8 border-t border-horchata-200 pt-8 dark:border-navy-700">
                <Link
                  href={resumeHref}
                  className="group flex items-center text-sm font-medium text-navy-700 transition-colors hover:text-horchata-600 dark:text-navy-200 dark:hover:text-horchata-400"
                >
                  <svg
                    className="mr-3 h-5 w-5 flex-shrink-0 text-navy-400 transition-colors group-hover:text-horchata-500 dark:text-navy-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 10v6m0 0-3-3m3 3 3-3M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4M3 9l9-7 9 7" />
                  </svg>
                  Download CV
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
