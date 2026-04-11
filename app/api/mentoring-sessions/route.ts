import { NextResponse } from "next/server";

export const revalidate = 300; // revalidate every 5 minutes

// Only fetch these specific mentoring event type IDs
const MENTORING_EVENT_TYPE_IDS = new Set([22726, 995648, 1195730, 995707, 995711]);

interface CalPayment {
  amount: number;        // in cents
  currency: string;
  success: boolean;
  refunded?: boolean;
}

interface CalBooking {
  id: number;
  title: string;
  start: string;
  end: string;
  status: string;
  eventTypeId?: number;
  attendees?: Array<{ name: string; email: string }>;
  responses?: Record<string, { label: string; value: string | string[] }>;
  payment?: CalPayment[];
}

function obfuscateName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0);
  return `${first} ${lastInitial}.`;
}

function categorizeTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("interview")) return "interview";
  if (t.includes("mentor")) return "mentoring";
  if (t.includes("60") || t.includes("hour") || t.includes("45")) return "chat-long";
  if (t.includes("30")) return "chat-30";
  if (t.includes("15")) return "chat-15";
  return "chat-30";
}

export async function GET() {
  const apiKey = process.env.CAL_COM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ sessions: [], error: "Cal.com API key not configured" });
  }

  try {
    const res = await fetch(
      `https://api.cal.com/v2/bookings?status=accepted&take=100`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "cal-api-version": "2024-08-13",
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`Cal.com API error: ${res.status}`);
    }

    const data = await res.json();
    const bookings: CalBooking[] = data.data ?? [];

    const sessions = bookings
      .filter(
        (b) =>
          b.status === "accepted" &&
          b.start &&
          (!b.eventTypeId || MENTORING_EVENT_TYPE_IDS.has(b.eventTypeId))
      )
      .map((b) => {
        const attendeeName =
          b.attendees?.find((a) => a.email !== process.env.NEXT_PUBLIC_CAL_EMAIL)?.name ??
          b.attendees?.[0]?.name ??
          "Anonymous";

        // Look for a human-written topic, skip system fields (location, email, name, integrations)
        const SKIP_KEYS = new Set(["location", "guests", "email", "name"]);
        const SKIP_PREFIXES = ["integrations:", "http", "zoom", "google", "tel:"];
        let topic: string | null = null;
        if (b.responses) {
          for (const [key, v] of Object.entries(b.responses)) {
            if (SKIP_KEYS.has(key.toLowerCase())) continue;
            const val = typeof v.value === "string" ? v.value : Array.isArray(v.value) ? v.value[0] : null;
            if (!val || typeof val !== "string") continue;
            if (SKIP_PREFIXES.some((p) => val.toLowerCase().startsWith(p))) continue;
            if (val.length > 4 && val.length < 300) {
              topic = val;
              break;
            }
          }
        }

        // Extract cost from cal.com payment (Stripe integration — amount is in cents)
        const successfulPayment = b.payment?.find((p) => p.success && !p.refunded);
        const cost = successfulPayment ? successfulPayment.amount / 100 : undefined;

        // Calculate duration from start/end times
        const durationMinutes = b.start && b.end
          ? Math.round((new Date(b.end).getTime() - new Date(b.start).getTime()) / 60000)
          : undefined;

        return {
          date: b.start.split("T")[0],
          name: obfuscateName(attendeeName),
          type: categorizeTitle(b.title),
          eventTypeName: b.title,
          topic: topic ?? null,
          source: "cal.com" as const,
          ...(cost !== undefined && { cost }),
          ...(durationMinutes !== undefined && { durationMinutes }),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("Cal.com fetch error:", err);
    return NextResponse.json({ sessions: [], error: "Failed to fetch cal.com data" });
  }
}
