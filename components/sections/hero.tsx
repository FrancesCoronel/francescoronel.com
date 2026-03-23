import Image from "next/image";
import { ActionCards } from "./action-cards";

const descriptors = [
  { text: "Senior Software Engineer @ Slack", emoji: "👩🏽‍💻" },
  { text: "Speaker & Mentor", emoji: "🚀" },
  { text: "Proud Peruvian-American", emoji: "🇵🇪" },
  { text: "Corgi Mom to Luna & Sueño", emoji: "🐾" },
  { text: "Latinos 40 Under 40, SF/Silicon Valley", emoji: "🌉" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
      {/* Subtle warm gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-horchata-50/60 via-transparent to-transparent dark:from-navy-900/40" />

      {/* Top section: Name + Avatars */}
      <div className="relative mx-auto max-w-[var(--container-max)] px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-navy-900 dark:text-horchata-100 md:text-6xl lg:text-7xl">
              Hi, I&apos;m Frances! 👋🏽
            </h1>

            {/* Emoji descriptors */}
            <div className="mt-6 flex flex-col gap-2">
              {descriptors.map((d) => (
                <p
                  key={d.text}
                  className="text-base text-navy-600 dark:text-white/70 md:text-lg"
                >
                  {d.text}{" "}
                  <span className="inline-block" aria-hidden="true">
                    {d.emoji}
                  </span>
                </p>
              ))}
            </div>
          </div>

          {/* Circular profile photo + Memoji overlay */}
          <div className="relative flex-shrink-0">
            <div className="relative h-56 w-56 sm:h-72 sm:w-72 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]">
              <Image
                src="/images/assets/frances-headshot.png"
                alt="Frances Coronel"
                width={448}
                height={448}
                className="h-full w-full rounded-full object-cover ring-4 ring-horchata-200 drop-shadow-lg dark:ring-navy-600"
                priority
              />
              {/* Thumbs-up memoji overlay */}
              <div className="absolute -bottom-2 -left-2 h-24 w-24 md:-bottom-4 md:-left-4 md:h-32 md:w-32 lg:h-36 lg:w-36">
                <Image
                  src="/images/assets/frances-thumbs-up-memoji.png"
                  alt="Frances Coronel thumbs-up memoji"
                  width={144}
                  height={144}
                  className="h-full w-full object-contain drop-shadow-md"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Cards */}
        <div className="mt-12">
          <ActionCards />
        </div>
      </div>
    </section>
  );
}
