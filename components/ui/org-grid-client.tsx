"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/cloudinary";

interface OrgSummary {
  name: string;
  slug: string;
  logo: string;
  totalRefs: number;
}

export function OrgGridClient({ organizations }: { organizations: OrgSummary[] }) {
  return (
    <>
      <p className="mt-6 text-sm text-navy-500 dark:text-horchata-400">
        {organizations.length} organization{organizations.length !== 1 ? "s" : ""}
      </p>

      {organizations.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {organizations.map((org) => (
            <Link
              key={org.slug}
              href={`/organizations/${org.slug}`}
              className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-horchata-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-navy-700 dark:bg-navy-800"
            >
              {org.logo ? (
                <Image
                  src={resolveImageUrl(org.logo)}
                  alt={org.name}
                  width={80}
                  height={80}
                  className="h-16 w-16 rounded-xl object-contain"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-horchata-100 text-xl font-bold text-horchata-600 dark:bg-navy-700 dark:text-horchata-400">
                  {org.name.charAt(0)}
                </div>
              )}
              <p className="text-sm font-medium text-navy-900 dark:text-horchata-100">
                {org.name}
              </p>
              {org.totalRefs > 0 && (
                <p className="text-xs text-navy-400 dark:text-horchata-500">
                  {org.totalRefs} reference{org.totalRefs !== 1 ? "s" : ""}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-navy-500 dark:text-horchata-400">
            No organizations found.
          </p>
        </div>
      )}
    </>
  );
}
