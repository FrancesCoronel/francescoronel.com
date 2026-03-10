import type { Meta, StoryObj } from "@storybook/react-vite";
import { Nav } from "./nav";

const meta: Meta<typeof Nav> = {
  title: "Layout/Nav",
  component: Nav,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Nav>;

/** Default navigation bar as it appears on the homepage */
export const Default: Story = {};

/** Navigation at mobile viewport width — shows hamburger icon */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
