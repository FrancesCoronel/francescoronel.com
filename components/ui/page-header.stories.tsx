import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./page-header";

const meta: Meta<typeof PageHeader> = {
  title: "UI/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

/** Standard header with aside image — used by speaking, mentoring, etc. */
export const Default: Story = {
  render: () => (
    <PageHeader
      label="Events"
      heading="Speaking 💬"
      description="I've spoken at 100+ events on diverse topics ranging from driving D&I in the tech industry to community building — covering TypeScript, Progressive Web Apps, JavaScript, and more."
      aside={
        <img
          src="/images/assets/speaking-microphone.png"
          alt="3D microphone illustration"
          className="h-auto w-[160px] drop-shadow-lg sm:w-[200px] md:w-[280px]"
        />
      }
    />
  ),
};

/** Header with hero photo — used by the About page */
export const WithPhoto: Story = {
  render: () => (
    <PageHeader
      label="About Me"
      heading="Engineer, Speaker & Mentor 👩🏽‍💻"
      description="I'm Frances Coronel — a senior software engineer at Slack with 10+ years of experience building products used by millions."
      aside={
        <div className="h-56 w-56 overflow-hidden rounded-full bg-horchata-100 ring-4 ring-horchata-200 sm:h-72 sm:w-72">
          <img
            src="/images/assets/frances-slack.jpg"
            alt="Frances Coronel"
            className="h-full w-full object-cover"
          />
        </div>
      }
    />
  ),
};

/** Header with children content below description — used by contact page */
export const WithChildren: Story = {
  render: () => (
    <PageHeader
      label="Get in Touch"
      heading="Let's Work Together 📨"
      description="Have a question, speaking inquiry, or just want to say hi? I'd love to hear from you."
      aside={
        <img
          src="/images/assets/speaking-microphone.png"
          alt="3D microphone illustration"
          className="h-auto w-[160px] drop-shadow-lg sm:w-[200px] md:w-[280px]"
        />
      }
    >
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {["Mentoring", "Speaking", "Blog"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800"
          >
            <p className="font-medium text-navy-900 dark:text-horchata-100">
              {item}
            </p>
            <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
              Placeholder description for {item.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </PageHeader>
  ),
};

/** Blog listing header with inline image in heading */
export const WithInlineImage: Story = {
  render: () => (
    <PageHeader
      label="Writing"
      heading="Blog Posts ✍🏽"
      description="665 posts and counting — thoughts on software engineering, tech, career growth, and more."
      aside={
        <img
          src="/images/categories/blog.png"
          alt="Blog"
          className="h-auto w-[120px] drop-shadow-lg sm:w-[160px] md:w-[200px]"
        />
      }
    />
  ),
};
