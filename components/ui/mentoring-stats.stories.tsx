import type { Meta, StoryObj } from "@storybook/react-vite";
import { MentoringStats } from "./mentoring-stats";

const meta: Meta<typeof MentoringStats> = {
  title: "UI/MentoringStats",
  component: MentoringStats,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    totalSessions: {
      control: { type: "number", min: 0, step: 10 },
      description:
        "Override total sessions count — e.g. when live sessions are merged in at runtime",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MentoringStats>;

/** Default — uses the total sessions count from the static JSON file. */
export const Default: Story = {};

/** With a higher live session count merged in from the Calendly API. */
export const WithLiveSessions: Story = {
  args: {
    totalSessions: 500,
  },
};

/** Dark background — as seen on the mentoring page dark sections. */
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div
        className="rounded-2xl bg-navy-900 p-8"
        style={{ maxWidth: 720 }}
      >
        <Story />
      </div>
    ),
  ],
};
