interface Language {
  flag: string;
  name: string;
  level: string;
}

interface LanguagesSectionProps {
  languages?: Language[];
}

const defaultLanguages: Language[] = [
  { flag: "🇺🇸", name: "English", level: "Native / Bilingual" },
  { flag: "🇵🇪", name: "Spanish", level: "Native / Bilingual" },
];

export function LanguagesSection({
  languages = defaultLanguages,
}: LanguagesSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-horchata-100">
          Languages 🌎
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-4 rounded-2xl border border-horchata-200 bg-white px-6 py-5 dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="text-4xl">{lang.flag}</span>
              <div>
                <p className="text-lg font-bold text-navy-900 dark:text-horchata-100">
                  {lang.name}
                </p>
                <p className="text-sm text-navy-500 dark:text-horchata-400">
                  {lang.level}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
