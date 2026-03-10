import type { Meta, StoryObj } from "@storybook/react-vite";
import { AwardsSection } from "./awards-section";

const meta: Meta<typeof AwardsSection> = {
  title: "Sections/AwardsSection",
  component: AwardsSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AwardsSection>;

const mockAwards = [
  {
    slug: "40-under-40-latino-leaders",
    title: "40 Under 40 Latino Leaders in Tech",
    date: "2023-10-15",
    url: "https://example.com/40-under-40",
  },
  {
    slug: "aspen-institute-fellow",
    title: "Aspen Institute Civil Society Fellow",
    date: "2022-06-01",
    url: "https://example.com/aspen-fellow",
  },
  {
    slug: "tech-diversity-award",
    title: "Tech Diversity & Inclusion Champion",
    date: "2021-11-20",
  },
  {
    slug: "rising-star-engineering",
    title: "Rising Star in Software Engineering",
    date: "2020-09-10",
    url: "https://example.com/rising-star",
  },
  {
    slug: "community-impact-award",
    title: "Community Impact Award - Techqueria",
    date: "2019-05-15",
  },
  {
    slug: "cornell-tech-recognition",
    title: "Cornell Tech Outstanding Alumni",
    date: "2023-04-22",
    url: "https://example.com/cornell-alumni",
  },
];

/** Awards grid with a mix of external-linked and internal-linked awards. */
export const Default: Story = {
  args: {
    awards: mockAwards,
  },
};

/** Awards with blog post mapping — some awards link to blog posts instead of external URLs. */
export const WithBlogPosts: Story = {
  args: {
    awards: mockAwards,
    blogPostMap: {
      "40-under-40-latino-leaders": "40-under-40-latino-leaders-in-tech",
      "aspen-institute-fellow": "becoming-an-aspen-institute-fellow",
    },
  },
};

/** Single award card. */
export const SingleAward: Story = {
  args: {
    awards: [
      {
        slug: "40-under-40-latino-leaders",
        title: "40 Under 40 Latino Leaders in Tech",
        date: "2023-10-15",
        url: "https://example.com/40-under-40",
      },
    ],
  },
};
