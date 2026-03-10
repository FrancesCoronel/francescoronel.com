import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionCards } from "./action-cards";

const meta: Meta<typeof ActionCards> = {
  title: "Sections/ActionCards",
  component: ActionCards,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ActionCards>;

/** Default 3-column CTA cards — Mentoring, Speaking, Blog. */
export const Default: Story = {
  args: {
    cards: [
      {
        label: "Mentoring",
        description: "Book a 1:1 session with me",
        href: "/mentoring",
        image: "/images/assets/mentoring-cta.webp",
      },
      {
        label: "Speaking",
        description: "Hire me for your next event",
        href: "/speaking",
        image: "/images/assets/speaking-microphone.png",
      },
      {
        label: "Blog",
        description: "Read my latest posts and insights",
        href: "/blog",
        image: "/images/assets/newsletter-cta.webp",
      },
    ],
  },
};
