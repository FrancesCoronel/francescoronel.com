import Image from "next/image";
import Link from "next/link";

type CTAVariant = "default" | "speaking" | "mentoring" | "follow" | "hire" | "contact" | "projects";

const variants: Record<
  CTAVariant,
  {
    heading: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    image: string;
  }
> = {
  default: {
    heading: "Let\u2019s Connect \uD83D\uDC4B\uD83C\uDFFD",
    description:
      "Whether you want to book a speaking engagement, schedule a mentoring session, or just say hello \u2014 I\u2019d love to hear from you.",
    primaryLabel: "Get in Touch",
    primaryHref: "/contact",
    secondaryLabel: "Book Mentoring",
    secondaryHref: "/mentoring",
    image: "/images/assets/calendar-connect.webp",
  },
  speaking: {
    heading: "Want Me to Speak? 🎤",
    description:
      "I\u2019ve spoken at 100+ events on diversity in tech, TypeScript, career growth, and more. Let\u2019s make your next event memorable.",
    primaryLabel: "Book Me to Speak",
    primaryHref: "/contact",
    secondaryLabel: "Follow on LinkedIn",
    secondaryHref: "https://www.linkedin.com/in/francescoronel",
    image: "/images/assets/memoji-fistbump.png",
  },
  mentoring: {
    heading: "Level Up Your Career 💬",
    description:
      "Whether you\u2019re prepping for interviews, navigating a career transition, or leveling up as an engineer \u2014 I\u2019m here to help.",
    primaryLabel: "Book a Session",
    primaryHref: "https://cal.com/francescoronel/mentoring",
    secondaryLabel: "Get in Touch",
    secondaryHref: "/contact",
    image: "/images/assets/speaking-hero-image.webp",
  },
  follow: {
    heading: "Stay in the Loop \u270D\uD83C\uDFFD",
    description:
      "I share thoughts on engineering, career growth, and the tech industry. Follow along for more.",
    primaryLabel: "Follow on LinkedIn",
    primaryHref: "https://www.linkedin.com/in/francescoronel",
    secondaryLabel: "Book Mentoring",
    secondaryHref: "/mentoring",
    image: "/images/assets/newsletter-cta.webp",
  },
  hire: {
    heading: "Let\u2019s Work Together \uD83D\uDCBC",
    description:
      "8+ years of software engineering experience, from startups to enterprise. Open to speaking, advising, and collaboration opportunities.",
    primaryLabel: "Get in Touch",
    primaryHref: "/contact",
    secondaryLabel: "Book Me to Speak",
    secondaryHref: "/speaking",
    image: "/images/assets/calendar-connect.webp",
  },
  projects: {
    heading: "Let's Build Something 🛠️",
    description:
      "Have a project idea, want to collaborate, or interested in open-source work? I'd love to hear about it.",
    primaryLabel: "Get in Touch",
    primaryHref: "/contact",
    secondaryLabel: "View on GitHub",
    secondaryHref: "https://github.com/FrancesCoronel",
    image: "/images/assets/rocket-illustration.webp",
  },
  contact: {
    heading: "Let's Connect 📨",
    description:
      "Have a question, a speaking invite, or just want to say hi? I\u2019d love to hear from you.",
    primaryLabel: "Send a Message",
    primaryHref: "/contact",
    secondaryLabel: "Book Mentoring",
    secondaryHref: "/mentoring",
    image: "/images/assets/heart-chat-bubble.webp",
  },
};

interface ConnectCTAProps {
  variant?: CTAVariant;
}

export function ConnectCTA({ variant = "default" }: ConnectCTAProps) {
  const v = variants[variant];
  const isExternal = v.primaryHref.startsWith("http");
  const isSecondaryExternal = v.secondaryHref.startsWith("http");

  return (
    <section className="border-y border-horchata-200 bg-horchata-50 py-16 dark:border-navy-700 dark:bg-navy-900">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Image
          src={v.image}
          alt=""
          width={160}
          height={160}
          className="mx-auto mb-6 h-36 w-36 object-contain md:h-40 md:w-40"
          aria-hidden="true"
        />
        <h2 className="text-3xl font-bold text-navy-900 dark:text-horchata-100">
          {v.heading}
        </h2>
        <p className="mt-3 text-lg text-navy-600 dark:text-white/70">
          {v.description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isExternal ? (
            <a
              href={v.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-horchata-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {v.primaryLabel} <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <Link
              href={v.primaryHref}
              className="rounded-full bg-horchata-700 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
            >
              {v.primaryLabel} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
          {isSecondaryExternal ? (
            <a
              href={v.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700"
            >
              {v.secondaryLabel} <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <Link
              href={v.secondaryHref}
              className="rounded-full border border-navy-300 px-8 py-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 hover:bg-white dark:border-horchata-600 dark:text-horchata-200 dark:hover:bg-navy-700"
            >
              {v.secondaryLabel} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>

        {/* LinkedIn — hidden when primary already links to LinkedIn */}
        {!isExternal && (
          <a
            href="https://www.linkedin.com/in/francescoronel"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-navy-500 transition-colors hover:text-horchata-700 dark:text-white/50 dark:hover:text-horchata-400"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Follow on LinkedIn
          </a>
        )}
      </div>
    </section>
  );
}
