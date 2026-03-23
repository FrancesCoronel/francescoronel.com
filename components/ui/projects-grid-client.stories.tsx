import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectsGridClient } from "./projects-grid-client";
import type { Project } from "@/lib/types";

const mockProjects: Project[] = [
  {
    title: "Latina Dev",
    slug: "latina-dev",
    tagline: "Open-source directory of Latina software engineers",
    description:
      "Latina Dev is an open-source directory of Latina software engineers at the student, IC, and leadership levels to increase visibility and access to valuable opportunities.",
    highlights: [
      "Built and maintain an open-source directory at latina.dev to increase visibility for Latina software engineers",
    ],
    skills: ["open-source", "community-building"],
    logo: "",
    emoji: "👩🏽‍💻",
    url: "https://latina.dev",
    startDate: "2022-10-01T00:00:00.000Z",
    endDate: null,
    category: "open-source",
    status: "active",
    github: "Latina-Dev/latina-dev",
  },
  {
    title: "Apprenticeships.me",
    slug: "apprenticeships-me",
    tagline: "Directory of tech apprenticeships",
    description: "A directory of apprenticeships in the tech industry.",
    highlights: ["Open-source directory helping people find tech apprenticeships"],
    skills: ["open-source"],
    logo: "",
    emoji: "🔧",
    url: "https://apprenticeships.me",
    startDate: "2019-05-01T00:00:00.000Z",
    endDate: null,
    category: "open-source",
    status: "active",
    github: "FrancesCoronel/apprenticeships",
  },
  {
    title: "Tech Queens Podcast",
    slug: "tech-queens",
    tagline: "The first podcast exclusively for women of color in tech",
    description: "Tech Queens is the first and only podcast focused on women of color in tech.",
    highlights: [
      "Founded and hosted Tech Queens podcast",
      "Interviewed engineers, designers, and leaders",
    ],
    skills: ["podcast", "community-building"],
    logo: "",
    emoji: "🎙️",
    url: "https://anchor.fm/tech-queens",
    startDate: "2019-03-01T00:00:00.000Z",
    endDate: "2020-03-01T00:00:00.000Z",
    category: "podcast",
    status: "complete",
  },
  {
    title: "Slack Lists",
    slug: "slack-lists",
    tagline: "Task management built directly into Slack",
    description:
      "Led frontend development for Slack Lists, enabling teams to manage tasks without leaving Slack.",
    highlights: [
      "Shipped to millions of Slack users globally",
      "Built with React and TypeScript on the Slack platform",
    ],
    skills: ["react", "typescript"],
    logo: "/images/organizations/slack.png",
    url: "https://slack.com/features/lists",
    startDate: "2023-01-01T00:00:00.000Z",
    endDate: "2024-06-01T00:00:00.000Z",
    category: "work-project",
    status: "active",
    organization: "slack",
  },
  {
    title: "KentHack Enough 2017",
    slug: "kent-hack-enough-2017",
    tagline: "24-hour hackathon project — real-time event discovery app",
    description: "Built a real-time event discovery app during the KentHack Enough hackathon.",
    highlights: ["Won Best Use of Twilio API"],
    skills: ["javascript", "twilio"],
    logo: "/images/organizations/kent-hack-enough.png",
    url: "https://devpost.com/software/kent-hack-enough",
    startDate: "2017-10-01T00:00:00.000Z",
    endDate: "2017-10-02T00:00:00.000Z",
    category: "hackathon",
    status: "complete",
  },
  {
    title: "FVCproductions GitHub Profile",
    slug: "github-readme-project",
    tagline: "Custom GitHub profile README with dynamic stats",
    description: "Custom GitHub profile README showcasing projects and activity.",
    highlights: ["1k+ GitHub stars"],
    skills: ["github", "markdown"],
    logo: "/images/organizations/github.png",
    url: "https://github.com/FrancesCoronel",
    startDate: "2020-07-01T00:00:00.000Z",
    endDate: null,
    category: "side-project",
    status: "active",
    github: "FrancesCoronel/FrancesCoronel",
  },
];

const starsMap: Record<string, number | null> = {
  "latina-dev": 312,
  "apprenticeships-me": 847,
  "tech-queens": null,
  "slack-lists": null,
  "kent-hack-enough-2017": null,
  "github-readme-project": 1200,
};

const meta: Meta<typeof ProjectsGridClient> = {
  title: "UI/ProjectsGridClient",
  component: ProjectsGridClient,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ProjectsGridClient>;

/** Default view — featured projects highlighted, rest listed below. */
export const Default: Story = {
  args: {
    projects: mockProjects,
    starsMap,
    featuredSlugs: ["latina-dev", "apprenticeships-me", "slack-lists"],
  },
};

/** No featured projects — flat grid with all projects. */
export const NoFeatured: Story = {
  args: {
    projects: mockProjects,
    starsMap,
    featuredSlugs: [],
  },
};

/** Pre-filtered by skill — shows the active skill chip in the filter bar. */
export const PreFilteredBySkill: Story = {
  args: {
    projects: mockProjects,
    starsMap,
    featuredSlugs: ["latina-dev"],
    initialSkill: "open-source",
  },
};
