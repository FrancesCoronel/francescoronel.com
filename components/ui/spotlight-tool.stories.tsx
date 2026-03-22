import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpotlightTool, SpotlightToolsSection } from "./spotlight-tool";
import { SpotlightSection, SpotlightSectionGroup } from "./spotlight-section";

const meta: Meta<typeof SpotlightTool> = {
  title: "UI/SpotlightTool",
  component: SpotlightTool,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-lg px-4 py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SpotlightTool>;

export const Default: Story = {
  render: () => (
    <ul className="space-y-6">
      <SpotlightTool title="Claude Code" href="https://claude.ai/code">
        My go-to AI coding assistant. The agentic capabilities are genuinely
        impressive — I use it for everything from refactoring to writing tests.
      </SpotlightTool>
    </ul>
  ),
};

export const ToolGroup: Story = {
  render: () => (
    <SpotlightToolsSection heading="Development tools">
      <SpotlightTool title="VS Code" href="https://code.visualstudio.com">
        My primary editor for most web projects. The extension ecosystem is
        unmatched.
      </SpotlightTool>
      <SpotlightTool title="Claude Code" href="https://claude.ai/code">
        Agentic AI coding assistant — I use it daily for everything from
        scaffolding components to debugging.
      </SpotlightTool>
      <SpotlightTool title="iTerm2" href="https://iterm2.com">
        Better terminal with split panes, profiles, and excellent Zsh
        integration.
      </SpotlightTool>
    </SpotlightToolsSection>
  ),
};

export const FullUsesPage: Story = {
  render: () => (
    <SpotlightSectionGroup className="py-8">
      <SpotlightSection title="Workstation">
        <SpotlightToolsSection heading="Hardware">
          <SpotlightTool title='MacBook Pro 16" M3 Max'>
            The M3 Max chip handles anything I throw at it. Local LLM inference,
            parallel Docker containers, Figma with a hundred frames — no sweat.
          </SpotlightTool>
          <SpotlightTool title="LG 27UK850-W 4K Monitor">
            The USB-C single-cable setup keeps my desk clean. Color accuracy is
            solid for design reviews.
          </SpotlightTool>
        </SpotlightToolsSection>
      </SpotlightSection>

      <SpotlightSection title="Development">
        <SpotlightToolsSection heading="Tools I reach for daily">
          <SpotlightTool title="Claude Code" href="https://claude.ai/code">
            Agentic AI that edits files, runs tests, and commits code. Changed
            how I work more than any other tool in the last year.
          </SpotlightTool>
          <SpotlightTool title="Vercel" href="https://vercel.com">
            Zero-config deploys with edge functions, analytics, and preview URLs
            on every PR.
          </SpotlightTool>
          <SpotlightTool title="Turso" href="https://turso.tech">
            Edge SQLite — crazy fast reads and a generous free tier for side
            projects.
          </SpotlightTool>
        </SpotlightToolsSection>
      </SpotlightSection>

      <SpotlightSection title="Productivity">
        <SpotlightToolsSection heading="Apps">
          <SpotlightTool title="Alfred" href="https://www.alfredapp.com">
            Spotlight replacement with workflows, clipboard history, and snippet
            expansion. I&apos;ve built several custom workflows for this site.
          </SpotlightTool>
          <SpotlightTool title="Notion" href="https://notion.so">
            My second brain. Projects, meeting notes, content calendar — all
            in one place.
          </SpotlightTool>
        </SpotlightToolsSection>
      </SpotlightSection>
    </SpotlightSectionGroup>
  ),
};
