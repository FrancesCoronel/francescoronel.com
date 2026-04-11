import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description:
    "Browse blog posts by category: tech, speaking, career, and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  const allCategories = getCategories();
  const categories = allCategories
    .filter((c) => (c.count ?? 0) > 0)
    .sort((a, b) => {
      if (a.slug === "uncategorized") return 1;
      if (b.slug === "uncategorized") return -1;
      return (b.count ?? 0) - (a.count ?? 0);
    });

  return (
    <>
      <PageHeader
        label="Blog"
        heading="Categories 📂"
        description="Browse blog posts organized by topic."
      />

      <section className="bg-horchata-100 py-16 md:py-20 dark:bg-navy-800">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-horchata-200 bg-white p-5 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:hover:border-navy-500"
              >
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                    {cat.name}
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt=""
                        className="h-5 w-5 object-contain"
                        aria-hidden="true"
                      />
                    )}
                  </h2>
                  {cat.description && (
                    <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                      {cat.description}
                    </p>
                  )}
                </div>
                <span className="ml-4 inline-flex min-w-[2rem] shrink-0 items-center justify-center rounded-full bg-horchata-400 px-2 py-1 text-sm font-medium text-navy-900 dark:bg-navy-500 dark:text-white">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConnectCTA />
    </>
  );
}
