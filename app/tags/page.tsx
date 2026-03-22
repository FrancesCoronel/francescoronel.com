import type { Metadata } from "next";
import Link from "next/link";
import { getTags } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Tags",
  description:
    "Browse blog posts by tag.",
  path: "/tags",
});

export default function TagsPage() {
  const tags = getTags()
    .filter((t) => (t.count ?? 0) > 0)
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  return (
    <>
      <PageHeader
        label="Blog"
        heading="Tags 🏷️"
        description="Browse blog posts by tag."
      />

      <section className="bg-horchata-100 py-16 md:py-20 dark:bg-navy-800">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="group flex items-center gap-2 rounded-full border border-horchata-200 bg-white px-4 py-2 transition-all hover:border-horchata-400 hover:shadow-md dark:border-navy-700 dark:hover:border-navy-500"
              >
                <span className="text-sm font-medium text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                  {tag.name}
                </span>
                <span className="flex items-center justify-center rounded-full bg-horchata-400 px-2.5 py-1 text-xs font-medium leading-none text-navy-900 dark:bg-navy-500 dark:text-white">
                  {tag.count}
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
