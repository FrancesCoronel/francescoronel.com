// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import mentoringData from "@/content/mentoring-sessions.json";
import { MentoringSessionsFeed } from "./mentoring-sessions-feed";

afterEach(cleanup);

const meta = mentoringData._meta;
const byYear = meta.byYear as Record<string, number>;
const existing = mentoringData.sessions[0];

function stubFetch(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve(body) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function yearCount(year: string) {
  const label = screen.getByText(year.slice(2), { selector: "span.text-\\[10px\\]" });
  return label.parentElement!.firstElementChild!.textContent;
}

describe("MentoringSessionsFeed", () => {
  it("renders historical totals and a bar per year", async () => {
    const fetchMock = stubFetch({});
    render(<MentoringSessionsFeed />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/mentoring-sessions"));
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Mentoring Sessions 📈");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/mentoring/sessions");
    expect(screen.getByRole("link")).toHaveTextContent(`Browse all ${meta.totalSessions}+ sessions →`);
    for (const year of Object.keys(byYear)) {
      expect(yearCount(year)).toBe(String(byYear[year]));
    }
  });

  it("merges live sessions, counting only ones not already in the history", async () => {
    stubFetch({
      sessions: [
        { date: "2099-01-05", name: "New Mentee", type: "chat-15", eventTypeName: "Chat" },
        { date: "2025-06-01", name: "Another Mentee", type: "chat-15", eventTypeName: "Chat" },
        { ...existing },
      ],
    });
    render(<MentoringSessionsFeed />);
    await screen.findByText(`Browse all ${meta.totalSessions + 3}+ sessions →`);
    expect(yearCount("2099")).toBe("1");
    expect(yearCount("2025")).toBe(String(byYear["2025"] + 1));
    const existingYear = existing.date.slice(0, 4);
    if (existingYear !== "2025") {
      expect(yearCount(existingYear)).toBe(String(byYear[existingYear]));
    }
    // the bar for the busiest year is the full 60px height; the new year gets the minimum
    const bar2099 = screen.getByText("99", { selector: "span.text-\\[10px\\]" })
      .previousElementSibling as HTMLElement;
    expect(bar2099.style.height).toBe("4px");
  });

  it("ignores fetch failures", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    render(<MentoringSessionsFeed />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.getByRole("link")).toHaveTextContent(`Browse all ${meta.totalSessions}+ sessions →`);
  });
});
