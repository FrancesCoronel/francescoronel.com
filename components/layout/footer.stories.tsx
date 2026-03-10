import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta: Meta<typeof Footer> = {
  title: "Layout/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

/** Full footer with brand, social links, and navigation columns */
export const Default: Story = {};
