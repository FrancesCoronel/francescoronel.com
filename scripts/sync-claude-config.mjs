#!/usr/bin/env node
/**
 * sync-claude-config.mjs
 *
 * Syncs local Claude Code config files into the repo's claude/ directory,
 * then commits and pushes so Vercel rebuilds the /uses page automatically.
 *
 * What gets synced:
 *   ~/.claude/settings.json     → claude/settings.json  (sanitized)
 *   ~/.claude/CLAUDE.md         → claude/CLAUDE.md
 *   .claude/commands/*.md       → claude/skills/*.md
 *   ~/.claude/projects/.../memory/ → claude/memory/
 *   settings.enabledPlugins     → claude/plugins.json   (merged with display metadata)
 *
 * Run manually:  node scripts/sync-claude-config.mjs
 * Run via cron:  see scripts/install-claude-sync-cron.sh
 */

import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, basename } from "path";
import { execSync } from "child_process";
import { homedir } from "os";

const HOME = homedir();
const REPO = new URL("..", import.meta.url).pathname;
const CLAUDE_DIR = join(REPO, "claude");
const MEMORY_SRC = join(
  HOME,
  ".claude/projects/-Users-francescoronel-Documents-GitHub-francescoronel-com/memory"
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[sync-claude] ${msg}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

// ─── 1. settings.json (sanitized) ───────────────────────────────────────────

function syncSettings() {
  const src = join(HOME, ".claude/settings.json");
  if (!existsSync(src)) return log("settings.json not found, skipping");

  const settings = readJson(src);

  // Redact any env var values (may contain tokens)
  if (settings.env) {
    settings.env = Object.fromEntries(
      Object.keys(settings.env).map((k) => [k, "***"])
    );
  }

  // Remove mcpServers — stored in .claude.json with tokens, not safe to publish
  delete settings.mcpServers;

  // Remove statusLine command details (contains internal paths)
  if (settings.statusLine) {
    settings.statusLine = { type: "command", command: "ccstatusline" };
  }

  writeJson(join(CLAUDE_DIR, "settings.json"), settings);
  log("✓ settings.json");
}

// ─── 2. CLAUDE.md ───────────────────────────────────────────────────────────

function syncClaudeMd() {
  const src = join(HOME, ".claude/CLAUDE.md");
  if (!existsSync(src)) return log("CLAUDE.md not found, skipping");
  copyFileSync(src, join(CLAUDE_DIR, "CLAUDE.md"));
  log("✓ CLAUDE.md");
}

// ─── 3. Project skill files (.claude/commands/ → claude/skills/) ────────────

function syncSkills() {
  const commandsDir = join(REPO, ".claude/commands");
  const skillsDir = join(CLAUDE_DIR, "skills");

  if (!existsSync(commandsDir)) return log("No .claude/commands/ dir, skipping");
  if (!existsSync(skillsDir)) mkdirSync(skillsDir, { recursive: true });

  const files = readdirSync(commandsDir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    copyFileSync(join(commandsDir, file), join(skillsDir, file));
  }
  log(`✓ skills/ (${files.length} files)`);
}

// ─── 4. Memory files ─────────────────────────────────────────────────────────

function syncMemory() {
  if (!existsSync(MEMORY_SRC)) return log("Memory dir not found, skipping");

  const memDst = join(CLAUDE_DIR, "memory");
  if (!existsSync(memDst)) mkdirSync(memDst, { recursive: true });

  const files = readdirSync(MEMORY_SRC).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    copyFileSync(join(MEMORY_SRC, file), join(memDst, file));
  }
  log(`✓ memory/ (${files.length} files)`);
}

// ─── 5. plugins.json (generated from settings.enabledPlugins) ───────────────

function syncPlugins() {
  const settingsSrc = join(HOME, ".claude/settings.json");
  if (!existsSync(settingsSrc)) return;

  const settings = readJson(settingsSrc);
  const enabled = settings.enabledPlugins || {};

  const pluginsPath = join(CLAUDE_DIR, "plugins.json");
  const existing = existsSync(pluginsPath) ? readJson(pluginsPath) : [];
  const existingById = Object.fromEntries(existing.map((p) => [p.id, p]));

  const updated = Object.entries(enabled)
    .filter(([, v]) => v === true)
    .map(([key]) => {
      const [id, marketplace] = key.split("@");
      // Preserve existing display metadata (description, url, etc.)
      return existingById[id] ?? {
        name: id,
        id,
        marketplace: marketplace ?? "unknown",
        scope: "global",
        description: "",
      };
    });

  if (updated.length > 0) {
    writeJson(pluginsPath, updated);
    log(`✓ plugins.json (${updated.length} plugins)`);
  }
}

// ─── 6. Git commit + push ────────────────────────────────────────────────────

function gitPush() {
  try {
    execSync(`git -C "${REPO}" add claude/`, { stdio: "pipe" });

    const status = execSync(`git -C "${REPO}" status --porcelain claude/`)
      .toString()
      .trim();

    if (!status) {
      log("No changes — nothing to commit.");
      return;
    }

    const date = new Date().toISOString().split("T")[0];
    execSync(
      `git -C "${REPO}" commit -m "chore: sync Claude config ${date}"`,
      { stdio: "inherit" }
    );
    execSync(`git -C "${REPO}" push`, { stdio: "inherit" });
    log("✓ Pushed — Vercel will redeploy /uses");
  } catch (e) {
    console.error("[sync-claude] Git error:", e.message);
    process.exit(1);
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

log("Starting sync...");
syncSettings();
syncClaudeMd();
syncSkills();
syncMemory();
syncPlugins();
gitPush();
log("Done.");
