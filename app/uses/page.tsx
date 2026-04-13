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
  "https://github.com/FrancesCoronel/francescoronel.com/blob/main/claude";

const tools = [
  {
    category: "Development",
    items: [
      {
        name: "Warp",
        description:
          "Modern terminal with AI command search, block-based output, and collaborative workflows",
        url: "https://app.warp.dev/referral/NPZPRR",
        image: "/images/tools/warp.png",
      },
      {
        name: "GitHub CLI",
        description:
          "Command-line interface for GitHub: PRs, issues, actions, and code review without leaving the terminal",
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
      {
        name: "KeyCastr",
        description:
          "Open-source keystroke visualizer that displays key presses on screen for screen recordings, demos, and talks",
        url: "https://github.com/keycastr/keycastr",
        image: "/images/tools/keycastr.png",
      },
      {
        name: "1Password",
        description:
          "Password manager and secure vault for credentials, API keys, SSH keys, and two-factor authentication codes",
        url: "https://1password.com",
        image: "/images/tools/1password.png",
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
      {
        name: "Wispr Flow",
        description:
          "AI voice dictation. Speak naturally and it transcribes directly into any text field with smart punctuation and formatting",
        url: "https://wisprflow.ai/r?FRANCES44",
        image: "/images/tools/wispr-flow.png",
      },
      {
        name: "Otter.ai",
        description:
          "AI meeting transcription and note-taking. Captures conversations, generates summaries, and syncs with calendar for automatic recording",
        url: "https://otter.ai/referrals/W00U2MB8",
        image: "/images/tools/otter.png",
      },
      {
        name: "Grammarly",
        description:
          "AI writing assistant with grammar, clarity, tone, and style suggestions across every text field and browser tab",
        url: "https://grammarly.com",
        image: "/images/tools/grammarly.png",
      },
      {
        name: "Buttondown",
        description:
          "Newsletter platform powering my email list. Simple, powerful, and privacy-respecting with great APIs and subscriber management",
        url: "https://buttondown.email",
        icon: "📬",
      },
    ],
  },
  {
    category: "Finance",
    items: [
      {
        name: "Monarch",
        description:
          "Personal finance dashboard for budgets, net worth tracking, transactions, and goals across all accounts in one place",
        url: "https://monarch.com/referral/9djuitvqmq?r_source=copy",
        icon: "👑",
      },
    ],
  },
  {
    category: "Storage & Cloud",
    items: [
      {
        name: "Google One AI Pro",
        description:
          "2TB Google storage plus access to Gemini Advanced, Google AI features, and premium benefits across Google apps",
        url: "https://one.google.com/about/ai-premium",
        icon: "☁️",
      },
    ],
  },
  {
    category: "Productivity",
    items: [
      {
        name: "Claude",
        description:
          "AI coding assistant powering my entire development workflow: code generation, reviews, debugging, and Slack communication",
        url: "https://claude.ai",
        image: "/images/tools/claude.png",
      },
      {
        name: "Reclaim.ai",
        description:
          "AI-powered calendar management that auto-schedules habits, tasks, and focus time around meetings",
        url: "https://reclaim.ai",
        image: "/images/tools/reclaim.png",
      },
      {
        name: "Raycast",
        description:
          "Blazing fast launcher replacing Spotlight, with extensions for clipboard history, snippets, window management, and app switching",
        url: "https://raycast.com/?via=frances",
        image: "/images/tools/raycast.png",
      },
      {
        name: "Rocket",
        description:
          "System-wide emoji picker. Type a colon anywhere to search and insert emoji without leaving the keyboard",
        url: "https://matthewpalmer.net/rocket/",
        image: "/images/tools/rocket.png",
      },
      {
        name: "Flux",
        description:
          "Adjusts display color temperature based on time of day, with warmer tones at night to reduce eye strain",
        url: "https://justgetflux.com",
        image: "/images/tools/flux.png",
      },
      {
        name: "BetterSnapTool",
        description:
          "Window snapping and management. Drag windows to screen edges for instant resizing and tiling",
        url: "https://folivora.ai/bettersnaptool",
        image: "/images/tools/bettersnaptool.png",
      },
      {
        name: "Itsycal",
        description:
          "Tiny menu bar calendar for a quick glance at upcoming events without opening Calendar.app",
        url: "https://www.mowglii.com/itsycal/",
        image: "/images/tools/itsycal.png",
      },
      {
        name: "Irvue",
        description:
          "Automatic wallpaper changer that pulls stunning photos from Unsplash and refreshes your desktop on a schedule",
        url: "https://apps.apple.com/us/app/irvue/id1039633667",
        image: "/images/tools/irvue.png",
      },
      {
        name: "CleanMyMac",
        description:
          "Mac maintenance and optimization tool for removing junk files, managing startup apps, and monitoring system health",
        url: "https://cleanmymac.com",
        image: "/images/tools/cleanmymac.png",
      },
    ],
  },
  {
    category: "Health",
    items: [
      {
        name: "Healthier",
        description:
          "Simple macOS habit tracker for building and maintaining daily routines. Minimal UI, lives in the menu bar",
        url: "https://healthier.app",
        image: "/images/tools/healthier.png",
      },
    ],
  },
  {
    category: "Creative",
    items: [
      {
        name: "Figma",
        description:
          "Collaborative design tool for UI/UX, prototyping, and visual design, also used via MCP server for design-to-code workflows",
        url: "https://figma.com",
        image: "/images/tools/figma.png",
      },
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
          "AI-powered presentation tool that generates polished slide decks, documents, and webpages from a prompt",
        url: "https://gamma.app/signup?r=sju5yt6zzlxq9ms",
        image: "/images/tools/gamma.jpg",
      },
      {
        name: "Gifox",
        description:
          "Lightweight screen recorder for capturing GIFs, perfect for PR demos and bug reports",
        url: "https://gifox.app",
        image: "/images/tools/gifox.jpg",
      },
      {
        name: "Screen Studio",
        description:
          "Professional screen recording with automatic zoom, cursor highlights, and background blur for polished demos and talks",
        url: "https://screen.studio",
        image: "/images/tools/screen-studio.png",
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
    url: "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review",
  },
  {
    name: "Frontend Design",
    description:
      "Create distinctive, production-grade frontend interfaces with high design quality",
    source: "claude-plugins-official",
    icon: "🎨",
    url: "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design",
  },
  {
    name: "ccstatusline",
    description:
      "Custom status line for Claude Code that displays token usage, model info, and session context in the terminal",
    source: "sirmalloc/ccstatusline",
    icon: "📊",
    url: "https://github.com/sirmalloc/ccstatusline",
  },
];

const categoryIcons: Record<string, { image?: string; emoji?: string }> = {
  Slack: { image: "/images/tools/slack.png" },
  Git: { image: "/images/tools/github.png" },
  Writing: { emoji: "✍🏽" },
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
      "Draft conversational Slack messages matching my writing style: tone, emoji patterns, formatting, and word choice",
    category: "Slack",
    icon: "💬",
  },
  {
    name: "Slack Draft",
    command: "/slack-draft",
    file: "slack-draft.md",
    description:
      "Draft or send a Slack message. Asks whether to use your text or draft from scratch, formats with proper Slack mrkdwn",
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
      "Review a PR for code quality, type safety, CSS issues, and test coverage. Outputs findings in chat, never posts to GitHub",
    category: "Git",
    icon: "🔍",
  },
  {
    name: "Tone & Voice",
    command: "/tone-voice",
    file: "tone-voice.md",
    description:
      "Unified writing style across Slack, GitHub, and docs with platform-specific formatting and consistent voice",
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
      <section className="border-y border-horchata-200 bg-horchata-100 py-16 md:py-20 dark:border-navy-700 dark:bg-navy-950">
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
                        <p className="font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                          {item.description}
                        </p>
                      </div>
                      <svg
                        className="mt-1 h-4 w-4 flex-shrink-0 text-horchata-400 group-hover:text-horchata-700 dark:text-navy-500 dark:group-hover:text-horchata-300"
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
              className="font-medium text-horchata-700 hover:text-horchata-800 dark:text-horchata-400 dark:hover:text-horchata-200"
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
                    <p className="text-lg font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
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
              <a
                key={plugin.name}
                href={plugin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-horchata-200 bg-white p-5 transition-all hover:border-horchata-400 hover:shadow-lg dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 text-2xl">{plugin.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
                      {plugin.name}
                    </p>
                    <p className="mt-1 text-sm text-navy-600 dark:text-white/70">
                      {plugin.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-horchata-200 px-2.5 py-0.5 text-xs font-medium text-navy-700 dark:bg-navy-600 dark:text-white/70">
                      {plugin.source === "claude-plugins-official" ? (
                        <Image
                          src="/images/tools/claude.png"
                          alt=""
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5 rounded object-contain"
                          aria-hidden="true"
                          unoptimized
                        />
                      ) : (
                        <svg className="h-3.5 w-3.5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      )}
                      {plugin.source}
                    </span>
                  </div>
                </div>
              </a>
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
                  <p className="font-bold text-navy-900 group-hover:text-horchata-700 dark:text-horchata-100">
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
                          className="h-3.5 w-3.5 rounded object-contain"
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

      <ConnectCTA variant="hire" />
    </>
  );
}
