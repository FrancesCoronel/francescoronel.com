// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import mentoringData from "@/content/mentoring-sessions.json";
import { SessionsTable } from "./sessions-table";

interface RawSession {
  date: string;
  name: string;
  type: string;
  source?: string;
}

const historical = mentoringData.sessions as RawSession[];
const total = mentoringData._meta.totalSessions;
const newest = [...historical].sort((a, b) => b.date.localeCompare(a.date))[0];

const liveSessions = [
  // New year, unknown source, no duration
  { date: "2027-03-04", name: "Ada L.", type: "community", eventTypeName: "Meetup", source: "meetup" },
  { date: "2027-03-03", name: "Formation Client", type: "partner", eventTypeName: "Partner Session", source: "formation", durationMinutes: 45 },
  { date: "2027-03-02", name: "Grace H.", type: "podcast", eventTypeName: "Podcast", source: "cal.com", durationMinutes: 60 },
  { date: "2027-03-01", name: "Linus T.", type: "interview", eventTypeName: "Mock Interview", source: "leland", durationMinutes: 30 },
  // Duplicate of the newest historical session
  { ...newest },
];

function stubFetch(impl: () => Promise<unknown>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function jsonResponse(body: unknown) {
  return () => Promise.resolve({ json: () => Promise.resolve(body) });
}

function bodyRows() {
  return within(screen.getByRole("table")).getAllByRole("row").slice(1);
}

function statValue(label: string) {
  return screen.getByText(label).previousElementSibling?.textContent;
}

function yearBar(year: string) {
  const label = screen.getAllByText(year).find((el) => el.tagName === "SPAN")!;
  return label.parentElement!.firstElementChild!.textContent;
}

afterEach(cleanup);

describe("SessionsTable", () => {
  it("renders the historical sessions while the live fetch is pending", () => {
    const fetchMock = stubFetch(() => new Promise(() => {}));
    render(<SessionsTable />);

    expect(fetchMock).toHaveBeenCalledWith("/api/mentoring-sessions");
    expect(screen.getByText(`${historical.length} sessions`)).toBeInTheDocument();
    expect(statValue("Total sessions")).toBe(String(total));
    expect(bodyRows()).toHaveLength(50);
    expect(yearBar("2019")).toBe(String(mentoringData._meta.byYear["2019"]));
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("merges live sessions, skipping ones already in the history", async () => {
    stubFetch(jsonResponse({ sessions: liveSessions }));
    render(<SessionsTable />);

    await waitFor(() => expect(screen.getByText(`${historical.length + 4} sessions`)).toBeInTheDocument());
    expect(statValue("Total sessions")).toBe(String(total + liveSessions.length));
    expect(yearBar("2027")).toBe("4");
    expect(screen.getByRole("option", { name: "2027" })).toBeInTheDocument();

    const [meetup, formation, podcast, interview] = bodyRows();
    const meetupCells = within(meetup).getAllByRole("cell");
    expect(meetupCells.map((c) => c.textContent)).toEqual(["Mar 4, 2027", "Ada L.", "—", "Community", "meetup"]);
    expect(within(meetup).queryByRole("img")).not.toBeInTheDocument();

    // "Formation Client" rows show the event type instead of the placeholder name
    expect(within(formation).getAllByRole("cell").map((c) => c.textContent)).toEqual([
      "Mar 3, 2027",
      "Partner Session",
      "45m",
      "Community",
      "Formation",
    ]);
    expect(within(formation).getByRole("img", { name: "formation" })).toHaveAttribute(
      "src",
      "/images/organizations/formation.png"
    );
    expect(within(podcast).getByText("Community")).toBeInTheDocument();
    expect(within(podcast).getByRole("img", { name: "cal.com" })).toBeInTheDocument();
    expect(within(interview).getByText("Interview Prep")).toBeInTheDocument();
    expect(within(interview).getByText("Leland")).toBeInTheDocument();
  });

  it.each([
    ["an empty payload", jsonResponse({})],
    ["an empty session list", jsonResponse({ sessions: [] })],
    ["a network error", () => Promise.reject(new Error("offline"))],
  ])("falls back to the history alone on %s", async (_label, impl) => {
    const fetchMock = stubFetch(impl);
    render(<SessionsTable />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(`${historical.length} sessions`)).toBeInTheDocument());
    expect(statValue("Total sessions")).toBe(String(total));
    expect(screen.queryByRole("option", { name: "2027" })).not.toBeInTheDocument();
  });

  it("filters by year, category and source and resets to page 1", async () => {
    stubFetch(jsonResponse({ sessions: liveSessions }));
    const user = userEvent.setup();
    render(<SessionsTable />);
    await screen.findByRole("option", { name: "2027" });

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByRole("button", { name: "2" })).toHaveClass("bg-horchata-500");

    const [yearSelect, categorySelect, sourceSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(yearSelect, "2015");
    expect(screen.getByText("1 sessions")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    // Sessions with no source are attributed to Calendly
    expect(within(bodyRows()[0]).getByText("Calendly")).toBeInTheDocument();
    expect(within(bodyRows()[0]).getByRole("img", { name: "calendly" })).toBeInTheDocument();

    await user.selectOptions(yearSelect, "2027");
    expect(screen.getByText("4 sessions")).toBeInTheDocument();

    await user.selectOptions(categorySelect, "community");
    expect(screen.getByText("3 sessions")).toBeInTheDocument();

    await user.selectOptions(sourceSelect, "formation");
    expect(screen.getByText("1 sessions")).toBeInTheDocument();
    expect(within(bodyRows()[0]).getByText("Partner Session")).toBeInTheDocument();

    await user.selectOptions(sourceSelect, "calendly");
    expect(screen.getByText("0 sessions")).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(0);

    // Source-less sessions match the Calendly source filter
    await user.selectOptions(categorySelect, "all");
    await user.selectOptions(yearSelect, "2015");
    expect(screen.getByText("1 sessions")).toBeInTheDocument();

    await user.selectOptions(yearSelect, "all");
    await user.selectOptions(categorySelect, "interview-prep");
    await user.selectOptions(sourceSelect, "all");
    const interviewCount = historical.filter((s) => s.type === "interview").length + 1;
    expect(screen.getByText(`${interviewCount} sessions`)).toBeInTheDocument();
    expect(bodyRows().every((row) => within(row).queryByText("Interview Prep"))).toBe(true);

    await user.selectOptions(categorySelect, "mentoring");
    const mentoringCount = historical.filter(
      (s) => !["interview", "community", "partner", "podcast"].includes(s.type)
    ).length;
    expect(screen.getByText(`${mentoringCount} sessions`)).toBeInTheDocument();
  });
});
