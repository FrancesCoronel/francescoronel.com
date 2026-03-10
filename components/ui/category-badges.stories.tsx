import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Category badges use a uniform horchata/navy color scheme.
 * Each badge displays an image icon alongside the category name.
 */

const allCategories = [
  { slug: "awards", name: "Awards", image: "/images/categories/awards.png" },
  { slug: "blog", name: "Blog", image: "/images/categories/blog.png" },
  { slug: "education", name: "Education", image: "/images/categories/education.png" },
  { slug: "events", name: "Events", image: "/images/categories/events.png" },
  { slug: "experience", name: "Experience", image: "/images/categories/experience.png" },
  { slug: "freelancing", name: "Freelancing", image: "/images/categories/freelancing.png" },
  { slug: "mentoring", name: "Mentoring", image: "/images/categories/mentoring.png" },
  { slug: "newsletter", name: "Newsletter", image: "/images/categories/newsletter.png" },
  { slug: "philanthrophy", name: "Philanthrophy", image: "/images/categories/philanthropy.png" },
  { slug: "podcast", name: "Podcast", image: "/images/categories/podcast.png" },
  { slug: "portfolio", name: "Portfolio", image: "/images/categories/portfolio.png" },
  { slug: "press", name: "Press", image: "/images/categories/press.png" },
  { slug: "programs", name: "Programs", image: "/images/categories/programs.png" },
  { slug: "speaking", name: "Speaking", image: "/images/categories/speaking.png" },
];

function CategoryBadge({ name, image }: { name: string; image: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-horchata-100 px-3 py-1 text-xs font-medium text-horchata-800 transition-colors hover:bg-horchata-200 dark:bg-navy-700 dark:text-white/70">
      {image && (
        <img src={image} alt="" className="-my-0.5 h-4 w-4 object-contain" aria-hidden="true" />
      )}
      {name}
    </span>
  );
}

const meta: Meta = {
  title: "UI/Category Badges",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

/** All 14 category badges with uniform styling */
export const AllBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => (
        <CategoryBadge key={cat.slug} name={cat.name} image={cat.image} />
      ))}
    </div>
  ),
};

/** Badges on a light page background (horchata-50) */
export const OnLightBackground: Story = {
  render: () => (
    <div className="rounded-2xl p-6" style={{ backgroundColor: "#fdf8f3" }}>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <CategoryBadge key={cat.slug} name={cat.name} image={cat.image} />
        ))}
      </div>
    </div>
  ),
};

/** Badges on a dark card background (simulates dark mode) */
export const OnDarkBackground: Story = {
  render: () => (
    <div className="rounded-2xl bg-navy-900 p-6">
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <span key={cat.slug} className="flex items-center gap-1.5 rounded-full bg-navy-700 px-3 py-1 text-xs font-medium text-white/70">
            {cat.image && (
              <img src={cat.image} alt="" className="-my-0.5 h-4 w-4 object-contain" aria-hidden="true" />
            )}
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  ),
};

/** Multiple badges stacked (as they appear on a blog card) */
export const StackedOnCard: Story = {
  render: () => (
    <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-5">
      <p className="mb-2 text-xs text-gray-500">Feb 13, 2026 · 5 min read</p>
      <h3 className="mb-2 text-lg font-bold text-gray-900">
        I think I&apos;m becoming a cracked engineer
      </h3>
      <p className="mb-3 text-sm text-gray-600">
        AI tools have me in a new flow state...
      </p>
      <div className="flex flex-wrap gap-2">
        <CategoryBadge name="Blog" image="/images/categories/blog.png" />
        <CategoryBadge name="Speaking" image="/images/categories/speaking.png" />
      </div>
    </div>
  ),
};
