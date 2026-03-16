import Image from "next/image";
import Link from "next/link";

interface CtaCard {
  label: string;
  description: string;
  href: string;
  image: string;
}

interface ActionCardsProps {
  cards?: CtaCard[];
}

const defaultCards: CtaCard[] = [
  {
    label: "About",
    description: "Learn more about me and my story",
    href: "/about",
    image: "/images/assets/frances-slack.jpg",
  },
  {
    label: "Blog",
    description: "Read my latest posts and insights",
    href: "/blog",
    image: "/images/assets/newsletter-cta.webp",
  },
  {
    label: "Projects",
    description: "Browse my projects and work",
    href: "/projects",
    image: "/images/assets/rocket-illustration.webp",
  },
  {
    label: "Speaking",
    description: "Hire me for your next event",
    href: "/speaking",
    image: "/images/assets/speaking-microphone.png",
  },
  {
    label: "Mentoring",
    description: "Book a 1:1 session with me",
    href: "/mentoring",
    image: "/images/assets/speaking-hero-image.webp",
  },
  {
    label: "Contact",
    description: "Get in touch with me",
    href: "/contact",
    image: "/images/assets/heart-chat-bubble.webp",
  },
];

export function ActionCards({ cards = defaultCards }: ActionCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((cta) => (
        <Link
          key={cta.label}
          href={cta.href}
          className="group flex items-center gap-4 rounded-2xl border border-horchata-200 bg-white px-6 py-5 transition-all hover:border-horchata-400 hover:shadow-md dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center sm:h-24 sm:w-24">
            <Image
              src={cta.image}
              alt=""
              width={96}
              height={96}
              className="h-16 w-16 object-contain sm:h-24 sm:w-24"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="font-bold text-navy-900 dark:text-horchata-100">
              {cta.label}
            </p>
            <p className="text-sm text-navy-500 dark:text-horchata-400">
              {cta.description}
            </p>
          </div>
          <svg
            className="ml-auto h-5 w-5 text-navy-300 transition-transform group-hover:translate-x-1 dark:text-navy-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ))}
    </div>
  );
}
