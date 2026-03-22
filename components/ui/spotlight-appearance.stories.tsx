import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpotlightAppearance, SpotlightSpeakingSection } from "./spotlight-appearance";

const mockAppearances = [
  {
    title: "Building Developer Communities That Last",
    description:
      "A talk on what it takes to build sustainable developer communities — from starting a Slack channel to scaling a nonprofit.",
    event: "Grace Hopper Celebration 2024",
    cta: "Watch talk",
    href: "/blog/ghc-2024-talk",
  },
  {
    title: "Latina Leadership in Tech",
    description:
      "Sharing my journey from first-gen college student to Senior SWE at Slack, and what I wish I'd known earlier.",
    event: "Lesbians Who Tech Summit 2023",
    cta: "Watch talk",
    href: "/blog/lwt-2023",
  },
  {
    title: "Open Source as a Career Accelerator",
    description:
      "How contributing to open source helped me land my first job and grow my network without a traditional referral.",
    event: "TAPIA 2022",
    cta: "View slides",
    href: "/blog/tapia-2022",
  },
];

const meta: Meta<typeof SpotlightAppearance> = {
  title: "UI/SpotlightAppearance",
  component: SpotlightAppearance,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-lg px-4 py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SpotlightAppearance>;

export const Default: Story = {
  args: mockAppearances[0],
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-10 py-4">
      {mockAppearances.map((a) => (
        <SpotlightAppearance key={a.href} {...a} />
      ))}
    </div>
  ),
};

export const SpeakingGrouped: StoryObj<typeof SpotlightSpeakingSection> = {
  render: () => (
    <div className="max-w-2xl space-y-20 py-8">
      <SpotlightSpeakingSection
        heading="Conferences"
        appearances={mockAppearances.slice(0, 2)}
      />
      <SpotlightSpeakingSection
        heading="Podcasts & Panels"
        appearances={[
          {
            title: "Breaking into Tech as a First-Gen Latina",
            description:
              "A conversation about navigating imposter syndrome, community support, and finding your place in the industry.",
            event: "Techqueria Podcast",
            cta: "Listen",
            href: "/blog/techqueria-podcast",
          },
        ]}
      />
    </div>
  ),
};
