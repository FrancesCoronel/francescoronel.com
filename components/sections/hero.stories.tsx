import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "./hero";

const meta: Meta<typeof Hero> = {
  title: "Sections/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

/** The main homepage hero with name, descriptors, headshot, memoji overlay, and CTA cards. */
export const Default: Story = {};
