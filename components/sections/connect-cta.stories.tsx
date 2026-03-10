import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConnectCTA } from "./connect-cta";

const meta: Meta<typeof ConnectCTA> = {
  title: "Sections/ConnectCTA",
  component: ConnectCTA,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ConnectCTA>;

/** Default CTA — general "Let's Connect" with contact + mentoring buttons. */
export const Default: Story = {
  args: {
    variant: "default",
  },
};

/** Speaking variant — "Want Me to Speak?" with booking + past talks buttons. */
export const Speaking: Story = {
  args: {
    variant: "speaking",
  },
};

/** Mentoring variant — "Level Up Your Career" with mentoring + contact buttons. */
export const Mentoring: Story = {
  args: {
    variant: "mentoring",
  },
};

/** Follow variant — "Stay in the Loop" with LinkedIn + mentoring buttons. */
export const Follow: Story = {
  args: {
    variant: "follow",
  },
};

/** Hire variant — "Let's Work Together" with contact + speaking buttons. */
export const Hire: Story = {
  args: {
    variant: "hire",
  },
};
