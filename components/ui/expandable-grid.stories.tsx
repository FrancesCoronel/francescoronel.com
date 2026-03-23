import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpandableGrid } from "./expandable-grid";

const meta: Meta<typeof ExpandableGrid> = {
  title: "UI/ExpandableGrid",
  component: ExpandableGrid,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    initialCount: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of children visible before the Show More button appears",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExpandableGrid>;

/** Grid of organization cards — matches the org detail page usage. */
export const OrgCards: Story = {
  render: () => {
    const orgs = [
      "Slack", "Asana", "Byteboard", "Techqueria", "Code Nation",
      "Cornell Tech", "Hampton University", "GitHub", "Google", "Netflix",
      "Women Who Code", "Latinas in Tech",
    ];
    return (
      <ExpandableGrid
        initialCount={6}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      >
        {orgs.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center rounded-xl border border-horchata-200 bg-white p-5 text-sm font-medium text-navy-700"
          >
            {name}
          </div>
        ))}
      </ExpandableGrid>
    );
  },
};

/** Fewer items than initialCount — no "Show more" button appears. */
export const NoOverflow: Story = {
  render: () => {
    const items = ["Slack", "Asana", "Byteboard"];
    return (
      <ExpandableGrid
        initialCount={6}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {items.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center rounded-xl border border-horchata-200 bg-white p-5 text-sm font-medium text-navy-700"
          >
            {name}
          </div>
        ))}
      </ExpandableGrid>
    );
  },
};

/** Large set — many items hidden, shows count in the button. */
export const ManyItems: Story = {
  render: () => {
    const items = Array.from({ length: 24 }, (_, i) => `Organization ${i + 1}`);
    return (
      <ExpandableGrid
        initialCount={6}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      >
        {items.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center rounded-xl border border-horchata-200 bg-white p-5 text-sm font-medium text-navy-700"
          >
            {name}
          </div>
        ))}
      </ExpandableGrid>
    );
  },
};
