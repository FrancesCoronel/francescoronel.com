import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrganizationsPreview } from "./organizations-preview";

const meta: Meta<typeof OrganizationsPreview> = {
  title: "Sections/OrganizationsPreview",
  component: OrganizationsPreview,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof OrganizationsPreview>;

const mockOrganizations = [
  {
    slug: "slack",
    name: "Slack",
    logo: "/images/organizations/slack.png",
  },
  {
    slug: "techqueria",
    name: "Techqueria",
    logo: "/images/organizations/techqueria.png",
  },
  {
    slug: "cornell-tech",
    name: "Cornell Tech",
    logo: "/images/organizations/cornell-tech.png",
  },
  {
    slug: "hampton-university",
    name: "Hampton University",
    logo: "/images/organizations/hampton-university.png",
  },
  {
    slug: "byteboard",
    name: "Byteboard",
    logo: "/images/organizations/byteboard.png",
  },
  {
    slug: "jupiterone",
    name: "JupiterOne",
    logo: "/images/organizations/jupiterone.png",
  },
  {
    slug: "accenture",
    name: "Accenture",
    logo: "/images/organizations/accenture.png",
  },
  {
    slug: "aspen-institute",
    name: "Aspen Institute",
    logo: "/images/organizations/aspen-institute.png",
  },
  {
    slug: "girl-develop-it",
    name: "Girl Develop It",
    logo: "/images/organizations/girl-develop-it.png",
  },
  {
    slug: "lesbians-who-tech",
    name: "Lesbians Who Tech",
    logo: "/images/organizations/lesbians-who-tech.png",
  },
];

/** Organizations grid with 10 org logos, "View all" link at top right. */
export const Default: Story = {
  args: {
    organizations: mockOrganizations,
  },
};
