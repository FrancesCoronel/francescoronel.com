import type { Meta, StoryObj } from "@storybook/react-vite";
import { CatalystBadge, type BadgeColor } from "./catalyst-badge";

const colors: BadgeColor[] = [
  "navy",
  "horchata",
  "green",
  "red",
  "yellow",
  "purple",
  "pink",
  "sky",
  "zinc",
];

const meta: Meta<typeof CatalystBadge> = {
  title: "UI/CatalystBadge",
  component: CatalystBadge,
  parameters: { layout: "padded" },
  argTypes: {
    color: {
      control: "select",
      options: colors,
    },
  },
};

export default meta;
type Story = StoryObj<typeof CatalystBadge>;

export const Default: Story = {
  args: {
    color: "horchata",
    children: "Speaker",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <CatalystBadge key={color} color={color}>
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </CatalystBadge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <CatalystBadge color="green">
        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Active
      </CatalystBadge>
      <CatalystBadge color="horchata">
        🚀 Speaking
      </CatalystBadge>
      <CatalystBadge color="navy">
        👩🏽‍💻 Engineering
      </CatalystBadge>
      <CatalystBadge color="red">
        Archived
      </CatalystBadge>
    </div>
  ),
};

export const SkillTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "Tailwind CSS", "GraphQL"].map((skill, i) => (
        <CatalystBadge
          key={skill}
          color={colors[i % colors.length]}
        >
          {skill}
        </CatalystBadge>
      ))}
    </div>
  ),
};
