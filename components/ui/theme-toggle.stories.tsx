import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "./theme-toggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

/** Default — the icon button as it appears in the navigation bar. */
export const Default: Story = {};

/** On a light nav background — matches the site header context. */
export const OnLightBackground: Story = {
  decorators: [
    (Story) => (
      <div className="flex items-center gap-3 rounded-2xl border border-horchata-200 bg-white px-4 py-3">
        <span className="text-sm text-navy-600">Nav item</span>
        <Story />
        <span className="text-sm text-navy-600">Nav item</span>
      </div>
    ),
  ],
};

/** On a dark nav background — as used in dark mode. */
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="flex items-center gap-3 rounded-2xl bg-navy-900 px-4 py-3">
        <span className="text-sm text-horchata-200">Nav item</span>
        <Story />
        <span className="text-sm text-horchata-200">Nav item</span>
      </div>
    ),
  ],
};
