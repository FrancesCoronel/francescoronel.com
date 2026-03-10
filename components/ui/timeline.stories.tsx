import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./timeline";

const experienceItems = [
  {
    title: "Senior Software Engineer",
    subtitle: "Slack",
    subtitleHref: "/organizations/slack",
    logo: "/images/organizations/slack.png",
    slug: "senior-software-engineer-slack",
    startDate: "2021-09",
    endDate: null as string | null,
    description:
      "Building core messaging experiences on the Messaging team, focusing on frontend architecture with React and TypeScript.",
    linkPrefix: "/experience",
  },
  {
    title: "Software Engineer",
    subtitle: "Byteboard",
    subtitleHref: "/organizations/byteboard",
    logo: "/images/organizations/byteboard.png",
    slug: "software-engineer-byteboard",
    startDate: "2020-01",
    endDate: "2021-08",
    description:
      "Built interviewing platform used by companies worldwide to run technical assessments.",
    linkPrefix: "/experience",
  },
  {
    title: "Software Engineer",
    subtitle: "JupiterOne",
    logo: "/images/organizations/jupiterone.png",
    slug: "software-engineer-jupiterone",
    startDate: "2019-01",
    endDate: "2020-01",
    description: "Built cybersecurity platform frontend with React and GraphQL.",
    linkPrefix: "/experience",
  },
];

const educationItems = [
  {
    title: "Master of Engineering in Computer Science",
    subtitle: "Cornell Tech",
    subtitleHref: "/organizations/cornell-tech",
    logo: "/images/organizations/cornell-tech.png",
    slug: "cornell-tech",
    startDate: "2016-08",
    endDate: "2017-05",
    description:
      "Studied computer science with a focus on product development and HCI.",
    linkPrefix: "/education",
  },
  {
    title: "Bachelor of Science in Computer Science",
    subtitle: "Hampton University",
    subtitleHref: "/organizations/hampton-university",
    logo: "/images/organizations/hampton-university.png",
    slug: "hampton-university",
    startDate: "2013-08",
    endDate: "2016-05",
    description: "Graduated magna cum laude with a focus on web development.",
    linkPrefix: "/education",
  },
];

const meta: Meta<typeof Timeline> = {
  title: "UI/Timeline",
  component: Timeline,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Experience: Story = {
  args: {
    items: experienceItems,
  },
};

export const Education: Story = {
  args: {
    items: educationItems,
    dark: true,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 600,
          padding: "2rem",
          backgroundColor: "#141726",
          borderRadius: "1rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
