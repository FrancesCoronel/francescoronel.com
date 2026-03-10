#!/usr/bin/env node

/**
 * Audits all organizations for:
 * - Broken/unreachable website URLs
 * - Missing logo files
 * - No references (no blog posts, experience, education, testimonials, or awards mention them)
 *
 * Usage: node scripts/audit-orgs.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const contentDir = path.join(__dirname, "..", "content");
const publicDir = path.join(__dirname, "..", "public");

const orgs = JSON.parse(fs.readFileSync(path.join(contentDir, "organizations.json"), "utf8"));
const experiences = JSON.parse(fs.readFileSync(path.join(contentDir, "experience.json"), "utf8"));
const education = JSON.parse(fs.readFileSync(path.join(contentDir, "education.json"), "utf8"));
const testimonials = JSON.parse(fs.readFileSync(path.join(contentDir, "testimonials.json"), "utf8"));
const awards = JSON.parse(fs.readFileSync(path.join(contentDir, "awards.json"), "utf8"));

// Load blog post org references
const blogDir = path.join(contentDir, "blog");
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith(".mdx"));
const blogOrgRefs = new Set();
for (const f of blogFiles) {
  const content = fs.readFileSync(path.join(blogDir, f), "utf8");
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const orgMatch = fm[1].match(/^organizations:\s*\[(.*?)\]/m);
  if (orgMatch) {
    orgMatch[1].split(",").map(s => s.trim().replace(/"/g, "")).filter(Boolean).forEach(o => blogOrgRefs.add(o));
  }
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const timeout = 10000;
    const client = url.startsWith("https") ? https : http;

    try {
      const req = client.get(url, {
        timeout,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; site-audit/1.0)" }
      }, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve({ status: res.statusCode, redirect: res.headers.location, ok: true });
        } else if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ status: res.statusCode, ok: true });
        } else {
          resolve({ status: res.statusCode, ok: false });
        }
        res.resume(); // consume response
      });

      req.on("error", (err) => {
        resolve({ status: 0, error: err.code || err.message, ok: false });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ status: 0, error: "TIMEOUT", ok: false });
      });
    } catch (err) {
      resolve({ status: 0, error: err.message, ok: false });
    }
  });
}

async function main() {
  const issues = [];

  for (const org of orgs) {
    const orgIssues = [];

    // Check logo file exists
    if (org.logo) {
      const logoPath = org.logo.startsWith("/")
        ? path.join(publicDir, org.logo)
        : path.join(publicDir, org.logo);
      if (!fs.existsSync(logoPath)) {
        orgIssues.push(`MISSING LOGO: ${org.logo}`);
      }
    } else {
      orgIssues.push("NO LOGO");
    }

    // Check references
    const hasBlogs = blogOrgRefs.has(org.slug);
    const hasExp = experiences.some(e => e.company === org.name || e.companyLogo === org.logo);
    const hasEdu = education.some(e => e.institution === org.name || e.logo === org.logo);
    const hasTestimonials = testimonials.some(t => t.organization === org.name);
    const hasAwards = awards.some(a => a.organization === org.name);
    const refCount = [hasBlogs, hasExp, hasEdu, hasTestimonials, hasAwards].filter(Boolean).length;

    if (refCount === 0) {
      orgIssues.push("ORPHANED: no references anywhere");
    }

    // Check URL
    if (org.url) {
      process.stdout.write(`Checking ${org.slug}...`);
      const result = await checkUrl(org.url);
      if (!result.ok) {
        orgIssues.push(`BROKEN URL: ${org.url} → ${result.error || `HTTP ${result.status}`}`);
        process.stdout.write(` BROKEN (${result.error || result.status})\n`);
      } else {
        process.stdout.write(` OK (${result.status})\n`);
      }
    } else {
      orgIssues.push("NO URL");
    }

    if (orgIssues.length > 0) {
      issues.push({ org, issues: orgIssues, refCount });
    }
  }

  console.log("\n\n=== AUDIT RESULTS ===\n");
  console.log(`Total organizations: ${orgs.length}`);
  console.log(`With issues: ${issues.length}`);
  console.log(`Clean: ${orgs.length - issues.length}\n`);

  // Group by severity
  const broken = issues.filter(i => i.issues.some(x => x.startsWith("BROKEN URL")));
  const orphaned = issues.filter(i => i.issues.some(x => x.startsWith("ORPHANED")));
  const missingLogo = issues.filter(i => i.issues.some(x => x.includes("LOGO")));
  const noUrl = issues.filter(i => i.issues.some(x => x === "NO URL"));

  if (broken.length > 0) {
    console.log(`=== BROKEN URLs (${broken.length}) ===`);
    for (const { org, issues: iss } of broken) {
      const urlIssue = iss.find(x => x.startsWith("BROKEN URL"));
      console.log(`  ${org.slug} (${org.name})`);
      console.log(`    ${urlIssue}`);
      console.log(`    References: ${iss.some(x => x.startsWith("ORPHANED")) ? "NONE" : "has refs"}`);
    }
    console.log("");
  }

  if (orphaned.length > 0) {
    console.log(`=== ORPHANED - no references (${orphaned.length}) ===`);
    for (const { org } of orphaned) {
      console.log(`  ${org.slug} (${org.name}) — ${org.url || "no url"}`);
    }
    console.log("");
  }

  if (noUrl.length > 0) {
    console.log(`=== NO URL (${noUrl.length}) ===`);
    for (const { org } of noUrl) {
      console.log(`  ${org.slug} (${org.name})`);
    }
    console.log("");
  }

  if (missingLogo.length > 0) {
    console.log(`=== MISSING LOGO (${missingLogo.length}) ===`);
    for (const { org, issues: iss } of missingLogo) {
      const logoIssue = iss.find(x => x.includes("LOGO"));
      console.log(`  ${org.slug}: ${logoIssue}`);
    }
    console.log("");
  }
}

main().catch(console.error);
