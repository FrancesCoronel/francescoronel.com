import type { Meta, StoryObj } from "@storybook/react-vite";
import { Marquee } from "./marquee";

const meta: Meta<typeof Marquee> = {
  title: "UI/Marquee",
  component: Marquee,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    speed: {
      control: { type: "number", min: 5, max: 120, step: 5 },
      description: "Animation duration in seconds — lower is faster",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Marquee>;

/** Organization logos marquee — matches the credentials marquee section. */
export const LogoStrip: Story = {
  args: {
    speed: 40,
  },
  render: ({ speed }) => (
    <div className="border-y border-horchata-200 bg-white py-6 dark:border-navy-700 dark:bg-navy-900">
      <Marquee speed={speed}>
        <div className="flex items-center gap-12 px-6">
          {[
            { name: "Slack", src: "/images/organizations/slack.png" },
            { name: "Asana", src: "/images/organizations/asana.png" },
            { name: "Cornell Tech", src: "/images/organizations/cornell-tech.png" },
            { name: "GitHub", src: "/images/organizations/github.png" },
            { name: "Goldman Sachs", src: "/images/organizations/goldman-sachs.png" },
            { name: "Hampton University", src: "/images/organizations/hampton-university.png" },
            { name: "Techqueria", src: "/images/organizations/techqueria.png" },
            { name: "Byteboard", src: "/images/organizations/byteboard.png" },
          ].map((logo) => (
            <div
              key={logo.name}
              className="flex h-12 w-24 flex-shrink-0 items-center justify-center grayscale hover:grayscale-0 transition-all"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-auto max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  ),
};

/** Text marquee — demonstrates the component with text items. */
export const TextStrip: Story = {
  args: {
    speed: 30,
  },
  render: ({ speed }) => (
    <div className="border-y border-navy-200 bg-navy-900 py-4">
      <Marquee speed={speed}>
        <div className="flex items-center gap-8 px-4 text-sm font-medium text-horchata-400">
          {[
            "100+ Speaking Events",
            "665+ Blog Posts",
            "400+ Mentoring Sessions",
            "10+ Years Experience",
            "Senior Engineer at Slack",
            "Cornell Tech MEng",
          ].map((item) => (
            <span key={item} className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-horchata-600">✦</span>
              {item}
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  ),
};

/** Slow speed — for accessibility-conscious contexts. */
export const Slow: Story = {
  args: {
    speed: 80,
  },
  render: ({ speed }) => (
    <div className="border-y border-horchata-200 bg-white py-6">
      <Marquee speed={speed}>
        <div className="flex items-center gap-12 px-6">
          {["Slack", "Asana", "Byteboard", "GitHub", "Cornell Tech", "Techqueria"].map(
            (name) => (
              <span
                key={name}
                className="whitespace-nowrap rounded-full border border-horchata-200 bg-horchata-50 px-4 py-1.5 text-sm font-medium text-navy-700"
              >
                {name}
              </span>
            )
          )}
        </div>
      </Marquee>
    </div>
  ),
};
