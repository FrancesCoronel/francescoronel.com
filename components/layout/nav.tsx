"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SearchModal } from "@/components/ui/search-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/mentoring", label: "Mentoring" },
  { href: "/projects", label: "Projects" },
  { href: "/speaking", label: "Speaking" },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-horchata-200/60 bg-horchata-50/90 backdrop-blur-lg dark:border-navy-700/60 dark:bg-navy-900/90">
      <nav className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-navy-900 transition-colors hover:text-horchata-700 dark:text-horchata-100 dark:hover:text-horchata-400"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt=""
            className="h-6 w-6"
            aria-hidden="true"
          />
          Frances Coronel
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-horchata-200 text-navy-900 dark:bg-navy-700 dark:text-horchata-100"
                        : "text-navy-600 hover:bg-horchata-100 hover:text-navy-900 dark:text-white/70 dark:hover:bg-navy-800 dark:hover:text-horchata-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Search + Theme + CTA */}
          <div className="ml-3 flex items-center gap-2 border-l border-horchata-200 pl-3 dark:border-navy-700">
            <SearchModal />
            <ThemeToggle />
            <Link
              href="/contact"
              className="rounded-full bg-horchata-700 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-horchata-800 hover:shadow-md dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-navy-900 dark:text-horchata-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-horchata-200 bg-horchata-50 px-6 py-4 dark:border-navy-700 dark:bg-navy-900 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-3 py-2 text-base font-medium ${
                      isActive
                        ? "bg-horchata-200 text-navy-900 dark:bg-navy-700 dark:text-horchata-100"
                        : "text-navy-700 hover:bg-horchata-100 dark:text-horchata-200 dark:hover:bg-navy-800"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-horchata-200 pt-4 dark:border-navy-700">
            <div className="mb-3 flex items-center gap-2">
              <SearchModal />
              <ThemeToggle />
            </div>
            <Link
              href="/contact"
              className="block rounded-full bg-horchata-700 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-horchata-800 hover:shadow-md dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
