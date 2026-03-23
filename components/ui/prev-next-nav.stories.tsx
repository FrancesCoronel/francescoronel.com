import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrevNextNav } from "./prev-next-nav";

const meta: Meta<typeof PrevNextNav> = {
  title: "UI/PrevNextNav",
  component: PrevNextNav,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PrevNextNav>;

/** Both previous and next links — typical mid-series view. */
export const Default: Story = {
  args: {
    prev: {
      slug: "i-think-im-becoming-a-cracked-engineer",
      title: "I think I'm becoming a cracked engineer",
    },
    next: {
      slug: "funnels-metrics-and-experimentation-life-in-growth-engineering",
      title: "Funnels, Metrics, and Experimentation: Life in Growth Engineering",
    },
    basePath: "/blog",
  },
};

/** Only a next link — used for the first post in a series. */
export const NextOnly: Story = {
  args: {
    prev: null,
    next: {
      slug: "funnels-metrics-and-experimentation-life-in-growth-engineering",
      title: "Funnels, Metrics, and Experimentation: Life in Growth Engineering",
    },
    basePath: "/blog",
  },
};

/** Only a previous link — used for the last post in a series. */
export const PrevOnly: Story = {
  args: {
    prev: {
      slug: "reflecting-on-2025-looking-ahead-to-2026",
      title: "Reflecting on 2025, Looking Ahead to 2026",
    },
    next: null,
    basePath: "/blog",
  },
};

/** Used on testimonial detail pages. */
export const TestimonialBasePath: Story = {
  args: {
    prev: {
      slug: "alex-rivera",
      title: "Alex Rivera — Software Engineer at Google",
    },
    next: {
      slug: "maria-santos",
      title: "Maria Santos — Product Manager at Meta",
    },
    basePath: "/testimonials",
  },
};

/** Long titles that need to be clamped. */
export const LongTitles: Story = {
  args: {
    prev: {
      slug: "celebrating-community-and-career-growth-with-techqueria-at-salesforce-tower",
      title:
        "Celebrating Community and Career Growth with Techqueria at Salesforce Tower: A Night of Networking and Inspiration",
    },
    next: {
      slug: "mujeres-fuertes-honoring-latina-leadership-in-tech-at-ripples-fireside-chat",
      title:
        "Mujeres Fuertes: Honoring Latina Leadership in Tech at Ripple's Fireside Chat",
    },
    basePath: "/blog",
  },
};
