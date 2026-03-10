"use client";

import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";

const credentials = [
  { text: "Senior Software Engineer @ Slack", emoji: "👩🏽‍💻", href: "/experience/senior-software-engineer-messaging" },
  { text: "Tech Speaker", emoji: "🎤", href: "/speaking" },
  { text: "Mentor & Career Coach", emoji: "💬", href: "/mentoring" },
  { text: "Cornell Tech Alum", emoji: "🎓", href: "/education/cornell-tech" },
  { text: "Aspen Institute Fellow", emoji: "💡", href: "/awards/ricardo-salinas-scholar" },
  { text: "40 Under 40 Latino Leaders", emoji: "🏆", href: "/awards/latinos-40-under-40" },
  { text: "Previous Techqueria Executive Director", emoji: "🌮", href: "/organizations/techqueria" },
  { text: "Latina in Tech", emoji: "💛", href: "/about" },
  { text: "Peruvian-American", emoji: "🇵🇪", href: "/about" },
  { text: "Corgi Mom", emoji: "🐾", href: "/about" },
];

export function CredentialsMarquee() {
  return (
    <div className="border-y border-horchata-200 bg-horchata-50 py-4 dark:border-navy-700 dark:bg-navy-800">
      <Marquee speed={90}>
        <div className="flex items-center gap-2 px-2 sm:px-4">
          {credentials.map((c, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
              <Link
                href={c.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-horchata-600 dark:text-horchata-200 dark:hover:text-horchata-400"
              >
                {c.text}
              </Link>
              <span className="text-xl" aria-hidden="true">{c.emoji}</span>
              <span
                className="mx-3 text-horchata-400 dark:text-navy-500"
                aria-hidden="true"
              >
                •
              </span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
