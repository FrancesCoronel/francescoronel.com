import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { ConnectCTA } from "@/components/sections/connect-cta";

export const metadata: Metadata = buildMetadata({
  title: "Uses",
  description:
    "Tools, software, MCP servers, plugins, and coding setup that Frances Coronel uses daily.",
  path: "/uses",
});

const REPO_BASE =
  "https://github.com/FrancesCoronel/how-frances-codes/blob/main";

const tools = [
  {
    category: "AI",
    items: [
      {
        name: "Claude",
        description:
          "AI coding assistant powering my entire development workflow — code generation, reviews, debugging, and Slack communication",
        url: "https://claude.ai",
        image: "/images/tools/claude.png",
      },
      {
        name: "Reclaim.ai",
        description:
          "AI-powered calendar management — auto-schedules habits, tasks, and focus time around meetings",
        url: "https://reclaim.ai",
        image: "/images/tools/reclaim.png",
      },
    ],
  },
  {
    category: "Development",
    items: [
      {
        name: "Warp",
        description:
          "Modern terminal with AI command search, block-based output, and collaborative workflows",
        url: "https://warp.dev",
        image: "/images/tools/warp.png",
      },
      {
        name: "GitHub CLI",
        description:
          "Command-line interface for GitHub — PRs, issues, actions, and code review without leaving the terminal",
        url: "https://cli.github.com",
        image: "/images/tools/github.png",
      },
      {
        name: "GitHub Desktop",
        description:
          "Visual Git client for managing branches, diffs, and commits with a clean GUI",
        url: "https://desktop.github.com",
        image: "/images/tools/github.png",
      },
    ],
  },
  {
    category: "Communication",
    items: [
      {
        name: "Slack",
        description:
          "Primary communication platform for team collaboration and messaging",
        url: "https://slack.com",
        image: "/images/tools/slack.png",
      },
    ],
  },
  {
    category: "Productivity",
    items: [
      {
        name: "Raycast",
        description:
          "Blazing fast launcher replacing Spotlight — extensions for clipboard history, snippets, window management, and app switching",
        url: "https://raycast.com",
        image: "/images/tools/raycast.png",
      },
      {
        name: "BetterSnapTool",
        description:
          "Window snapping and management — drag windows to screen edges for instant resizing and tiling",
        url: "https://folivora.ai/bettersnaptool",
        icon: "🪟",
      },
      {
        name: "Itsycal",
        description:
          "Tiny menu bar calendar — quick glance at upcoming events without opening Calendar.app",
        url: "https://www.mowglii.com/itsycal/",
        image: "/images/tools/itsycal.png",
      },
    ],
  },
  {
    category: "Creative",
    items: [
      {
        name: "Canva",
        description:
          "Design tool for presentations, social graphics, and quick visual assets",
        url: "https://canva.com",
        image: "/images/tools/canva.png",
      },
      {
        name: "Gamma",
        description:
          "AI-powered presentation tool — generates polished slide decks, documents, and webpages from a prompt",
        url: "https://gamma.app",
        image: "/images/tools/gamma.jpg",
      },
      {
        name: "Gifox",
        description:
          "Lightweight screen recorder for capturing GIFs — perfect for PR demos and bug reports",
        url: "https://gifox.app",
        image: "/images/tools/gifox.jpg",
      },
    ],
  },
];

const mcpServers = [
  {
    name: "Slack",
    description:
      "Read and send Slack messages, manage canvases, and search channels",
    tools: 9,
    url: "https://docs.slack.dev/ai/slack-mcp-server/",
    image: "/images/tools/slack.png",
  },
  {
    name: "Figma Desktop",
    description: "Capture screenshots from Figma desktop app",
    tools: 1,
    url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server",
    image: "/images/tools/figma.png",
  },
];

const plugins = [
  {
    name: "Code Review",
    description: "Review pull requests with structured feedback",
    source: "claude-plugins-official",
    icon: "🔍",
  },
  {
    name: "Frontend Design",
    description:
      "Create distinctive, production-grade frontend interfaces with high design quality",
    source: "claude-plugins-official",
    icon: "🎨",
  },
];

const categoryIcons: Record<string, { image?: string; emoji?: string }> = {
  Slack: { image: "/images/tools/slack.png" },
  Git: { image: "/images/tools/github.png" },
  Writing: { emoji: "✍️" },
};

const skills = [
  {
    name: "Slack Project Update",
    command: "/slack-project-update",
    file: "slack-project-update.md",
    description:
      "Draft weekly or daily project update posts using a structured format with phases, accomplishments, blocking bugs, and next steps",
    category: "Slack",
    icon: "📋",
  },
  {
    name: "Slack Summary",
    command: "/slack-summary",
    file: "slack-summary.md",
    description:
      "Summarize meetings, huddles, threads, or discussions into structured recaps with numbered sections and calls to action",
    category: "Slack",
    icon: "📝",
  },
  {
    name: "Slack Message",
    command: "/slack-message",
    file: "slack-message.md",
    description:
      "Draft conversational Slack messages matching my writing style — tone, emoji patterns, formatting, and word choice",
    category: "Slack",
    icon: "💬",
  },
  {
    name: "Slack Draft",
    command: "/slack-draft",
    file: "slack-draft.md",
    description:
      "Draft or send a Slack message — asks whether to use your text or draft from scratch, formats with proper Slack mrkdwn",
    category: "Slack",
    icon: "✏️",
  },
  {
    name: "PR Description",
    command: "/pr-description",
    file: "pr-description.md",
    description:
      "Create or update pull request descriptions using a structured template with Why, Testing, Before/After, Risks, and Preview links",
    category: "Git",
    icon: "📄",
  },
  {
    name: "Code Review",
    command: "/code-review",
    file: "code-review.md",
    description:
      "Review a PR for code quality, type safety, CSS issues, and test coverage — outputs findings in chat, never posts to GitHub",
    category: "Git",
    icon: "🔍",
  },
  {
    name: "Tone & Voice",
    command: "/tone-voice",
    file: "tone-voice.md",
    description:
      "Unified writing style — applies across Slack, GitHub, and docs with platform-specific formatting and consistent voice",
    category: "Writing",
    icon: "🗣️",
  },
];

const hooks = [
  {
    event: "Notification",
    matcher: "idle_prompt",
    action: "macOS notification with Glass sound",
    line: 29,
    icon: "🔔",
  },
  {
    event: "Notification",
    matcher: "permission_prompt",
    action: "macOS notification with Ping sound",
    line: 39,
    icon: "🔐",
  },
  {
    event: "Stop",
    matcher: "All",
    action: "macOS notification with Submarine sound",
    line: 49,
    icon: "🛑",
  },
  {
    event: "PostToolUse",
    matcher: "Write | Edit",
    action: "Auto-format with prettier / markdownlint",
    line: 59,
    icon: "✨",
  },
];

export default function UsesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-horchata-50 py-16 dark:bg-navy-900">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Setup
          </p>
          <h1 className="mt-2 text-4xl font-bold text-navy-900 dark:text-horchata-100 md:text-5xl">
            What I Use 🛠️
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-white/70">
            Tools, software, MCP servers, plugins, and Claude Code configuration
            that power my daily development workflow.
          </p>
        </div>
      </section>

      {/* Tools by Category */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            Software
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Tools & Apps
          </h2>
          <div className="mt-10 space-y-12">
            {tools.map((group) => (
              <div key={group.category}>
                <h3 className="text-xl font-bold text-navy-900 dark:text-horchata-100">
                  {group.category}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-horchata-200 bg-white p-5 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                    >
                      {"image" in item && item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-lg object-contain"
                        />
                      ) : (
                        <span className="mt-0.5 text-2xl">
                          {"icon" in item ? item.icon : ""}
                        </span>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                          {item.description}
                        </p>
                      </div>
                      <svg
                        className="mt-1 h-4 w-4 flex-shrink-0 text-horchata-400 group-hover:text-horchata-600 dark:text-navy-500 dark:group-hover:text-horchata-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claude Code Section */}
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
            AI Workflow
          </p>
          <h2 className="mt-1 text-3xl font-bold text-navy-900 dark:text-horchata-100">
            Claude Code Setup
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-navy-600 dark:text-white/70">
            My Claude Code configuration includes MCP servers, plugins, custom
            skills, and hooks that automate formatting, notifications, and
            communication workflows.{" "}
            <a
              href={`${REPO_BASE}/CLAUDE.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-horchata-600 hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-200"
            >
              View my CLAUDE.md →
            </a>
          </p>

          {/* MCP Servers */}
          <h3 className="mt-12 text-xl font-bold text-navy-900 dark:text-horchata-100">
            MCP Servers 🔌
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mcpServers.map((server) => {
              const inner = (
                <div className="flex items-start gap-4">
                  <Image
                    src={server.image}
                    alt={server.name}
                    width={32}
                    height={32}
                    className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-lg object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100">
                      {server.name}
                    </p>
                    <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                      {server.description}
                    </p>
                    <span className="mt-3 inline-flex items-center rounded-full bg-horchata-200 px-2.5 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-600 dark:text-white/70">
                      {server.tools} tool{server.tools !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
              return server.url ? (
                <a
                  key={server.name}
                  href={server.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-horchata-200 bg-white p-5 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={server.name}
                  className="flex items-start gap-4 rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800"
                >
                  {inner}
                </div>
              );
            })}
          </div>

          {/* Plugins */}
          <h3 className="mt-12 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Plugins 🧩
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {plugins.map((plugin) => (
              <div
                key={plugin.name}
                className="rounded-2xl border border-horchata-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 text-2xl">{plugin.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-navy-900 dark:text-horchata-100">
                      {plugin.name}
                    </p>
                    <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                      {plugin.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-horchata-200 px-2.5 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-600 dark:text-white/70">
                      <Image
                        src="/images/tools/claude.png"
                        alt=""
                        width={14}
                        height={14}
                        className="h-3.5 w-3.5 object-contain"
                        aria-hidden="true"
                        unoptimized
                      />
                      {plugin.source}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <h3 className="mt-12 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Custom Skills ⚡
          </h3>
          <div className="mt-4 space-y-0 divide-y divide-horchata-200 rounded-2xl border border-horchata-200 bg-white dark:divide-navy-700 dark:border-navy-700 dark:bg-navy-800">
            {skills.map((skill) => (
              <a
                key={skill.name}
                href={`${REPO_BASE}/skills/${skill.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 transition-colors hover:bg-horchata-50 first:rounded-t-2xl last:rounded-b-2xl dark:hover:bg-navy-700"
              >
                <span className="mt-0.5 text-2xl">{skill.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-navy-900 group-hover:text-horchata-600 dark:text-horchata-100">
                    {skill.name}
                  </p>
                  <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                    {skill.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <code className="rounded-lg bg-horchata-100 px-2.5 py-1 text-xs font-medium text-navy-700 dark:bg-navy-700 dark:text-white/70">
                      {skill.command}
                    </code>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-horchata-200 px-2.5 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-600 dark:text-white/70">
                      {categoryIcons[skill.category]?.image ? (
                        <Image
                          src={categoryIcons[skill.category].image!}
                          alt=""
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5 object-contain"
                          aria-hidden="true"
                          unoptimized
                        />
                      ) : categoryIcons[skill.category]?.emoji ? (
                        <span className="text-[10px] leading-none" aria-hidden="true">
                          {categoryIcons[skill.category].emoji}
                        </span>
                      ) : null}
                      {skill.category}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Hooks */}
          <h3 className="mt-12 text-xl font-bold text-navy-900 dark:text-horchata-100">
            Hooks 🪝
          </h3>
          <div className="mt-4 space-y-0 divide-y divide-horchata-200 rounded-2xl border border-horchata-200 bg-white dark:divide-navy-700 dark:border-navy-700 dark:bg-navy-800">
            {hooks.map((hook, i) => (
              <a
                key={i}
                href={`${REPO_BASE}/settings.json#L${hook.line}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 transition-colors hover:bg-horchata-50 first:rounded-t-2xl last:rounded-b-2xl dark:hover:bg-navy-700"
              >
                <span className="text-xl">{hook.icon}</span>
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-horchata-200 px-2.5 py-1 text-xs font-medium text-navy-700 dark:bg-navy-600 dark:text-white/70">
                  {hook.event}
                </span>
                <code className="flex-shrink-0 text-xs text-navy-500 dark:text-horchata-400">
                  {hook.matcher}
                </code>
                <p className="flex-1 text-sm text-navy-600 group-hover:text-navy-900 dark:text-white/70 dark:group-hover:text-horchata-100">
                  {hook.action}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ConnectCTA variant="follow" />
    </>
  );
}
