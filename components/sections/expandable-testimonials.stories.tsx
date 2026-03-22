import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpandableTestimonials, type TestimonialItem } from "./expandable-testimonials";

const mockTestimonials: TestimonialItem[] = [
  {
    quote:
      "Frances is an exceptional engineer and mentor. She has a rare ability to explain complex concepts clearly while making you feel supported throughout the process.",
    name: "Alex Rivera",
    role: "Software Engineer",
    company: "Google",
  },
  {
    quote:
      "Working with Frances on Latina Dev was inspiring. Her passion for community building and her technical skills are both top-notch.",
    name: "Maria Gonzalez",
    role: "Product Manager",
    company: "Meta",
  },
  {
    quote:
      "Frances gave me the most actionable career advice I've ever received. Within 3 months of our sessions, I landed a role at my dream company.",
    name: "James Chen",
    role: "Junior Engineer",
    company: "Stripe",
  },
  {
    quote:
      "Her talk at Grace Hopper was genuinely moving and packed with practical takeaways. I reference her framework for career growth constantly.",
    name: "Priya Sharma",
    role: "Staff Engineer",
    company: "Netflix",
  },
  {
    quote:
      "Frances has a gift for building community. Every event she runs feels warm, inclusive, and genuinely useful for attendees.",
    name: "Jordan Lee",
    role: "DevRel",
    company: "Cloudflare",
  },
  {
    quote:
      "I've followed Frances's career for years. She embodies what it means to be a generous, thoughtful technical leader.",
    name: "Sofia Reyes",
    role: "Engineering Manager",
    company: "Shopify",
  },
  {
    quote:
      "The mentoring session I had with Frances changed the trajectory of my career. She helped me see my value when I was ready to quit tech entirely.",
    name: "Marcus Williams",
    role: "Senior Engineer",
    company: "Airbnb",
  },
  {
    quote:
      "Frances's code reviews are thorough and educational — she always explains the 'why' behind her feedback.",
    name: "Elena Morita",
    role: "Frontend Engineer",
    company: "Figma",
  },
  {
    quote:
      "Frances is one of the most impactful people I've met in tech. Her work with underrepresented communities speaks for itself.",
    name: "David Park",
    role: "CTO",
    company: "Techqueria",
  },
];

const meta: Meta<typeof ExpandableTestimonials> = {
  title: "Sections/ExpandableTestimonials",
  component: ExpandableTestimonials,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-5xl py-12">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExpandableTestimonials>;

export const Default: Story = {
  args: {
    testimonials: mockTestimonials,
    initialVisible: 6,
  },
};

export const AllVisible: Story = {
  args: {
    testimonials: mockTestimonials,
    initialVisible: mockTestimonials.length,
  },
};

export const FewTestimonials: Story = {
  args: {
    testimonials: mockTestimonials.slice(0, 3),
    initialVisible: 6,
  },
};

export const SmallInitialSet: Story = {
  args: {
    testimonials: mockTestimonials,
    initialVisible: 3,
  },
};
