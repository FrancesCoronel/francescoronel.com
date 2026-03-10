import Image from "next/image";

interface Memoji {
  src: string;
  alt: string;
  mood: string;
}

interface MemojiSectionProps {
  memojis?: Memoji[];
}

const defaultMemojis: Memoji[] = [
  { src: "/images/assets/memoji-wave.png", alt: "Frances waving", mood: "Waving 👋🏽" },
  { src: "/images/assets/memoji-smile.png", alt: "Frances smiling", mood: "Happy 😊" },
  { src: "/images/assets/memoji-thumbs-up.png", alt: "Frances thumbs up", mood: "Approved 👍🏽" },
  { src: "/images/assets/memoji-peace.png", alt: "Frances peace sign", mood: "Peaceful ✌🏽" },
  { src: "/images/assets/memoji-laptop.png", alt: "Frances with laptop", mood: "Coding 💻" },
  { src: "/images/assets/memoji-lightbulb.png", alt: "Frances with an idea", mood: "Inspired 💡" },
  { src: "/images/assets/memoji-cute.png", alt: "Frances being cute", mood: "Cute 🥰" },
  { src: "/images/assets/memoji-fistbump.png", alt: "Frances fist bump", mood: "Hyped 🤜🏽" },
  { src: "/images/assets/memoji-wink-peace.png", alt: "Frances winking with peace sign", mood: "Playful 😜" },
  { src: "/images/assets/memoji-thinking.png", alt: "Frances thinking", mood: "Thinking 🤔" },
];

export function MemojiSection({ memojis = defaultMemojis }: MemojiSectionProps) {
  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            My Memoji
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
            Many Moods of Frances
          </h2>
        </div>
        <div className="grid grid-cols-2 place-items-center gap-4 pb-8 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {memojis.map((memoji) => (
            <div
              key={memoji.src}
              className="group relative flex-shrink-0 transition-transform duration-200 hover:scale-110"
              title={memoji.mood}
            >
              <Image
                src={memoji.src}
                alt={memoji.alt}
                width={120}
                height={120}
                className="h-20 w-20 object-contain drop-shadow-md sm:h-24 sm:w-24 md:h-28 md:w-28"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-horchata-700 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-horchata-500 dark:text-navy-900">
                {memoji.mood}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
