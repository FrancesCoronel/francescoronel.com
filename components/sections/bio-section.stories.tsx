import type { Meta, StoryObj } from "@storybook/react-vite";
import { BioSection } from "./bio-section";

const meta: Meta<typeof BioSection> = {
  title: "Sections/BioSection",
  component: BioSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BioSection>;

/** Bio section with multiple variant cards, including a full-width long bio. */
export const Default: Story = {
  args: {
    variants: [
      {
        label: "Short Bio",
        content: (
          <p>
            Frances Coronel is a senior software engineer at Slack where she
            builds core messaging experiences. She is a proud Peruvian-American
            and an advocate for diversity in tech.
          </p>
        ),
      },
      {
        label: "Speaking Bio",
        content: (
          <p>
            Frances Coronel is a senior software engineer at Slack and a
            seasoned tech speaker who has presented at 100+ events globally on
            topics including TypeScript, career growth, and building inclusive
            engineering teams.
          </p>
        ),
      },
      {
        label: "Long Bio",
        colSpan: 2,
        content: (
          <>
            <p>
              Frances Coronel is a senior software engineer at Slack, where she
              works on the Messaging team building the core experiences used by
              millions of people every day. With over 10 years of experience in
              software engineering, she has worked at companies ranging from
              early-stage startups to major tech enterprises.
            </p>
            <p>
              She holds a Master of Engineering in Computer Science from Cornell
              Tech and a Bachelor of Science in Computer Science from Hampton
              University. Frances is passionate about mentoring the next
              generation of engineers and has spoken at over 100 conferences and
              events worldwide.
            </p>
            <p>
              Outside of work, Frances is a proud corgi mom to Luna and
              Sue&ntilde;o, an Aspen Institute Fellow, and was recognized as one
              of the 40 Under 40 Latino Leaders in Tech.
            </p>
          </>
        ),
      },
    ],
  },
};
