import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Button, ButtonLink } from "./button";
import { Card } from "./card";
import { SectionHeader } from "./section-header";

/**
 * The shared building blocks from the design system polish. Use these in new
 * code instead of copying class strings. Toggle Dark Mode in the toolbar to
 * check both themes.
 */
const meta: Meta = {
  title: "UI/Shared Components",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="lg">Get in Touch</Button>
      <Button>Contact</Button>
      <Button size="sm">Small</Button>
      <ButtonLink href="/mentoring" variant="secondary" size="lg">
        Book Mentoring
      </ButtonLink>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const Badges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge tone="success">Active</Badge>
      <Badge tone="info">Hackathon</Badge>
      <Badge tone="warning">Podcast</Badge>
      <Badge tone="danger">Error</Badge>
      <Badge>Side Project</Badge>
      <Badge tone="success" size="md">Upcoming</Badge>
    </div>
  ),
};

export const Cards: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card className="p-6">
        <p className="font-bold text-ink">Static card</p>
        <p className="mt-1 text-sm text-ink-muted">White on linen, navy-800 in dark mode.</p>
      </Card>
      <Card as="a" href="#" interactive className="block p-6">
        <p className="font-bold text-ink">Clickable card</p>
        <p className="mt-1 text-sm text-ink-muted">Lifts on hover.</p>
      </Card>
    </div>
  ),
};

export const SectionHeaders: Story = {
  render: () => (
    <div className="space-y-10">
      <SectionHeader label="Events" title="Speaking 🎤" />
      <SectionHeader label="Upcoming" title="Next Up 📅" size="md" />
      <SectionHeader label="Recent" title="Latest Posts ✍🏽" size="sm" />
    </div>
  ),
};
