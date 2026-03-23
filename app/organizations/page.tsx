import type { Metadata } from "next";
import {
  getOrganizations,
  getAllBlogPosts,
  getExperiences,
  getTestimonials,
  getAwards,
  getEducation,
  getProjects,
} from "@/lib/content";
import { OrgGridClient } from "@/components/ui/org-grid-client";
import { PageHeader } from "@/components/ui/page-header";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Organizations",
  description:
    "Organizations Frances Coronel has worked with, spoken for, and contributed to.",
  path: "/organizations",
});

export default function OrganizationsPage() {
  const organizations = getOrganizations();
  const allPosts = getAllBlogPosts();
  const experiences = getExperiences();
  const testimonials = getTestimonials();
  const awards = getAwards();
  const education = getEducation();
  const projects = getProjects();

  const orgsWithCounts = organizations
    .map((org) => {
      const orgName = org.name.toLowerCase();
      const postCount = allPosts.filter((p) =>
        p.organizations.some((o) => o.toLowerCase() === org.slug)
      ).length;
      const expCount = experiences.filter(
        (e) => e.company.toLowerCase() === orgName
      ).length;
      const testCount = testimonials.filter(
        (t) => t.organization.toLowerCase() === orgName
      ).length;
      const awardCount = awards.filter(
        (a) => a.organization.toLowerCase() === orgName
      ).length;
      const eduCount = education.filter(
        (e) => e.institution.toLowerCase() === orgName
      ).length;
      const projectCount = projects.filter(
        (p) => p.organization === org.slug
      ).length;
      const totalRefs = postCount + expCount + testCount + awardCount + eduCount + projectCount;

      return {
        name: org.name,
        slug: org.slug,
        logo: org.logo,
        url: org.url,
        totalRefs,
      };
    })
    .filter((org) => org.totalRefs > 0)
    .sort((a, b) => b.totalRefs - a.totalRefs);

  return (
    <>
      <PageHeader
        label="Network"
        heading="Organizations 🏢"
        description="Companies, conferences, and communities I've worked with throughout my career."
      />

      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <OrgGridClient organizations={orgsWithCounts} />
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
