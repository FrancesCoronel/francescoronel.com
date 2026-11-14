import { test, expect } from "@playwright/test";

/**
 * Signs up on the deployed site with a Resend test address, then checks through
 * the Resend API that the contact landed in the newsletter segment, and deletes
 * it afterwards. Runs from .github/workflows/newsletter-e2e.yml with
 * playwright.newsletter.config.ts; the normal e2e run ignores this file.
 */

const RESEND_API = "https://api.resend.com";
const apiKey = process.env.RESEND_API_KEY;
const segmentId = process.env.RESEND_SEGMENT_ID;
const siteUrl = process.env.NEWSLETTER_E2E_URL;

// resend.dev addresses never reach a real inbox, and the API route skips the
// Slack ping for them
const email = `delivered+e2e-${Date.now()}@resend.dev`;

async function resend(path: string, init: RequestInit = {}) {
  return fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...init.headers },
  });
}

test.describe("newsletter signup (live)", () => {
  test.skip(
    !apiKey || !siteUrl,
    "Set NEWSLETTER_E2E_URL and RESEND_API_KEY to run the live newsletter test (see newsletter-e2e.yml)",
  );

  test.afterAll(async () => {
    if (!apiKey) return;
    const res = await resend(`/contacts/${encodeURIComponent(email)}`, { method: "DELETE" });
    // 404 means the signup never created it
    if (!res.ok && res.status !== 404) {
      console.warn(`Could not delete test contact ${email}: ${res.status} ${await res.text()}`);
    }
  });

  test("subscribing adds the contact to the Resend segment", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("#newsletter");
    await section.scrollIntoViewIfNeeded();
    await section.getByLabel("Email address").fill(email);
    await section.getByRole("button", { name: "Subscribe" }).click();

    await expect(section.getByText("You're in! Check your inbox to confirm.")).toBeVisible({
      timeout: 15_000,
    });

    // The contact shows up in Resend, then in the segment
    let contactId = "";
    await expect
      .poll(
        async () => {
          const res = await resend(`/contacts/${encodeURIComponent(email)}`);
          if (!res.ok) return `HTTP ${res.status}`;
          const contact = (await res.json()) as { id?: string; unsubscribed?: boolean };
          contactId = contact.id ?? "";
          return contact.unsubscribed === false && contactId ? "subscribed" : JSON.stringify(contact);
        },
        { message: `contact ${email} exists in Resend`, timeout: 60_000, intervals: [2_000, 3_000, 5_000] },
      )
      .toBe("subscribed");

    if (!segmentId) {
      test.info().annotations.push({ type: "note", description: "RESEND_SEGMENT_ID not set; segment check skipped" });
      return;
    }

    await expect
      .poll(
        async () => {
          const res = await resend(`/contacts/${contactId}/segments`);
          if (!res.ok) return [`HTTP ${res.status}`];
          const body = (await res.json()) as { data?: { id: string }[] };
          return (body.data ?? []).map((s) => s.id);
        },
        { message: `contact ${email} is in segment ${segmentId}`, timeout: 60_000, intervals: [2_000, 3_000, 5_000] },
      )
      .toContain(segmentId);
  });
});
