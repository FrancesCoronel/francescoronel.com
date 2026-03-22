import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Metadata Audit — inspect the title, description, and OG image for every page.
 * Use this to verify unfurl previews before sharing links.
 *
 * Mirrors the `buildMetadata()` calls in each page file. Update here whenever
 * a page's metadata changes.
 */

const SITE_URL = "https://francescoronel.com";
const DEFAULT_OG = `${SITE_URL}/images/og/home.png`;

interface PageMeta {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  ogType?: string;
  dynamic?: boolean;
}

const PAGES: PageMeta[] = [
  {
    path: "/",
    title: "Frances Coronel",
    description:
      "Frances Coronel is a senior software engineer, a fierce advocate for diversity in tech, and a doting Corgi mom. 👩🏽‍💻",
    ogImage: DEFAULT_OG,
    ogType: "profile",
  },
  {
    path: "/about",
    title: "About | Frances Coronel",
    description:
      "Senior Software Engineer at Slack with 10+ years of experience. Learn about Frances Coronel's background, skills, experience, and education.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/blog",
    title: "Blog | Frances Coronel",
    description:
      "Thoughts, tutorials, and reflections on software engineering, tech culture, diversity & inclusion, and life in the Bay Area.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/blog/[slug]",
    title: "Post title | Frances Coronel",
    description: "Post excerpt (from frontmatter)",
    ogImage: `${SITE_URL}/images/og/blog/[slug].png — or featuredImage`,
    ogType: "article",
    dynamic: true,
  },
  {
    path: "/contact",
    title: "Contact | Frances Coronel",
    description:
      "Get in touch with Frances Coronel — open to speaking invitations, mentoring requests, and collaboration opportunities.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/mentoring",
    title: "Mentoring | Frances Coronel",
    description:
      "Frances Coronel offers 1-on-1 mentoring sessions for software engineers and underrepresented folks in tech.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/projects",
    title: "Projects | Frances Coronel",
    description:
      "Side projects, open-source tools, hackathon builds, and work projects from Frances Coronel.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/projects/[slug]",
    title: "Project title | Frances Coronel",
    description: "Project description",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/speaking",
    title: "Speaking | Frances Coronel",
    description:
      "Frances Coronel speaks on software engineering, diversity & inclusion, career growth, and Latina representation in tech.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/portfolio",
    title: "Portfolio | Frances Coronel",
    description:
      "Design portfolio showcasing UI/UX work, brand identities, and visual projects from Frances Coronel.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/testimonials",
    title: "Testimonials | Frances Coronel",
    description:
      "What colleagues, mentees, and collaborators say about working with Frances Coronel.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/testimonials/[slug]",
    title: "Testimonial from [name] | Frances Coronel",
    description: "Testimonial quote",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/organizations",
    title: "Organizations | Frances Coronel",
    description:
      "Companies, conferences, and communities Frances Coronel has worked with or been a part of.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/organizations/[slug]",
    title: "[Org] | Frances Coronel",
    description: "Organization description",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/awards",
    title: "Awards | Frances Coronel",
    description: "Honors and recognition Frances Coronel has received.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/awards/[slug]",
    title: "[Award] | Frances Coronel",
    description: "Award description",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/categories",
    title: "Categories | Frances Coronel",
    description: "Browse blog posts by category.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/categories/[slug]",
    title: "[Category] | Frances Coronel",
    description: "Posts in category",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/tags",
    title: "Tags | Frances Coronel",
    description: "Browse blog posts by tag.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/tags/[slug]",
    title: "[Tag] | Frances Coronel",
    description: "Posts tagged with [tag]",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/experience/[slug]",
    title: "[Role] at [Company] | Frances Coronel",
    description: "Work experience detail",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/education/[slug]",
    title: "[Degree] at [School] | Frances Coronel",
    description: "Education detail",
    ogImage: DEFAULT_OG,
    dynamic: true,
  },
  {
    path: "/now",
    title: "Now | Frances Coronel",
    description:
      "What Frances Coronel is currently focused on — inspired by nownownow.com.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/uses",
    title: "What I Use | Frances Coronel",
    description:
      "The hardware, software, and tools Frances Coronel uses day-to-day.",
    ogImage: DEFAULT_OG,
  },
  {
    path: "/for-llms",
    title: "For LLMs | Frances Coronel",
    description:
      "A structured, LLM-readable overview of Frances Coronel — background, experience, skills, and blog posts.",
    ogImage: DEFAULT_OG,
    ogType: "website",
  },
  {
    path: "/design-system",
    title: "Design System | Frances Coronel",
    description:
      "Colors, typography, and UI patterns used on francescoronel.com.",
    ogImage: DEFAULT_OG,
  },
];

// ─── Link Preview Card ───────────────────────────────────────────────────────

function LinkPreviewCard({ page }: { page: PageMeta }) {
  const hasCustomOg = page.ogImage !== DEFAULT_OG;
  const isDefaultOg = !hasCustomOg && !page.dynamic;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* OG Image preview */}
      <div className="relative flex h-32 items-center justify-center bg-gray-100">
        {page.dynamic ? (
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
            Dynamic — generated per item
          </span>
        ) : (
          <img
            src={page.ogImage}
            alt="OG image preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        {isDefaultOg && (
          <span className="absolute bottom-1 right-1 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700">
            default OG
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-mono text-gray-600">
            {page.path}
          </code>
          {page.dynamic && (
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
              dynamic
            </span>
          )}
          {page.ogType && page.ogType !== "website" && (
            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">
              {page.ogType}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold leading-tight text-gray-900">
          {page.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
          {page.description}
        </p>
        <p className="mt-1.5 text-[10px] text-gray-400 break-all">
          {page.ogImage}
        </p>
      </div>
    </div>
  );
}

// ─── Audit Table ─────────────────────────────────────────────────────────────

function MetadataAuditTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="border-b border-gray-200 px-3 py-2">Path</th>
            <th className="border-b border-gray-200 px-3 py-2">
              Title (≤60 chars)
            </th>
            <th className="border-b border-gray-200 px-3 py-2">
              Description (≤160 chars)
            </th>
            <th className="border-b border-gray-200 px-3 py-2">OG Image</th>
            <th className="border-b border-gray-200 px-3 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {PAGES.map((page) => {
            const titleLen = page.title.replace(/ \| Frances Coronel$/, "").length;
            const descLen = page.description.length;
            const titleWarn = !page.dynamic && titleLen > 60;
            const descWarn = !page.dynamic && descLen > 160;

            return (
              <tr key={page.path} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <code className="text-xs text-gray-600">{page.path}</code>
                  {page.dynamic && (
                    <span className="ml-1.5 rounded bg-blue-50 px-1 py-0.5 text-[10px] text-blue-600">
                      dyn
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={titleWarn ? "text-red-600" : "text-gray-800"}
                    title={titleWarn ? `${titleLen} chars — over 60!` : undefined}
                  >
                    {page.title}
                  </span>
                  {!page.dynamic && (
                    <span
                      className={`ml-1 text-[10px] ${titleWarn ? "text-red-400" : "text-gray-400"}`}
                    >
                      {titleLen}
                    </span>
                  )}
                </td>
                <td className="max-w-xs px-3 py-2">
                  <span
                    className={descWarn ? "text-red-600" : "text-gray-700"}
                    title={descWarn ? `${descLen} chars — over 160!` : undefined}
                  >
                    {page.description}
                  </span>
                  {!page.dynamic && (
                    <span
                      className={`ml-1 text-[10px] ${descWarn ? "text-red-400" : "text-gray-400"}`}
                    >
                      {descLen}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {page.ogImage === DEFAULT_OG ? (
                    <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-[10px] text-yellow-700">
                      default
                    </span>
                  ) : (
                    <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700">
                      custom
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  {page.ogType ?? "website"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Audit/Page Metadata",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

/** Card grid — simulates how links unfurl in Slack, iMessage, Twitter, etc. */
export const UnfurlPreviews: Story = {
  render: () => (
    <div className="p-8 font-sans">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        Page Metadata Audit
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Simulates link unfurl previews. Yellow "default OG" badge = no
        page-specific image yet.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PAGES.map((page) => (
          <LinkPreviewCard key={page.path} page={page} />
        ))}
      </div>
    </div>
  ),
};

/** Table view — shows character counts and highlights anything over the limit. */
export const MetadataTable: Story = {
  render: () => (
    <div className="p-8 font-sans">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        Metadata Table
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Red = over recommended limit (title &gt; 60, description &gt; 160).
        Numbers shown are character counts (excluding "| Frances Coronel"
        suffix).
      </p>
      <MetadataAuditTable />
    </div>
  ),
};
