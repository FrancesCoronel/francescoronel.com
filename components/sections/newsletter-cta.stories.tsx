import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsletterCTA } from "./newsletter-cta";

const meta: Meta<typeof NewsletterCTA> = {
  title: "Sections/NewsletterCTA",
  component: NewsletterCTA,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NewsletterCTA>;

/**
 * Full newsletter CTA section — dark navy card with illustration,
 * headline, and email subscribe form. Appears on the blog and homepage.
 */
export const Default: Story = {};
