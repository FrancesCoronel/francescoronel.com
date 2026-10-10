import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, revalidate } from "./route";

function stubBookings(body: unknown, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, status, json: async () => body });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function booking(overrides: Record<string, unknown>) {
  return {
    id: 1,
    title: "Mentoring Session",
    start: "2024-05-01T10:00:00Z",
    end: "2024-05-01T10:30:00Z",
    status: "accepted",
    eventTypeId: 22726,
    attendees: [{ name: "Ada Byron Lovelace", email: "ada@example.com" }],
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/mentoring-sessions", () => {
  it("revalidates every five minutes", () => {
    expect(revalidate).toBe(300);
  });

  it("returns an error payload when the API key is missing", async () => {
    vi.stubEnv("CAL_COM_API_KEY", "");
    const res = await GET();
    expect(await res.json()).toEqual({ sessions: [], error: "Cal.com API key not configured" });
  });

  it("calls the Cal.com bookings API with auth headers", async () => {
    vi.stubEnv("CAL_COM_API_KEY", "cal-key");
    const fetchMock = stubBookings({});
    const res = await GET();
    expect(await res.json()).toEqual({ sessions: [] });
    expect(fetchMock).toHaveBeenCalledWith("https://api.cal.com/v2/bookings?status=accepted&take=100", {
      headers: { Authorization: "Bearer cal-key", "cal-api-version": "2024-08-13" },
      next: { revalidate: 300 },
    });
  });

  it("reports failures from the Cal.com API", async () => {
    vi.stubEnv("CAL_COM_API_KEY", "cal-key");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    stubBookings({}, false, 503);
    const res = await GET();
    expect(await res.json()).toEqual({ sessions: [], error: "Failed to fetch cal.com data" });
    expect(consoleError).toHaveBeenCalledWith("Cal.com fetch error:", new Error("Cal.com API error: 503"));
  });

  it("filters, anonymizes and sorts accepted mentoring bookings", async () => {
    vi.stubEnv("CAL_COM_API_KEY", "cal-key");
    vi.stubEnv("NEXT_PUBLIC_CAL_EMAIL", "owner@example.com");
    stubBookings({
      data: [
        booking({}),
        booking({ id: 1, status: "cancelled" }),
        booking({ id: 2, start: "" }),
        booking({ id: 3, eventTypeId: 12345 }),
        booking({
          id: 4,
          start: "2024-01-10T10:00:00Z",
          end: "2024-01-10T11:00:00Z",
          title: "Mock Interview",
          attendees: [
            { name: "Owner Person", email: "owner@example.com" },
            { name: "Grace Brewster Hopper", email: "grace@example.com" },
          ],
          responses: {
            name: { label: "Name", value: "Grace" },
            location: { label: "Location", value: "integrations:zoom" },
            notes: { label: "Notes", value: "Help me prepare for system design" },
          },
          payment: [
            { amount: 5000, currency: "usd", success: false },
            { amount: 7500, currency: "usd", success: true },
          ],
        }),
        booking({
          id: 5,
          eventTypeId: undefined,
          start: "2024-03-05T09:00:00Z",
          end: undefined,
          title: "Quick 15 min chat",
          attendees: [{ name: "Owner Only", email: "owner@example.com" }],
          responses: {
            link: { label: "Link", value: "https://example.com" },
            empty: { label: "Empty", value: "" },
            count: { label: "Count", value: 5 },
            numbers: { label: "Numbers", value: [5] },
            short: { label: "Short", value: "hi" },
            long: { label: "Long", value: "x".repeat(300) },
            topics: { label: "Topics", value: ["Career growth", "Other"] },
          },
          payment: [{ amount: 2000, currency: "usd", success: true, refunded: true }],
        }),
        booking({ id: 6, start: "2024-02-01T09:00:00Z", end: "2024-02-01T09:30:00Z", title: "Coffee", attendees: [], eventTypeId: 995648 }),
        booking({ id: 7, start: "2024-02-02T09:00:00Z", end: "2024-02-02T09:30:00Z", title: "Mentor hour", attendees: undefined }),
      ],
    });

    const res = await GET();
    const { sessions } = await res.json();
    expect(sessions).toEqual([
      {
        date: "2024-05-01",
        name: "Ada L.",
        type: "mentoring",
        eventTypeName: "Mentoring Session",
        topic: null,
        source: "cal.com",
        durationMinutes: 30,
      },
      {
        date: "2024-03-05",
        name: "Owner O.",
        type: "chat-15",
        eventTypeName: "Quick 15 min chat",
        topic: "Career growth",
        source: "cal.com",
      },
      {
        date: "2024-02-02",
        name: "Anonymous",
        type: "mentoring",
        eventTypeName: "Mentor hour",
        topic: null,
        source: "cal.com",
        durationMinutes: 30,
      },
      {
        date: "2024-02-01",
        name: "Anonymous",
        type: "chat-30",
        eventTypeName: "Coffee",
        topic: null,
        source: "cal.com",
        durationMinutes: 30,
      },
      {
        date: "2024-01-10",
        name: "Grace H.",
        type: "interview",
        eventTypeName: "Mock Interview",
        topic: "Help me prepare for system design",
        source: "cal.com",
        cost: 75,
        durationMinutes: 60,
      },
    ]);
  });

  it.each([
    ["60 Minute Call", "chat-long"],
    ["One hour deep dive", "chat-long"],
    ["45 min sync", "chat-long"],
    ["30 min sync", "chat-30"],
    ["15 min intro", "chat-15"],
    ["Hello", "chat-30"],
  ])("categorizes %s as %s and keeps single-word names", async (title, type) => {
    vi.stubEnv("CAL_COM_API_KEY", "cal-key");
    stubBookings({ data: [booking({ title, attendees: [{ name: "  Prince  ", email: "p@example.com" }] })] });
    const { sessions } = await (await GET()).json();
    expect(sessions[0]).toMatchObject({ type, name: "Prince" });
  });
});
