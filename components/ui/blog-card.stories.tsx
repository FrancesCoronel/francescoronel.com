import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/types";

const mockPost: BlogPost = {
  slug: "i-think-im-becoming-a-cracked-engineer",
  title: "I think I'm becoming a cracked engineer",
  date: "2026-02-13",
  excerpt:
    "AI tools have me in a new flow state. Here's how I've been using them to level up my engineering workflow.",
  featuredImage: "/images/assets/speaking-hero-image.webp",
  categories: ["blog", "speaking"],
  tags: ["ai", "engineering"],
  organizations: ["slack"],
  skills: ["react", "typescript"],
  readingTime: "5 min read",
  content: "",
};

const mockPostNoImage: BlogPost = {
  ...mockPost,
  slug: "no-image-post",
  title: "A post without a featured image",
  featuredImage: "",
};

const categoryImages: Record<string, string> = {
  blog: "/images/categories/blog.png",
  speaking: "/images/categories/speaking.png",
  events: "/images/categories/events.png",
  mentoring: "/images/categories/mentoring.png",
};

const meta: Meta<typeof BlogCard> = {
  title: "UI/BlogCard",
  component: BlogCard,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    hideReadingTime: {
      control: "boolean",
      description: "Hide the reading time from the card metadata",
    },
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
type Story = StoryObj<typeof BlogCard>;

export const Default: Story = {
  args: {
    post: mockPost,
    categoryImages,
    hideReadingTime: false,
  },
};

export const NoFeaturedImage: Story = {
  args: {
    post: mockPostNoImage,
    categoryImages,
  },
};

export const ManyCategories: Story = {
  args: {
    post: {
      ...mockPost,
      categories: ["blog", "speaking", "events", "mentoring"],
    },
    categoryImages,
  },
};

export const HiddenReadingTime: Story = {
  args: {
    post: mockPost,
    categoryImages,
    hideReadingTime: true,
  },
};
