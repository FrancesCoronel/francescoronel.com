import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimelineSection } from "./timeline-section";

const meta: Meta<typeof TimelineSection> = {
  title: "Sections/TimelineSection",
  component: TimelineSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TimelineSection>;

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
    subtitle: "Byteboard (acquired by Google)",
    subtitleHref: "/organizations/byteboard",
    logo: "/images/organizations/byteboard.png",
    slug: "software-engineer-byteboard",
    startDate: "2020-01",
    endDate: "2021-08",
    description:
      "Built an interviewing platform used by hundreds of companies to run technical assessments at scale.",
    linkPrefix: "/experience",
  },
  {
    title: "Software Engineer",
    subtitle: "JupiterOne",
    subtitleHref: "/organizations/jupiterone",
    logo: "/images/organizations/jupiterone.png",
    slug: "software-engineer-jupiterone",
    startDate: "2019-01",
    endDate: "2020-01",
    description:
      "Built cybersecurity asset management platform frontend with React and GraphQL.",
    linkPrefix: "/experience",
  },
  {
    title: "Software Engineer",
    subtitle: "Accenture",
    subtitleHref: "/organizations/accenture",
    logo: "/images/organizations/accenture.png",
    slug: "software-engineer-accenture",
    startDate: "2017-06",
    endDate: "2018-12",
    description:
      "Developed enterprise web applications for Fortune 500 clients using JavaScript and cloud services.",
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
      "Studied computer science with a focus on product development, HCI, and connective media. Built studio projects with real startup clients.",
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
    description:
      "Graduated magna cum laude with a focus on web development and algorithms. Active in ACM and the CS honor society.",
    linkPrefix: "/education",
  },
];

/** Work experience timeline on a light background. */
export const Experience: Story = {
  args: {
    id: "experience",
    label: "Career",
    heading: "Work Experience \ud83d\udcbc",
    items: experienceItems,
  },
};

/** Education timeline on a dark/alternate background. */
export const Education: Story = {
  args: {
    id: "education",
    label: "Learning",
    heading: "Education \ud83c\udf93",
    items: educationItems,
    dark: true,
  },
};

/** Single-item timeline. */
export const SingleItem: Story = {
  args: {
    id: "current-role",
    label: "Current",
    heading: "Where I Work Now \ud83d\udc69\ud83c\udffd\u200d\ud83d\udcbb",
    items: [experienceItems[0]],
  },
};

