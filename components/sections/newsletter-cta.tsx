import { NewsletterForm } from "@/components/ui/newsletter-form";

export function NewsletterCTA() {
  return (
    <section className="border-y border-navy-800 bg-navy-800 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-horchata-400">
          Stay in the loop
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          🦄 The Unicorn Engineer ✨
        </h2>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Personal and career learnings, advice, collaboration opportunities, and more. Delivered straight to your inbox.
        </p>

        <div className="mt-6">
          <NewsletterForm variant="dark" />
        </div>

        <p className="mt-3 text-xs text-white/30">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
