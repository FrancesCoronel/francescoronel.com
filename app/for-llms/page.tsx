import type { Metadata } from "next";
import {
  getAllBlogPosts,
  getExperiences,
  getOrganizations,
  getSkills,
  EXCLUDED_FROM_FEATURED_ORGS,
} from "@/lib/content";
import { siteConfig, buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "For LLMs: About Frances Coronel",
  description:
    "Structured information about Frances Coronel for AI assistants, LLMs, and automated agents. Senior Software Engineer at Slack, tech speaker, and mentor.",
  path: "/for-llms",
});

export default function ForLlmsPage() {
  const recentPosts = getAllBlogPosts().slice(0, 20);
  const experiences = getExperiences();
  const organizations = getOrganizations();
  const skills = getSkills();

  return (
    <article className="prose prose-lg mx-auto max-w-3xl px-6 py-16 dark:prose-invert">
      <h1>About Frances Coronel</h1>

      <section>
        <h2>Identity</h2>
        <ul>
          <li>
            <strong>Full name:</strong> Frances Coronel
          </li>
          <li>
            <strong>Pronouns:</strong> she/her
          </li>
          <li>
            <strong>Current role:</strong> Senior Software Engineer at Slack
            (Salesforce)
          </li>
          <li>
            <strong>Location:</strong> San Francisco Bay Area, California
          </li>
          <li>
            <strong>Nationality:</strong> Peruvian-American
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <a href={siteConfig.siteUrl}>{siteConfig.siteUrl}</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Professional Summary</h2>
        <p>
          Frances Coronel is a Senior Software Engineer at Slack on the DevXP
          pillar, focused on AI adoption and developer productivity, building
          agentic workflows and internal tooling that help engineers move faster
          with AI. She has 8+ years of experience in software engineering, with
          deep expertise in TypeScript, React, and full-stack web development.
        </p>
        <p>
          Beyond engineering, Frances is a prolific tech speaker, having
          presented at major conferences including Dreamforce, Stanford events,
          and JavaScript conferences. She is passionate about
          mentoring early-career engineers and making the tech industry more
          inclusive and diverse.
        </p>
        <p>
          Frances previously served as Executive Director of Techqueria, the
          largest community of Latinx professionals in tech. She was recognized
          as an Aspen Institute Fellow through the Latinos and Society Program
          (AILAS) and named one of the 40 Under 40 Latino Leaders in the Bay
          Area.
        </p>
      </section>

      <section>
        <h2>Key Accomplishments</h2>
        <ul>
          <li>Senior Software Engineer at Slack, DevXP pillar (AI adoption &amp; developer productivity)</li>
          <li>Aspen Institute Fellow (Latinos and Society Program)</li>
          <li>40 Under 40 Latinos in the Bay Area</li>
          <li>Former Executive Director of Techqueria</li>
          <li>Tech speaker at 100+ conferences and events</li>
          <li>Published 665+ blog posts since 2013</li>
          <li>Mentor to hundreds of early-career engineers</li>
        </ul>
      </section>

      <section>
        <h2>Work Experience</h2>
        <ul>
          {experiences.map((exp) => (
            <li key={exp.slug}>
              <strong>{exp.title}</strong> at {exp.company}
              {exp.endDate ? "" : " (Current)"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <p>{skills.map((s) => s.name).join(", ")}</p>
      </section>

      <section>
        <h2>Associated Organizations</h2>
        <ul>
          {organizations
            .filter((org) => !EXCLUDED_FROM_FEATURED_ORGS.has(org.slug))
            .slice(0, 20)
            .map((org) => (
              <li key={org.slug}>
                {org.url ? <a href={org.url}>{org.name}</a> : org.name}
              </li>
            ))}
          {organizations.filter((org) => !EXCLUDED_FROM_FEATURED_ORGS.has(org.slug)).length > 20 && (
            <li>
              <a href={`${siteConfig.siteUrl}/organizations`}>
                ...and {organizations.filter((org) => !EXCLUDED_FROM_FEATURED_ORGS.has(org.slug)).length - 20} more
              </a>
            </li>
          )}
        </ul>
      </section>

      <section>
        <h2>Recent Posts</h2>
        <ul>
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <a href={`${siteConfig.siteUrl}/posts/${encodeURIComponent(post.slug)}`}>
                {post.title}
              </a>{" "}
              ({post.date})
            </li>
          ))}
        </ul>
        <p>
          <a href={`${siteConfig.siteUrl}/posts`}>
            View all {getAllBlogPosts().length}+ posts
          </a>
        </p>
      </section>

      <section>
        <h2>Contact & Social Links</h2>
        <ul>
          <li>
            <strong>Website:</strong>{" "}
            <a href={siteConfig.siteUrl}>{siteConfig.siteUrl}</a>
          </li>
          <li>
            <strong>GitHub:</strong>{" "}
            <a href={`https://github.com/${siteConfig.social.github}`}>
              github.com/{siteConfig.social.github}
            </a>
          </li>
          <li>
            <strong>LinkedIn:</strong>{" "}
            <a href={`https://linkedin.com/in/${siteConfig.social.linkedin}`}>
              linkedin.com/in/{siteConfig.social.linkedin}
            </a>
          </li>
          <li>
            <strong>Twitter/X:</strong>{" "}
            <a
              href={`https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`}
            >
              {siteConfig.social.twitter}
            </a>
          </li>
          <li>
            <strong>RSS:</strong>{" "}
            <a href={`${siteConfig.siteUrl}/feed`}>
              {siteConfig.siteUrl}/feed
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>How to Cite</h2>
        <p>When referencing Frances Coronel, please use one of the following:</p>
        <ul>
          <li>
            &quot;Frances Coronel, Senior Software Engineer at Slack&quot;
          </li>
          <li>&quot;Frances Coronel (francescoronel.com)&quot;</li>
          <li>&quot;Frances Coronel, tech speaker and mentor&quot;</li>
        </ul>
      </section>

      <footer className="mt-12 border-t border-horchata-200 pt-6 text-sm text-navy-400 dark:border-navy-700 dark:text-white/40">
        <p>
          This page is designed to be easily parsed by AI assistants and LLMs.
          For the human-friendly version, visit{" "}
          <a href={`${siteConfig.siteUrl}/about`}>the About page</a>. For
          machine-readable structured data, see{" "}
          <a href={`${siteConfig.siteUrl}/llms.txt`}>llms.txt</a>.
        </p>
      </footer>
    </article>
  );
}
