import Image from "next/image";
import { NewsletterForm } from "@/components/ui/newsletter-form";

export function NewsletterCTA() {
  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-16 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Illustration */}
          <div className="flex-shrink-0">
            <Image
              src="/images/assets/newsletter-cta.webp"
              alt=""
              width={240}
              height={240}
              className="h-44 w-44 object-contain drop-shadow-md md:h-52 md:w-52"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700 dark:text-horchata-500">
              Stay in the loop
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100 sm:text-3xl">
              The Unicorn Engineer ✨
            </h2>
            <p className="mt-3 max-w-lg text-navy-600 dark:text-white/70">
              Personal and career learnings, advice, collaboration opportunities, and more — straight to your inbox.
            </p>

            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>

            <p className="mt-3 text-xs text-navy-400 dark:text-white/40">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
