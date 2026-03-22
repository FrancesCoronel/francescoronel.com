import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpotlightSection, SpotlightSectionGroup } from "./spotlight-section";

const meta: Meta<typeof SpotlightSection> = {
  title: "UI/SpotlightSection",
  component: SpotlightSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SpotlightSection>;

export const Default: Story = {
  args: {
    title: "Work",
    children: (
      <div className="space-y-6">
        {[
          {
            company: "Slack",
            role: "Senior Software Engineer",
            dates: "2023 – Present",
          },
          {
            company: "Accenture",
            role: "Software Engineering Analyst",
            dates: "2017 – 2020",
          },
        ].map((item) => (
          <div key={item.company} className="flex justify-between">
            <div>
              <p className="font-medium text-navy-800 dark:text-navy-100">
                {item.company}
              </p>
              <p className="text-sm text-navy-500 dark:text-navy-400">
                {item.role}
              </p>
            </div>
            <p className="ml-4 shrink-0 text-sm text-navy-400 dark:text-navy-500">
              {item.dates}
            </p>
          </div>
        ))}
      </div>
    ),
  },
};

export const WithCards: Story = {
  args: {
    title: "Projects",
    children: (
      <div className="space-y-4">
        {[
          { title: "Latina Dev", desc: "Community for Latina women in tech" },
          { title: "Apprenticeships.me", desc: "Directory of software apprenticeship programs" },
          { title: "hire.me", desc: "Personal hiring page" },
        ].map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-horchata-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800"
          >
            <p className="font-medium text-navy-800 dark:text-navy-100">
              {p.title}
            </p>
            <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    ),
  },
};

export const GroupedSections: StoryObj<typeof SpotlightSectionGroup> = {
  render: () => (
    <SpotlightSectionGroup>
      <SpotlightSection title="Work">
        <div className="space-y-4">
          <p className="text-sm text-navy-600 dark:text-navy-400">
            Senior Software Engineer at Slack (2023–Present)
          </p>
          <p className="text-sm text-navy-600 dark:text-navy-400">
            Software Engineering Analyst at Accenture (2017–2020)
          </p>
        </div>
      </SpotlightSection>

      <SpotlightSection title="Education">
        <div className="space-y-4">
          <p className="text-sm text-navy-600 dark:text-navy-400">
            Cornell University — B.S. Information Science, 2017
          </p>
        </div>
      </SpotlightSection>

      <SpotlightSection title="Speaking">
        <div className="space-y-4">
          {[
            "Grace Hopper Celebration 2023",
            "Lesbians Who Tech 2022",
            "TAPIA Celebration of Diversity 2021",
          ].map((event) => (
            <p key={event} className="text-sm text-navy-600 dark:text-navy-400">
              {event}
            </p>
          ))}
        </div>
      </SpotlightSection>
    </SpotlightSectionGroup>
  ),
};
