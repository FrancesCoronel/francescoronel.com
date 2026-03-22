import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpotlightCard } from "./spotlight-card";

const meta: Meta<typeof SpotlightCard> = {
  title: "UI/SpotlightCard",
  component: SpotlightCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md px-4 py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SpotlightCard>;

export const Default: Story = {
  args: {
    href: "/blog/cracked-engineer",
    eyebrow: "February 13, 2026",
    eyebrowDate: "2026-02-13",
    title: "I think I'm becoming a cracked engineer",
    description:
      "AI tools have me in a new flow state. Here's how I've been using them to level up my engineering workflow.",
    cta: "Read article",
  },
};

export const WithDecoration: Story = {
  args: {
    href: "/blog/cracked-engineer",
    eyebrow: "February 13, 2026",
    eyebrowDate: "2026-02-13",
    decorate: true,
    title: "I think I'm becoming a cracked engineer",
    description:
      "AI tools have me in a new flow state. Here's how I've been using them to level up my engineering workflow.",
    cta: "Read article",
  },
};

export const NoEyebrow: Story = {
  args: {
    href: "/projects/latina-dev",
    title: "Latina Dev",
    description:
      "A community for Latina women in tech — job board, resources, and events.",
    cta: "View project",
  },
};

export const ListOfCards: Story = {
  render: () => (
    <div className="flex flex-col gap-10 py-4">
      {[
        {
          href: "/blog/cracked-engineer",
          eyebrow: "Feb 13, 2026",
          eyebrowDate: "2026-02-13",
          title: "I think I'm becoming a cracked engineer",
          description: "AI tools have me in a new flow state.",
          cta: "Read article",
        },
        {
          href: "/blog/slack-engineering",
          eyebrow: "Jan 5, 2026",
          eyebrowDate: "2026-01-05",
          title: "What I learned in my first year at Slack",
          description: "Reflections on joining a new team, a new codebase, and a new culture.",
          cta: "Read article",
        },
        {
          href: "/blog/mentoring-impact",
          eyebrow: "Nov 20, 2025",
          eyebrowDate: "2025-11-20",
          title: "500+ mentoring sessions later",
          description:
            "Looking back at what I've learned from mentoring hundreds of engineers.",
          cta: "Read article",
        },
      ].map((item) => (
        <SpotlightCard key={item.href} {...item} />
      ))}
    </div>
  ),
};

export const CompactNoDescription: Story = {
  args: {
    href: "/speaking/devrel-summit-2025",
    eyebrow: "DevRel Summit 2025",
    decorate: true,
    title: "Building Developer Communities That Last",
    cta: "View talk",
  },
};
