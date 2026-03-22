import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhotoGallery } from "./photo-gallery";

const placeholderPhotos = [
  { src: "/images/assets/frances-headshot.png", alt: "Frances at a speaking event" },
  { src: "/images/assets/frances-thumbs-up-memoji.png", alt: "Frances at a conference" },
  { src: "/images/assets/rocket-illustration.webp", alt: "Team outing" },
  { src: "/images/assets/frances-headshot.png", alt: "Frances hiking in the Bay Area" },
  { src: "/images/assets/frances-thumbs-up-memoji.png", alt: "Frances with Luna and Sueño" },
];

const meta: Meta<typeof PhotoGallery> = {
  title: "Sections/PhotoGallery",
  component: PhotoGallery,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="overflow-hidden py-12">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PhotoGallery>;

export const Default: Story = {
  args: {
    photos: placeholderPhotos,
  },
};

export const ThreePhotos: Story = {
  args: {
    photos: placeholderPhotos.slice(0, 3),
  },
};

export const FivePhotos: Story = {
  args: {
    photos: placeholderPhotos,
  },
};
