import type { Metadata } from "next";
import {
  getOrganizations,
  getAllBlogPosts,
  getExperiences,
  getTestimonials,
  getAwards,
  getEducation,
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
      const totalRefs = postCount + expCount + testCount + awardCount + eduCount;

      return {
        name: org.name,
        slug: org.slug,
        logo: org.logo,
        url: org.url,
        totalRefs,
      };
    })
    .sort((a, b) => b.totalRefs - a.totalRefs);

  return (
    <>
      <PageHeader
        label="Network"
        heading="Organizations 🏢"
        description="Companies, conferences, and communities I've worked with throughout my career."
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <OrgGridClient organizations={orgsWithCounts} />
        </div>
      </section>

      <ConnectCTA variant="hire" />
    </>
  );
}
