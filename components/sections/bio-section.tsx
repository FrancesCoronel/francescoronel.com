interface BioVariant {
  label: string;
  content: React.ReactNode;
  colSpan?: number;
}

interface BioSectionProps {
  variants: BioVariant[];
}

export function BioSection({ variants }: BioSectionProps) {
  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
          Bio 📝
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {variants.map((variant) => (
            <div
              key={variant.label}
              className={`rounded-2xl border border-horchata-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-800${
                variant.colSpan === 2 ? " md:col-span-2" : ""
              }`}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-horchata-700">
                {variant.label}
              </h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-navy-600 dark:text-white/70">
                {variant.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
