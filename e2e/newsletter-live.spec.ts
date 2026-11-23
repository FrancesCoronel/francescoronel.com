import { test, expect } from "@playwright/test";

/**
 * Signs up on the deployed site with a Resend test address and walks the double
 * opt-in through the Resend API: no contact exists after the signup, the
 * confirmation email was sent, opening its link shows the confirmed page, and
 * only then is the contact in the newsletter segment. Deletes it afterwards. Runs from .github/workflows/newsletter-e2e.yml with
 * playwright.newsletter.config.ts; the normal e2e run ignores this file.
 */

const RESEND_API = "https://api.resend.com";
const apiKey = process.env.RESEND_API_KEY;
const segmentId = process.env.RESEND_SEGMENT_ID;
const siteUrl = process.env.NEWSLETTER_E2E_URL;

// resend.dev addresses never reach a real inbox, and the confirm route skips
// the Slack ping for them
const email = `delivered+e2e-${Date.now()}@resend.dev`;

async function resend(path: string, init: RequestInit = {}) {
  return fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...init.headers },
  });
}

const poll = { timeout: 60_000, intervals: [2_000, 3_000, 5_000] };

interface SentEmail {
  id: string;
  to?: string[];
  subject?: string;
}

/** Finds the confirmation email sent to `email` among the latest sent emails. */
async function findConfirmationEmail(): Promise<SentEmail | undefined> {
  const res = await resend("/emails?limit=100");
  if (!res.ok) return undefined;
  const body = (await res.json()) as { data?: SentEmail[] };
  return (body.data ?? []).find((e) => (e.to ?? []).some((to) => to.toLowerCase() === email.toLowerCase()));
}

/** Pulls the confirm link out of a sent email's HTML (or its text as a fallback). */
function confirmLink(html = "", text = ""): string | undefined {
  const fromHtml = html.match(/href="([^"]*\/api\/newsletter\/confirm\?token=[^"]+)"/)?.[1];
  if (fromHtml) return fromHtml.replace(/&amp;/g, "&");
  return text.match(/https?:\/\/\S+\/api\/newsletter\/confirm\?token=\S+/)?.[0];
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

  test("signing up sends a confirmation, and confirming adds the contact to the segment", async ({ page }) => {
    await page.goto("/");

    const section = page.locator("#newsletter");
    await section.scrollIntoViewIfNeeded();
    await section.getByLabel("Email address").fill(email);
    await section.getByRole("button", { name: "Subscribe" }).click();

    await expect(section.getByText("Almost there! Check your inbox to confirm.")).toBeVisible({
      timeout: 15_000,
    });

    // The confirmation email shows up in Resend's sent emails
    let sent: SentEmail | undefined;
    await expect
      .poll(
        async () => {
          sent = await findConfirmationEmail();
          return sent?.subject ?? "not sent yet";
        },
        { message: `confirmation email to ${email} was sent`, ...poll },
      )
      .toContain("Confirm your subscription");

    // Double opt-in: nothing is stored until the link is opened
    const before = await resend(`/contacts/${encodeURIComponent(email)}`);
    expect(before.status, `no contact for ${email} before confirming`).toBe(404);

    const res = await resend(`/emails/${sent!.id}`);
    expect(res.ok, `read email ${sent!.id}`).toBe(true);
    const full = (await res.json()) as { html?: string; text?: string };
    const link = confirmLink(full.html, full.text);
    expect(link, "confirm link in the email").toBeTruthy();

    await page.goto(link!);
    await expect(page).toHaveURL(/\/newsletter\/confirmed$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("You're In 🎉");

    // Now the contact exists, subscribed, and in the segment
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
        { message: `contact ${email} exists in Resend`, ...poll },
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
        { message: `contact ${email} is in segment ${segmentId}`, ...poll },
      )
      .toContain(segmentId);
  });
});
