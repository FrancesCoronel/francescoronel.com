/**
 * Syncs non-fork GitHub repos for FrancesCoronel into content/projects.json.
 *
 * For each public, non-fork repo not already tracked in projects.json:
 *   - Adds a new entry with reasonable defaults (category: open-source)
 *   - Infers status from last push date (active < 6 months, archived > 24 months)
 *   - Preserves all existing hand-curated projects unchanged
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_... node scripts/sync-github-projects.js
 *   node scripts/sync-github-projects.js --dry-run
 */

const fs = require("fs");
const path = require("path");

const PROJECTS_PATH = path.join(__dirname, "../content/projects.json");
const GITHUB_USER = "FrancesCoronel";

// Repos to skip — GitHub meta repos, already-curated entries without a github field,
// and application/template/exercise repos that aren't real projects
const SKIP_REPOS = new Set([
  // GitHub meta / profile
  "francescoronel.com",
  "FrancesCoronel",
  "francescoronel",
  "readme",
  "template-repo",
  "organization",
  // Already curated in projects.json under a different slug (no github field)
  "ammalia",
  // Not real projects — application docs, job trackers, etc.
  "applications",
  "JAMstack-hackathon-application",
]);

const isDryRun = process.argv.includes("--dry-run");

async function fetchAllRepos() {
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  } else {
    console.warn(
      "⚠️  No GITHUB_TOKEN set — rate limit is 60 req/hr for unauthenticated requests"
    );
  }

  const repos = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=created&direction=desc&per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(
        `GitHub API error ${res.status}: ${await res.text()}`
      );
    }
    const data = await res.json();
    if (data.length === 0) break;
    repos.push(...data);
    page++;
  }
  return repos;
}

function inferStatus(repo) {
  const pushedAt = new Date(repo.pushed_at);
  const monthsAgo = (Date.now() - pushedAt) / (1000 * 60 * 60 * 24 * 30);
  if (monthsAgo < 6) return "active";
  if (monthsAgo < 24) return "complete";
  return "archived";
}

function titleCase(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function repoToProject(repo) {
  const status = inferStatus(repo);
  const highlights = [];
  if (repo.stargazers_count > 0) {
    highlights.push(`${repo.stargazers_count}+ GitHub stars`);
  }
  highlights.push(`GitHub: github.com/${GITHUB_USER}/${repo.name}`);

  return {
    title: titleCase(repo.name),
    slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    tagline: repo.description || titleCase(repo.name),
    logo: "",
    url: repo.homepage || `https://github.com/${GITHUB_USER}/${repo.name}`,
    startDate: repo.created_at,
    endDate: status === "active" ? null : repo.pushed_at,
    category: "open-source",
    status,
    description:
      repo.description ||
      `${titleCase(repo.name)} — open-source project on GitHub.`,
    highlights,
    skills: ["open-source"],
    github: `${GITHUB_USER}/${repo.name}`,
  };
}

async function main() {
  const repos = await fetchAllRepos();
  console.log(`Fetched ${repos.length} total repos for ${GITHUB_USER}`);

  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, "utf8"));

  // Build lookup of already-tracked github identifiers
  const trackedGithub = new Set(
    projects.filter((p) => p.github).map((p) => p.github.toLowerCase())
  );
  // Also build set of tracked slugs to avoid collisions
  const trackedSlugs = new Set(projects.map((p) => p.slug));

  const newRepos = repos.filter((r) => {
    if (r.fork) return false;
    if (r.private) return false;
    if (SKIP_REPOS.has(r.name)) return false;
    if (trackedGithub.has(`${GITHUB_USER}/${r.name}`.toLowerCase())) return false;
    return true;
  });

  console.log(
    `\nFound ${newRepos.length} new non-fork repos not yet in projects.json:`
  );

  const newProjects = [];
  for (const repo of newRepos) {
    const project = repoToProject(repo);

    // Handle slug collisions
    if (trackedSlugs.has(project.slug)) {
      project.slug = `${project.slug}-gh`;
    }
    trackedSlugs.add(project.slug);

    console.log(
      `  + ${repo.full_name} (${repo.stargazers_count}★, ${project.status}) → ${project.slug}`
    );
    newProjects.push(project);
  }

  if (isDryRun) {
    console.log("\n🔍 Dry run — no changes written.");
    return;
  }

  if (newProjects.length === 0) {
    console.log("\n✅ projects.json is already up to date.");
    return;
  }

  // Sort new projects by startDate desc, merge after existing
  newProjects.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  const merged = [...projects, ...newProjects];
  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(merged, null, 2) + "\n");
  console.log(
    `\n✅ projects.json updated — ${merged.length} total projects (${newProjects.length} added)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
