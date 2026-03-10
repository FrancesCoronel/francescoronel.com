import type { Meta, StoryObj } from "@storybook/react-vite";
import { LanguagesSection } from "./languages-section";

const meta: Meta<typeof LanguagesSection> = {
  title: "Sections/LanguagesSection",
  component: LanguagesSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LanguagesSection>;

/** Default languages section with English and Spanish (built-in defaults). */
export const Default: Story = {};
