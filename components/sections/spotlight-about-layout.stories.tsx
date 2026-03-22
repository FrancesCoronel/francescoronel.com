import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpotlightAboutLayout, type SocialLink } from "./spotlight-about-layout";

const socialLinks: SocialLink[] = [
  {
    label: "Follow on LinkedIn",
    href: "https://www.linkedin.com/in/francescoronel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Follow on GitHub",
    href: "https://github.com/FrancesCoronel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Follow on YouTube",
    href: "https://www.youtube.com/c/FrancesVCoronel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const meta: Meta<typeof SpotlightAboutLayout> = {
  title: "Sections/SpotlightAboutLayout",
  component: SpotlightAboutLayout,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-4xl py-12">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SpotlightAboutLayout>;

export const Default: Story = {
  args: {
    heading: "I'm Frances. I build software and communities from the Bay Area.",
    paragraphs: [
      "I'm a Senior Software Engineer at Slack, where I work on the platform team building developer tools that reach millions of users every day.",
      "I've been passionate about technology since I taught myself HTML in middle school. I went to Cornell for Information Science and have spent the last eight-plus years writing code professionally — first at Accenture, then at Karat, and now at Slack.",
      "Outside work, I run Latina Dev, a community and resource hub for Latina women in tech. I also mentor hundreds of engineers every year through ADPList and my own site, and I speak at conferences about career growth, community building, and the importance of representation in tech.",
      "When I'm not at a keyboard, I'm probably hiking somewhere in the Bay Area with my two corgis, Luna and Sueño, or deep in a Notion doc planning my next side project.",
    ],
    photo: {
      src: "/images/assets/frances-headshot.png",
      alt: "Frances Coronel",
    },
    socialLinks,
    resumeHref: "/about#experience",
  },
};

export const WithoutResume: Story = {
  args: {
    heading: "I'm Frances. I build software and communities from the Bay Area.",
    paragraphs: [
      "I'm a Senior Software Engineer at Slack and the founder of Latina Dev.",
      "I love mentoring engineers, speaking at conferences, and building things that help underrepresented folks thrive in tech.",
    ],
    photo: {
      src: "/images/assets/frances-headshot.png",
      alt: "Frances Coronel",
    },
    socialLinks: socialLinks.slice(0, 2),
  },
};
