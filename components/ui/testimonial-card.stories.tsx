import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "@/lib/types";

const shortTestimonial: Testimonial = {
  name: "Alex Rivera",
  slug: "alex-rivera",
  role: "Software Engineer",
  organization: "Google",
  quote:
    "Frances is an incredible mentor. Her guidance helped me land my dream role.",
  image: "",
  featured: true,
};

const longTestimonial: Testimonial = {
  name: "Maria Santos",
  slug: "maria-santos",
  role: "Product Manager",
  organization: "Meta",
  quote:
    "Frances's mentorship completely transformed my career trajectory. She helped me navigate the transition from engineering to product management, provided invaluable feedback on my resume and interview prep, and was always available when I needed advice. Her deep knowledge of the tech industry and genuine passion for helping others succeed makes her one of the best mentors I've ever had. I can't recommend her highly enough to anyone looking to grow in their tech career.",
  image: "",
  featured: true,
};

const noOrgTestimonial: Testimonial = {
  ...shortTestimonial,
  slug: "no-org",
  organization: "",
  role: "Independent Developer",
};

const meta: Meta<typeof TestimonialCard> = {
  title: "UI/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TestimonialCard>;

export const Short: Story = {
  args: {
    testimonial: shortTestimonial,
  },
};

export const Long: Story = {
  args: {
    testimonial: longTestimonial,
  },
};

export const NoOrganization: Story = {
  args: {
    testimonial: noOrgTestimonial,
  },
};
