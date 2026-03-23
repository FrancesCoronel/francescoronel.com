import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoCarousel } from "./logo-carousel";

const meta: Meta<typeof LogoCarousel> = {
  title: "UI/LogoCarousel",
  component: LogoCarousel,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LogoCarousel>;

const employerLogos = [
  { name: "Slack", image: "/images/organizations/slack.png", url: "https://slack.com" },
  { name: "Asana", image: "/images/organizations/asana.png", url: "https://asana.com" },
  { name: "Byteboard", image: "/images/organizations/byteboard.png", url: "https://byteboard.dev" },
  {
    name: "JupiterOne",
    image: "/images/organizations/jupiterone.png",
    url: "https://jupiterone.com",
  },
  {
    name: "Accenture",
    image: "/images/organizations/accenture.png",
    url: "https://accenture.com",
  },
  {
    name: "Goldman Sachs",
    image: "/images/organizations/goldman-sachs.png",
    url: "https://goldmansachs.com",
  },
];

const conferenceLogos = [
  { name: "Cornell Tech", image: "/images/organizations/cornell-tech.png" },
  { name: "GitHub", image: "/images/organizations/github.png" },
  { name: "Techqueria", image: "/images/organizations/techqueria.png" },
  { name: "Women Who Code", image: "/images/organizations/women-who-code.png" },
  { name: "Stanford University", image: "/images/organizations/stanford-university.png" },
  { name: "LTX Fest", image: "/images/organizations/ltx-fest.png" },
];

/** Featured employer logos with links — matches the homepage credentials section. */
export const EmployersWithLinks: Story = {
  args: {
    title: "Companies I've worked with",
    logos: employerLogos,
  },
};

/** Conference and community logos without links. */
export const ConferencesNoLinks: Story = {
  args: {
    title: "Communities & conferences",
    logos: conferenceLogos,
  },
};

/** Many logos — stress test for seamless loop. */
export const ManyLogos: Story = {
  args: {
    title: "Organizations",
    logos: [...employerLogos, ...conferenceLogos],
  },
};
