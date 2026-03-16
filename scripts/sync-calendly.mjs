/**
 * sync-calendly.mjs
 *
 * Fetches all historical Calendly bookings via the v2 API and enriches
 * content/mentoring-sessions.json with:
 *   - topic (invitee question answers)
 *   - cost (Stripe payment via /invitee_payments)
 *   - durationMinutes (from event start/end times)
 *
 * Usage:
 *   CALENDLY_API_KEY=<personal_access_token> node scripts/sync-calendly.mjs
 *
 * Options (env vars):
 *   DRY_RUN=1   Print what would change without writing the file
 *   VERBOSE=1   Log every matched/unmatched event
 *
 * Get your Personal Access Token at:
 *   https://calendly.com/integrations/api_webhooks
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../content/mentoring-sessions.json");

const API_KEY = process.env.CALENDLY_API_KEY;
const DRY_RUN = process.env.DRY_RUN === "1";
const VERBOSE = process.env.VERBOSE === "1";

if (!API_KEY) {
  console.error("Error: CALENDLY_API_KEY env var is required.");
  console.error("Get yours at: https://calendly.com/integrations/api_webhooks");
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// Keys to skip when looking for the mentee's question answer (topic)
const SKIP_KEYS = new Set(["name", "email", "location", "guests", "phone_number"]);
const SKIP_PREFIXES = ["integrations:", "http", "zoom", "google", "tel:", "https"];

async function apiFetch(url, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get("retry-after") ?? "10", 10);
      const wait = (retryAfter + 1) * 1000;
      if (VERBOSE) console.log(`  Rate limited, waiting ${wait}ms...`);
      else process.stdout.write("⏳");
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Calendly API error ${res.status} for ${url}: ${text}`);
    }
    return res.json();
  }
  throw new Error(`Exhausted retries for ${url}`);
}

/** Get the authenticated user's URI (needed to scope event queries) */
async function getMe() {
  const data = await apiFetch("https://api.calendly.com/users/me");
  return data.resource;
}

/** Fetch ALL scheduled events for the user, paginated */
async function fetchAllEvents(userUri) {
  const events = [];
  let pageToken = null;
  let page = 1;

  do {
    const params = new URLSearchParams({
      user: userUri,
      count: "100",
      status: "active",
      sort: "start_time:desc",
    });
    if (pageToken) params.set("page_token", pageToken);

    const url = `https://api.calendly.com/scheduled_events?${params}`;
    if (VERBOSE) console.log(`  Fetching events page ${page}...`);

    const data = await apiFetch(url);
    events.push(...(data.collection ?? []));
    pageToken = data.pagination?.next_page_token ?? null;
    page++;

    // Rate limit: 100 req/min, be polite
    if (pageToken) await sleep(300);
  } while (pageToken);

  return events;
}

/** Fetch invitees (and their question answers) for a single event */
async function fetchInvitees(eventUri) {
  const uuid = eventUri.split("/").pop();
  const url = `https://api.calendly.com/scheduled_events/${uuid}/invitees?count=100`;
  const data = await apiFetch(url);
  return data.collection ?? [];
}

/** Fetch payment info for a single invitee */
async function fetchInviteePayment(inviteeUri) {
  try {
    const uuid = inviteeUri.split("/").pop();
    const url = `https://api.calendly.com/invitee_payments/${uuid}`;
    const data = await apiFetch(url);
    return data.resource ?? null;
  } catch {
    return null;
  }
}

/** Extract the human-written topic from invitee question_and_answers */
function extractTopic(questionsAndAnswers) {
  if (!questionsAndAnswers?.length) return null;
  for (const qa of questionsAndAnswers) {
    const key = (qa.question ?? "").toLowerCase();
    if (SKIP_KEYS.has(key)) continue;
    const val = qa.answer ?? "";
    if (!val || typeof val !== "string") continue;
    if (SKIP_PREFIXES.some((p) => val.toLowerCase().startsWith(p))) continue;
    if (val.length > 4 && val.length < 300) return val.trim();
  }
  return null;
}

/** Normalize a name to "First L." for matching */
function obfuscateName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("Loading mentoring-sessions.json...");
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const sessions = data.sessions;

  const calendlySessions = sessions.filter((s) => !s.source || s.source === "calendly");
  console.log(`Found ${calendlySessions.length} Calendly sessions in JSON`);

  console.log("\nFetching Calendly user info...");
  const me = await getMe();
  console.log(`Authenticated as: ${me.name} (${me.email})`);

  console.log("\nFetching all scheduled events (this may take a while)...");
  const events = await fetchAllEvents(me.uri);
  console.log(`Fetched ${events.length} total events from Calendly`);

  // Build a lookup: "YYYY-MM-DD::First L." -> event
  const eventsByKey = new Map();
  for (const event of events) {
    const dateStr = event.start_time?.split("T")[0];
    if (!dateStr) continue;
    // We'll populate invitee names lazily when matching
    eventsByKey.set(dateStr, eventsByKey.get(dateStr) ?? []);
    eventsByKey.get(dateStr).push(event);
  }

  let enriched = 0;
  let alreadyHadTopic = 0;
  let noMatch = 0;
  let newTopics = 0;
  let newCosts = 0;
  let newDurations = 0;

  console.log("\nEnriching sessions...");

  for (const session of sessions) {
    if (session.source && session.source !== "calendly") continue;

    // Skip if already fully enriched
    const needsTopic = !session.topic;
    const needsCost = session.cost == null;
    const needsDuration = session.durationMinutes == null;
    if (!needsTopic && !needsCost && !needsDuration) continue;

    const dateEvents = eventsByKey.get(session.date) ?? [];
    if (!dateEvents.length) {
      if (VERBOSE) console.log(`  No events on ${session.date} for ${session.name}`);
      noMatch++;
      continue;
    }

    // Try to match by invitee name
    let matched = null;
    let matchedInvitee = null;

    for (const event of dateEvents) {
      // Fetch invitees for this event
      if (!event._invitees) {
        event._invitees = await fetchInvitees(event.uri);
        await sleep(700);
      }

      for (const invitee of event._invitees) {
        const normalized = obfuscateName(invitee.name ?? "");
        if (normalized === session.name) {
          matched = event;
          matchedInvitee = invitee;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      if (VERBOSE) console.log(`  No invitee match for ${session.date} ${session.name}`);
      noMatch++;
      continue;
    }

    enriched++;
    let changed = false;

    // Topic from invitee question answers
    if (needsTopic) {
      const topic = extractTopic(matchedInvitee.questions_and_answers);
      if (topic) {
        session.topic = topic;
        newTopics++;
        changed = true;
        if (VERBOSE) console.log(`  [TOPIC] ${session.date} ${session.name}: ${topic}`);
      }
    }

    // Duration from event start/end
    if (needsDuration && matched.start_time && matched.end_time) {
      const mins = Math.round(
        (new Date(matched.end_time) - new Date(matched.start_time)) / 60000
      );
      if (mins > 0) {
        session.durationMinutes = mins;
        newDurations++;
        changed = true;
      }
    }

    // Payment
    if (needsCost && matchedInvitee.uri) {
      const payment = await fetchInviteePayment(matchedInvitee.uri);
      await sleep(700);
      if (payment?.amount && payment.status === "paid") {
        // Calendly returns amount in dollars (not cents, unlike Stripe direct)
        session.cost = parseFloat(payment.amount);
        newCosts++;
        changed = true;
        if (VERBOSE) console.log(`  [COST] ${session.date} ${session.name}: $${session.cost}`);
      }
    }

    if (changed && !VERBOSE) {
      process.stdout.write(".");
    }
  }

  console.log("\n");

  // Recalculate _meta
  const byYear = {}, byType = {}, uniqueNames = new Set();
  let totalMinutes = 0, totalRevenue = 0;
  for (const s of sessions) {
    const year = s.date.slice(0, 4);
    byYear[year] = (byYear[year] ?? 0) + 1;
    byType[s.type] = (byType[s.type] ?? 0) + 1;
    uniqueNames.add(s.name.toLowerCase());
    if (s.durationMinutes) totalMinutes += s.durationMinutes;
    if (s.cost) totalRevenue += s.cost;
  }

  const newMeta = {
    ...data._meta,
    totalSessions: sessions.length,
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    uniqueMentees: uniqueNames.size,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    byYear,
    byType,
  };

  console.log("=== Results ===");
  console.log(`  Events fetched from Calendly: ${events.length}`);
  console.log(`  Sessions matched:             ${enriched}`);
  console.log(`  No match found:               ${noMatch}`);
  console.log(`  New topics added:             ${newTopics}`);
  console.log(`  New costs added:              ${newCosts}`);
  console.log(`  New durations added:          ${newDurations}`);

  if (DRY_RUN) {
    console.log("\nDRY_RUN=1 — not writing file.");
    return;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify({ _meta: newMeta, sessions }, null, 2));
  console.log(`\nWrote ${DATA_PATH}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
