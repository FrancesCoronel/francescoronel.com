import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemojiSection } from "./memoji-section";

const meta: Meta<typeof MemojiSection> = {
  title: "Sections/MemojiSection",
  component: MemojiSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof MemojiSection>;

/** Default memoji grid with all 10 moods (built-in defaults). */
export const Default: Story = {};
