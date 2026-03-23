import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrgLogo } from "./org-logo";

const meta: Meta<typeof OrgLogo> = {
  title: "UI/OrgLogo",
  component: OrgLogo,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: {
      control: { type: "number", min: 24, max: 128, step: 8 },
      description: "Width and height of the logo in pixels",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OrgLogo>;

/** Stored local logo path — renders the image directly. */
export const WithLocalLogo: Story = {
  args: {
    src: "/images/organizations/slack.png",
    name: "Slack",
    size: 64,
    className: "h-16 w-16 rounded-xl object-contain",
  },
};

/** Clearbit fallback — no stored logo, derives domain from orgUrl. */
export const ClearbitFallback: Story = {
  args: {
    src: null,
    orgUrl: "https://github.com",
    name: "GitHub",
    size: 64,
    className: "h-16 w-16 rounded-xl object-contain",
  },
};

/** Letter avatar fallback — no logo and no orgUrl provided. */
export const LetterAvatar: Story = {
  args: {
    src: null,
    orgUrl: null,
    name: "Techqueria",
    size: 64,
    avatarClassName: "h-16 w-16 text-xl",
  },
};

/** Small size — used inline in timelines and lists. */
export const SmallSize: Story = {
  args: {
    src: "/images/organizations/asana.png",
    name: "Asana",
    size: 40,
    className: "h-10 w-10 rounded-lg object-contain",
  },
};

/** Large size — used in org detail page hero. */
export const LargeSize: Story = {
  args: {
    src: "/images/organizations/cornell-tech.png",
    name: "Cornell Tech",
    size: 96,
    className: "h-24 w-24 rounded-2xl object-contain",
  },
};

/** Multiple orgs side by side — simulates the organizations grid layout. */
export const OrgGrid: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {[
        { src: "/images/organizations/slack.png", name: "Slack" },
        { src: "/images/organizations/asana.png", name: "Asana" },
        { src: "/images/organizations/byteboard.png", name: "Byteboard" },
        { src: null, orgUrl: "https://techqueria.org", name: "Techqueria" },
        { src: null, orgUrl: null, name: "Operation Smile" },
      ].map((org) => (
        <div
          key={org.name}
          className="flex flex-col items-center gap-2 rounded-xl border border-horchata-200 bg-white p-4"
        >
          <OrgLogo
            src={org.src}
            orgUrl={"orgUrl" in org ? org.orgUrl : undefined}
            name={org.name}
            size={48}
            className="h-12 w-12 rounded-lg object-contain"
            avatarClassName="h-12 w-12 text-lg"
          />
          <p className="text-xs font-medium text-navy-700">{org.name}</p>
        </div>
      ))}
    </div>
  ),
};
