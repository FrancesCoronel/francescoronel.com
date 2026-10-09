// Builds the Pagefind search index from the prerendered HTML.
//
// Next.js writes prerendered pages to .next/server/app locally. On Vercel,
// since Next 16.3.8, the Vercel build adapter writes them to
// .next/output/functions instead. Use whichever one actually has HTML, and
// fail loudly if neither does so search never ships empty.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CANDIDATES = [".next/server/app", ".next/output/functions"];
const OUTPUT = "public/pagefind";

function hasHtml(dir) {
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (entry.endsWith(".html")) return true;
    if (statSync(path).isDirectory() && hasHtml(path)) return true;
  }
  return false;
}

const site = CANDIDATES.find(hasHtml);
if (!site) {
  console.error(`No prerendered HTML found in: ${CANDIDATES.join(", ")}`);
  process.exit(1);
}

console.log(`Indexing ${site}`);
execFileSync("npx", ["pagefind", "--site", site, "--output-path", OUTPUT], {
  stdio: "inherit",
});

// If the Vercel adapter already collected static assets, make sure the index
// ships with them too.
const adapterStatic = ".next/output/static";
if (existsSync(adapterStatic)) {
  cpSync(OUTPUT, join(adapterStatic, "pagefind"), { recursive: true });
  console.log(`Copied index to ${adapterStatic}/pagefind`);
}
