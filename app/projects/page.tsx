import type { Metadata } from "next";
import Image from "next/image";
import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { ConnectCTA } from "@/components/sections/connect-cta";
import { NewsletterCTA } from "@/components/sections/newsletter-cta";
import { getMultipleRepoStars } from "@/lib/github";
import { ProjectsGridClient } from "@/components/ui/projects-grid-client";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Side projects, open-source tools, hackathon builds, and work projects from Frances Coronel.",
  path: "/projects",
});

const FEATURED_SLUGS = ["latina-dev", "apprenticeships-me", "hire-me"];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>;
}) {
  const { skill } = await searchParams;
  const projects = getProjects();

  const reposToFetch = Object.fromEntries(
    projects.filter((p) => p.github).map((p) => [p.slug, p.github as string])
  );
  const starsMap = await getMultipleRepoStars(reposToFetch);
  const totalStars = Object.values(starsMap).reduce<number>((sum, s) => sum + (s ?? 0), 0);

  return (
    <>
      <PageHeader
        label="Built & Shipped"
        heading="Projects 🛠️"
        description="Side projects, open-source directories, hackathon builds, and notable work projects I've shipped over the years."
        aside={
          <Image
            src="/images/assets/rocket-illustration.webp"
            alt=""
            width={300}
            height={300}
            className="h-auto w-[200px] object-contain drop-shadow-lg sm:w-[260px] md:w-[360px]"
            aria-hidden="true"
          />
        }
      />

      {/* Stats bar */}
      {totalStars > 0 && (
        <div className="border-b border-horchata-200 bg-white py-4 dark:border-navy-700 dark:bg-navy-900">
          <div className="mx-auto flex max-w-[var(--container-max)] items-center gap-6 px-6 text-sm text-navy-500 dark:text-white/50">
            <a
              href="https://github.com/FrancesCoronel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-navy-700 dark:hover:text-white/80"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-semibold text-navy-700 dark:text-white/80">{totalStars.toLocaleString()}</span>
              total GitHub stars across all projects
            </a>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 fill-current text-horchata-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-semibold text-navy-700 dark:text-white/80">{Object.values(starsMap).filter((s) => s != null).length}</span>
              repos tracked
            </span>
          </div>
        </div>
      )}

      <ProjectsGridClient
        projects={projects}
        starsMap={starsMap}
        featuredSlugs={FEATURED_SLUGS}
        initialSkill={skill}
      />

      <NewsletterCTA />

      <ConnectCTA variant="projects" />
    </>
  );
}
