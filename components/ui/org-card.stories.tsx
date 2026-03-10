import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Organization cards display a logo and name in a compact grid card.
 * Used on the About page and the Organizations listing page.
 * Cards link to individual organization detail pages.
 */

const mockOrgs = [
  { name: "Slack", slug: "slack", logo: "/images/organizations/slack.png" },
  { name: "GitHub", slug: "github", logo: "/images/organizations/github.png" },
  { name: "Asana", slug: "asana", logo: "/images/organizations/asana.png" },
  { name: "Byteboard", slug: "byteboard", logo: "/images/organizations/byteboard.png" },
  { name: "JupiterOne", slug: "jupiterone", logo: "/images/organizations/jupiterone.png" },
  { name: "Formation", slug: "formation", logo: "/images/organizations/formation.png" },
];

function OrgCard({ name, logo, refs }: { name: string; logo: string; refs?: number }) {
  return (
    <a
      href="#"
      className="flex flex-col items-center gap-3 rounded-xl border border-horchata-200 bg-white p-5 text-center transition-shadow hover:shadow-lg"
    >
      <img src={logo} alt={name} className="h-16 w-16 rounded-xl object-contain" />
      <p className="text-sm font-medium text-navy-900">{name}</p>
      {refs != null && refs > 0 && (
        <p className="text-xs text-navy-400">
          {refs} reference{refs !== 1 ? "s" : ""}
        </p>
      )}
    </a>
  );
}

const meta: Meta = {
  title: "UI/OrgCard",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

/** Single organization card */
export const Default: Story = {
  render: () => <OrgCard name="Slack" logo="/images/organizations/slack.png" />,
};

/** Card with reference count (as shown on /organizations page) */
export const WithRefs: Story = {
  render: () => <OrgCard name="Slack" logo="/images/organizations/slack.png" refs={12} />,
};

/** Grid of organization cards (as shown on About and Organizations pages) */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" style={{ maxWidth: 900 }}>
      {mockOrgs.map((org) => (
        <OrgCard key={org.slug} name={org.name} logo={org.logo} />
      ))}
    </div>
  ),
};

/** Grid with reference counts */
export const GridWithRefs: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" style={{ maxWidth: 900 }}>
      {mockOrgs.map((org, i) => (
        <OrgCard key={org.slug} name={org.name} logo={org.logo} refs={12 - i * 2} />
      ))}
    </div>
  ),
};

/** Fallback when logo is missing — shows first letter */
export const NoLogo: Story = {
  render: () => (
    <a
      href="#"
      className="flex flex-col items-center gap-3 rounded-xl border border-horchata-200 bg-white p-5 text-center transition-shadow hover:shadow-lg"
      style={{ width: 160 }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-horchata-100 text-xl font-bold text-horchata-600">
        A
      </div>
      <p className="text-sm font-medium text-navy-900">Accenture</p>
    </a>
  ),
};

/** Cards on dark background */
export const OnDarkBackground: Story = {
  render: () => (
    <div className="rounded-2xl p-6" style={{ backgroundColor: "#1a1e30" }}>
      <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 500 }}>
        {mockOrgs.slice(0, 3).map((org) => (
          <a
            key={org.slug}
            href="#"
            className="flex flex-col items-center gap-3 rounded-xl border border-navy-700 bg-navy-800 p-5 text-center transition-shadow hover:shadow-lg"
          >
            <img src={org.logo} alt={org.name} className="h-16 w-16 rounded-xl object-contain" />
            <p className="text-sm font-medium text-white">{org.name}</p>
          </a>
        ))}
      </div>
    </div>
  ),
};
