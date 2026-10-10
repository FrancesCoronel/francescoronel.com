// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import mentoringData from "@/content/mentoring-sessions.json";
import { MentoringStats } from "./mentoring-stats";

afterEach(cleanup);

const meta = mentoringData._meta;

function statValue(label: string) {
  return screen.getByText(label).previousElementSibling?.textContent;
}

describe("MentoringStats", () => {
  it("shows the totals from the mentoring data", () => {
    render(<MentoringStats />);
    expect(statValue("Total sessions")).toBe(String(meta.totalSessions));
    expect(statValue("Unique mentees")).toBe(String(meta.uniqueMentees));
    expect(statValue("Years of mentoring")).toBe(String(Object.keys(meta.byYear).length));
    expect(statValue("Hours logged")).toBe(`${Math.round(meta.totalMinutes / 60)}h`);
  });

  it("lets the caller override the total sessions", () => {
    render(<MentoringStats totalSessions={999} />);
    expect(statValue("Total sessions")).toBe("999");
  });
});
