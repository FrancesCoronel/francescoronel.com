import Image from "next/image";
import { NewsletterForm } from "@/components/ui/newsletter-form";

export function NewsletterCTA() {
  return (
    <section className="border-y border-horchata-200 bg-horchata-200 py-16 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="overflow-hidden rounded-2xl bg-horchata-900 dark:bg-navy-800">
          <div className="flex flex-col items-center gap-8 px-8 py-12 md:flex-row md:gap-12 md:px-12 lg:px-16">
            {/* Illustration */}
            <div className="flex-shrink-0">
              <Image
                src="/images/assets/newsletter-cta.webp"
                alt=""
                width={200}
                height={200}
                className="h-36 w-36 object-contain drop-shadow-xl md:h-44 md:w-44"
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-horchata-400">
                Stay in the loop
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                The Unicorn Engineer ✨
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/60 sm:text-base">
                Personal and career learnings, advice, collaboration opportunities, and more. Delivered straight to your inbox.
              </p>

              <div className="mt-6 max-w-lg">
                <NewsletterForm variant="dark" />
              </div>

              <p className="mt-3 text-xs text-white/30">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
