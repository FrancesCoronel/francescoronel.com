import { NewsletterForm } from "@/components/ui/newsletter-form";

export function NewsletterCTA() {
  return (
    <section id="newsletter" className="border-y border-navy-800 bg-navy-800 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-horchata-400">
          Newsletter
        </p>
        <h2 className="mt-2 text-lg font-bold text-white sm:text-2xl md:text-3xl">
          🦄 The Unicorn Engineer ✨
        </h2>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Notes from the orchard 🌳: what I&apos;m learning about bringing AI agents to whole companies, for engineers and everyone else. One email when there&apos;s something worth reading.
        </p>

        <div className="mt-6">
          <NewsletterForm variant="dark" />
        </div>

        <p className="mt-3 text-xs text-white/60">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
