import Image from "next/image";
import { Marquee } from "./marquee";

interface Logo {
  name: string;
  image: string;
  url?: string;
}

export function LogoCarousel({
  title,
  logos,
}: {
  title: string;
  logos: Logo[];
}) {
  return (
    <section className="py-12">
      <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-navy-600 dark:text-horchata-400">
        {title}
      </h2>
      <Marquee speed={40}>
        <div className="flex items-center gap-12 px-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex h-12 w-24 flex-shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0"
            >
              {logo.url ? (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={logo.name}
                >
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    width={96}
                    height={48}
                    className="h-auto max-h-12 w-auto object-contain"
                  />
                </a>
              ) : (
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={96}
                  height={48}
                  className="h-auto max-h-12 w-auto object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
