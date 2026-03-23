import * as si from "simple-icons";

// Map skill slugs → Simple Icons identifier + brand hex color + website URL
const SKILL_ICON_MAP: Record<string, { id: keyof typeof si; color: string; url: string }> = {
  angular:          { id: "siAngular",      color: "#0F0F11", url: "https://angular.io" },
  react:            { id: "siReact",        color: "#61DAFB", url: "https://react.dev" },
  wordpress:        { id: "siWordpress",    color: "#21759B", url: "https://wordpress.org" },
  css:              { id: "siCss",          color: "#663399", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  html:             { id: "siHtml5",        color: "#E34F26", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  typescript:       { id: "siTypescript",   color: "#3178C6", url: "https://www.typescriptlang.org" },
  javascript:       { id: "siJavascript",   color: "#F7DF1E", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  nodejs:           { id: "siNodedotjs",    color: "#5FA04E", url: "https://nodejs.org" },
  storybook:        { id: "siStorybook",    color: "#FF4785", url: "https://storybook.js.org" },
  figma:            { id: "siFigma",        color: "#F24E1E", url: "https://www.figma.com" },
  jira:             { id: "siJira",         color: "#0052CC", url: "https://www.atlassian.com/software/jira" },
  graphql:          { id: "siGraphql",      color: "#E10098", url: "https://graphql.org" },
  git:              { id: "siGit",          color: "#F05032", url: "https://git-scm.com" },
  bootstrap:        { id: "siBootstrap",    color: "#7952B3", url: "https://getbootstrap.com" },
  sass:             { id: "siSass",         color: "#CC6699", url: "https://sass-lang.com" },
  notion:           { id: "siNotion",       color: "#000000", url: "https://www.notion.so" },
  next:             { id: "siNextdotjs",    color: "#000000", url: "https://nextjs.org" },
  php:              { id: "siPhp",          color: "#777BB4", url: "https://www.php.net" },
  unity:            { id: "siUnity",        color: "#000000", url: "https://unity.com" },
  mui:              { id: "siMui",          color: "#007FFF", url: "https://mui.com" },
  "chrome-dev-tools": { id: "siGooglechrome", color: "#4285F4", url: "https://developer.chrome.com/docs/devtools" },
  tailwind:           { id: "siTailwindcss",  color: "#06B6D4", url: "https://tailwindcss.com" },
  vercel:             { id: "siVercel",        color: "#000000", url: "https://vercel.com" },
  firebase:           { id: "siFirebase",      color: "#DD2C00", url: "https://firebase.google.com" },
  python:             { id: "siPython",        color: "#3776AB", url: "https://www.python.org" },
};

// Emoji fallbacks for skills without a Simple Icon
const SKILL_EMOJI_MAP: Record<string, string> = {
  "engineering-management": "👩🏽‍💼",
  "teaching":               "👩🏽‍🏫",
  "web-design":             "🎨",
  "branding":               "✨",
  "design-systems":         "🧩",
  "interviewing":           "💬",
  "mentoring":              "🤝🏽",
  "hack":                   "💻",
  "csharp":                 "🔷",
  "growth-engineering":     "📈",
  "product-engineering":    "🛠️",
  "web-accessibility":      "♿",
  "lead-generation":        "📊",
  "agile":                  "🔄",
  "public-speaking":        "🎤",
  "project-management":     "📋",
  "seo":                    "🔍",
  "open-source":            "🌐",
  "community-building":     "👥",
  "real-estate-management": "🏠",
};

// URLs for skills without Simple Icons
const SKILL_URL_FALLBACK: Record<string, string> = {
  "engineering-management": "/about",
  "teaching":               "/mentoring",
  "web-design":             "https://web.dev",
  "branding":               "/projects",
  "design-systems":         "https://www.designsystems.com",
  "interviewing":           "/mentoring",
  "mentoring":              "/mentoring",
  "hack":                   "https://hacklang.org",
  "csharp":                 "https://learn.microsoft.com/en-us/dotnet/csharp/",
  "growth-engineering":     "/projects",
  "product-engineering":    "/projects",
  "web-accessibility":      "https://www.w3.org/WAI/",
  "lead-generation":        "/projects",
  "agile":                  "https://agilemanifesto.org",
  "public-speaking":        "/speaking",
  "project-management":     "/about",
  "seo":                    "/blog",
  "open-source":            "https://opensource.org",
  "community-building":     "/organizations",
  "real-estate-management": "/about",
};

export function hasSkillIcon(slug: string): boolean {
  return slug in SKILL_ICON_MAP;
}

export function getSkillUrl(slug: string): string | null {
  return SKILL_ICON_MAP[slug]?.url ?? SKILL_URL_FALLBACK[slug] ?? null;
}

export function getSkillEmoji(slug: string): string | null {
  return SKILL_EMOJI_MAP[slug] ?? null;
}

interface SkillIconProps {
  slug: string;
  size?: number;
}

export function SkillIcon({ slug, size = 16 }: SkillIconProps) {
  const entry = SKILL_ICON_MAP[slug];
  if (!entry) return null;

  const icon = si[entry.id] as { path: string } | undefined;
  if (!icon) return null;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={entry.color}
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d={icon.path} />
    </svg>
  );
}
