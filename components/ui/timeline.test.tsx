// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { getEducation } from "@/lib/content";
import { Timeline } from "./timeline";

afterEach(cleanup);

const items = [
  {
    title: "Senior Engineer",
    subtitle: "Slack",
    subtitleHref: "/organizations/slack",
    logo: "/images/organizations/slack.png",
    orgUrl: "https://slack.com",
    slug: "senior-engineer",
    startDate: "2022-01-15",
    endDate: null,
    description: "Built things.",
    linkPrefix: "/experience",
  },
  {
    title: "Intern",
    subtitle: "Acme",
    logo: "",
    slug: "intern",
    startDate: "2015-06-15",
    endDate: "2015-08-15",
    description: "",
    linkPrefix: "/experience",
  },
];

describe("Timeline", () => {
  it("renders entries with date ranges, title links and optional subtitle links", () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.firstChild).toHaveClass("sm:before:bg-horchata-200");
    expect(screen.getByRole("link", { name: "Senior Engineer" })).toHaveAttribute(
      "href",
      "/experience/senior-engineer"
    );
    const subtitle = screen.getByRole("link", { name: "Slack" });
    expect(subtitle).toHaveAttribute("href", "/organizations/slack");
    expect(subtitle).toHaveClass("decoration-horchata-300");
    expect(screen.getByText("Jan 2022 – Present")).toBeInTheDocument();
    expect(screen.getByText("Jun 2015 – Aug 2015")).toBeInTheDocument();
    expect(screen.getByText("Built things.")).toBeInTheDocument();
    // plain subtitle without a link, and no description paragraph
    expect(screen.queryByRole("link", { name: "Acme" })).toBeNull();
    expect(screen.getByText("Acme").tagName).toBe("P");
    // stored logo for Slack (mobile + desktop), letter avatar for Acme
    expect(screen.getAllByAltText("Slack")).toHaveLength(2);
    expect(screen.getAllByLabelText("Acme")).toHaveLength(2);
  });

  it("uses dark styling", () => {
    const { container } = render(<Timeline items={items} dark />);
    expect(container.firstChild).toHaveClass("sm:before:bg-navy-700");
    expect(screen.getByRole("link", { name: "Slack" })).toHaveClass("decoration-white/30");
    expect(screen.getByText("Built things.")).toHaveClass("text-white/70");
  });

  it("renders real education entries", () => {
    const education = getEducation().map((e) => ({
      title: e.degree,
      subtitle: e.institution,
      logo: e.logo,
      slug: e.slug,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description ?? "",
      linkPrefix: "/education",
    }));
    render(<Timeline items={education} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(education.length);
  });
});
