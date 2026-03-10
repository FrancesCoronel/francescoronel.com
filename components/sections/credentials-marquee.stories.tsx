import type { Meta, StoryObj } from "@storybook/react-vite";
import { CredentialsMarquee } from "./credentials-marquee";

const meta: Meta<typeof CredentialsMarquee> = {
  title: "Sections/CredentialsMarquee",
  component: CredentialsMarquee,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CredentialsMarquee>;

/** Scrolling marquee of credentials and descriptors with emoji badges. */
export const Default: Story = {};
