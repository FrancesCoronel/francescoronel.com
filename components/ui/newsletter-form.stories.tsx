import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsletterForm } from "./newsletter-form";

const meta: Meta<typeof NewsletterForm> = {
  title: "UI/NewsletterForm",
  component: NewsletterForm,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["section", "footer", "dark"],
      description: "Visual variant matching the surrounding context",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewsletterForm>;

/** Section variant — full-width form used in standalone newsletter sections. */
export const Section: Story = {
  args: {
    variant: "section",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg rounded-2xl border border-horchata-200 bg-white p-8">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-navy-600">
          Newsletter
        </p>
        <h2 className="mb-2 text-xl font-bold text-navy-900">
          The Unicorn Engineer
        </h2>
        <p className="mb-6 text-sm text-navy-600">
          Career learnings, advice, and opportunities. Straight to your inbox.
        </p>
        <Story />
      </div>
    ),
  ],
};

/** Footer variant — compact form used inside the site footer. */
export const Footer: Story = {
  args: {
    variant: "footer",
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm rounded-2xl border border-horchata-200 bg-white p-6">
        <p className="mb-3 text-sm font-semibold text-navy-700">
          Subscribe to the newsletter
        </p>
        <Story />
      </div>
    ),
  ],
};

/** Dark variant — used inside the dark navy newsletter CTA section. */
export const Dark: Story = {
  args: {
    variant: "dark",
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-navy-900 p-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-horchata-400">
          Stay in the loop
        </p>
        <h2 className="mb-3 text-2xl font-bold text-white">
          The Unicorn Engineer
        </h2>
        <p className="mb-6 text-sm text-white/60">
          Personal and career learnings delivered straight to your inbox.
        </p>
        <div className="max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
};

/** All three variants stacked for comparison. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-navy-600">
          Section (default)
        </p>
        <div className="max-w-md">
          <NewsletterForm variant="section" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-navy-600">
          Footer
        </p>
        <div className="max-w-sm">
          <NewsletterForm variant="footer" />
        </div>
      </div>
      <div className="rounded-2xl bg-navy-900 p-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-horchata-400">
          Dark
        </p>
        <div className="max-w-md">
          <NewsletterForm variant="dark" />
        </div>
      </div>
    </div>
  ),
};
