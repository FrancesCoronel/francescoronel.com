import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialsPreview } from "./testimonials-preview";

const meta: Meta<typeof TestimonialsPreview> = {
  title: "Sections/TestimonialsPreview",
  component: TestimonialsPreview,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialsPreview>;

const mockTestimonials = [
  {
    name: "Sarah Chen",
    slug: "sarah-chen",
    role: "Engineering Manager",
    organization: "Google",
    quote:
      "Frances is one of the most impactful engineers I've had the pleasure of working with. Her ability to break down complex problems and communicate solutions clearly is unmatched. She consistently raises the bar for everyone on the team.",
    image: "/images/testimonials/placeholder.jpg",
    featured: true,
  },
  {
    name: "Marcus Rivera",
    slug: "marcus-rivera",
    role: "Senior Software Engineer",
    organization: "Meta",
    quote:
      "I had the privilege of being mentored by Frances during a critical career transition. Her guidance on interview preparation, system design, and navigating the tech industry as a Latino professional was invaluable. I landed my dream role thanks to her support.",
    image: "/images/testimonials/placeholder.jpg",
    featured: true,
  },
  {
    name: "Priya Patel",
    slug: "priya-patel",
    role: "Product Designer",
    organization: "Figma",
    quote:
      "Frances's talk on inclusive design at our company all-hands was phenomenal. She brought real-world examples, actionable takeaways, and an energy that kept the entire room engaged. Would absolutely invite her to speak again.",
    image: "/images/testimonials/placeholder.jpg",
    featured: true,
  },
];

/** Three featured testimonial cards with "See all testimonials" link. */
export const Default: Story = {
  args: {
    testimonials: mockTestimonials,
  },
};
