import Link from "next/link";
import { OrgLogo } from "@/components/ui/org-logo";

interface OrgPreview {
  slug: string;
  name: string;
  logo: string;
  url?: string;
}

interface OrganizationsPreviewProps {
  organizations: OrgPreview[];
}

export function OrganizationsPreview({
  organizations,
}: OrganizationsPreviewProps) {
  if (organizations.length === 0) return null;

  return (
    <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
              Network
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 dark:text-horchata-100">
              Organizations 🏢
            </h2>
          </div>
          <Link
            href="/organizations"
            className="text-sm font-medium text-horchata-800 hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {organizations.map((org) => (
            <Link
              key={org.slug}
              href={`/organizations/${org.slug}`}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-horchata-200 bg-white p-5 text-center transition-shadow hover:shadow-lg dark:border-navy-700 dark:bg-navy-800"
            >
              <OrgLogo
                src={org.logo}
                orgUrl={org.url}
                name={org.name}
                size={64}
                className="h-16 w-16 rounded-xl object-contain"
                avatarClassName="h-16 w-16 text-xl"
              />
              <p className="text-sm font-medium text-navy-900 dark:text-horchata-100">
                {org.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
