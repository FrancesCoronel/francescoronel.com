// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { Project } from "@/lib/types";
import { ProjectsGridClient } from "./projects-grid-client";

function project(slug: string, overrides: Partial<Project> = {}): Project {
  return {
    title: slug,
    slug,
    tagline: `${slug} tagline`,
    description: "",
    highlights: [],
    skills: [],
    logo: "",
    url: "",
    startDate: "2020-01-15",
    endDate: "2021-06-15",
    category: "side-project",
    ...overrides,
  };
}

const featuredA = project("featured-a", {
  title: "Featured A",
  logo: "/images/projects/a.png",
  status: "active",
  category: "open-source",
  github: "https://github.com/x/a",
  endDate: null,
});
const featuredB = project("featured-b", { title: "Featured B", emoji: "🎙️", category: "podcast" });

const others: Project[] = [
  project("hack", { title: "Hack Day", category: "hackathon", skills: ["react"], status: "active", emoji: "⚡" }),
  project("work", { title: "Work Thing", category: "work-project", github: "https://github.com/x/work", skills: ["react"] }),
  project("odd", { title: "Odd One", category: "experiment" as Project["category"] }),
  ...Array.from({ length: 11 }, (_, i) => project(`side-${i + 1}`, { title: `Side ${i + 1}` })),
];

const projects = [featuredA, featuredB, ...others];
const starsMap: Record<string, number | null> = {
  "featured-a": 1234,
  "featured-b": 0,
  hack: 42,
  work: null,
  odd: 0,
};

function renderGrid(props: Partial<Parameters<typeof ProjectsGridClient>[0]> = {}) {
  const user = userEvent.setup();
  render(<ProjectsGridClient projects={projects} starsMap={starsMap} featuredSlugs={["featured-a", "featured-b"]} {...props} />);
  return user;
}

function card(title: string) {
  return screen.getByRole("link", { name: title }).parentElement!;
}

afterEach(cleanup);

describe("ProjectsGridClient", () => {
  it("shows pinned featured rows and a paginated grid of the rest", async () => {
    const user = renderGrid();
    expect(screen.getByRole("heading", { name: "Featured Projects ⭐" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "All Projects 🛠️" })).toBeInTheDocument();
    expect(screen.getByText("14 projects · page 1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveClass("bg-navy-900");

    const a = card("Featured A");
    expect(screen.getByRole("link", { name: "Featured A" })).toHaveAttribute("href", "/posts/featured-a");
    expect(within(a).getByRole("img", { name: "Featured A" })).toBeInTheDocument();
    expect(within(a).getByText("Active")).toBeInTheDocument();
    expect(within(a).getByText("Open Source")).toHaveClass("text-emerald-600");
    expect(within(a).getByText("Jan 2020 – Present")).toBeInTheDocument();
    expect(within(a).getByText("1,234")).toBeInTheDocument();

    const b = card("Featured B");
    expect(within(b).getByText("🎙️")).toBeInTheDocument();
    expect(within(b).getByText("Podcast")).toBeInTheDocument();
    expect(within(b).getByText("Jan 2020 – Jun 2021")).toBeInTheDocument();
    expect(within(b).queryByText("0")).not.toBeInTheDocument();
    expect(within(b).queryByText("Active")).not.toBeInTheDocument();

    // Grid cards
    const hack = card("Hack Day");
    expect(within(hack).getByText("⚡")).toBeInTheDocument();
    expect(within(hack).getByText("Active")).toBeInTheDocument();
    expect(within(hack).getByText("Hackathon")).toHaveClass("text-sky-600");
    expect(within(hack).getByText("42")).toBeInTheDocument();
    expect(within(hack).getByText("Jan 2020 – Jun 2021")).toBeInTheDocument();

    const work = card("Work Thing");
    expect(within(work).getByText("🛠️")).toBeInTheDocument();
    expect(within(work).getByText("Work Project")).toBeInTheDocument();
    expect(within(work).getByText("Jan 2020 – Jun 2021").tagName).toBe("P");

    // Unknown categories fall back to the raw key and the side-project colour
    const odd = card("Odd One");
    expect(within(odd).getByText("experiment")).toHaveClass("text-horchata-700");
    // Zero stars are hidden like missing ones
    expect(within(odd).getByText("Jan 2020 – Jun 2021").tagName).toBe("P");
    expect(within(odd).queryByText("0")).not.toBeInTheDocument();

    expect(screen.queryByRole("link", { name: "Side 11" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("14 projects · page 2 of 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Side 11" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Hack Day" })).not.toBeInTheDocument();
  });

  it("drops the featured section and headings when nothing is pinned", () => {
    renderGrid({ projects: others, featuredSlugs: [] });
    expect(screen.queryByText("Pinned")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "All Projects 🛠️" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(12);
  });

  it("omits the page number when the rest fits on one page", () => {
    const weird = project("weird", { title: "Weird", category: "experiment" as Project["category"] });
    renderGrid({ projects: [weird, ...others.slice(0, 3)], featuredSlugs: ["weird"] });
    expect(screen.getByText("3 projects")).toBeInTheDocument();
    // Featured rows fall back to the raw category key too
    expect(within(card("Weird")).getByText("experiment")).toHaveClass("text-horchata-700");
  });

  it("filters by category tab", async () => {
    const user = renderGrid();
    await user.click(screen.getByRole("button", { name: "Hackathon" }));
    expect(screen.getByRole("button", { name: "Hackathon" })).toHaveClass("bg-navy-900");
    expect(screen.queryByText("Pinned")).not.toBeInTheDocument();
    expect(screen.getByText("1 project")).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.getAttribute("aria-label"))).toEqual(["Hack Day"]);

    await user.click(screen.getByRole("button", { name: "Side Project" }));
    expect(screen.getByText("11 projects")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Pinned")).toBeInTheDocument();
  });

  it("paginates filtered results and resets the page when filters change", async () => {
    const many = Array.from({ length: 14 }, (_, i) =>
      project(`gh-${i + 1}`, { title: `Repo ${i + 1}`, github: `https://github.com/x/${i}` })
    );
    const user = renderGrid({ projects: many, featuredSlugs: [] });
    const github = screen.getByRole("button", { name: "GitHub Repos" });
    await user.click(github);
    expect(github).toHaveClass("bg-navy-900");
    expect(screen.getByText("14 projects · page 1 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("14 projects · page 2 of 2")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Side Project" }));
    expect(screen.getByText("14 projects · page 1 of 2")).toBeInTheDocument();

    await user.click(github);
    await user.click(screen.getByRole("button", { name: "All" }));
    // Back to the unfiltered grid
    expect(github).not.toHaveClass("bg-navy-900");
    expect(screen.queryByText(/14 projects/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(12);
  });

  it("combines the GitHub toggle with category tabs and reports when nothing matches", async () => {
    const user = renderGrid();
    await user.click(screen.getByRole("button", { name: "GitHub Repos" }));
    expect(screen.getByText("2 projects")).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.getAttribute("aria-label"))).toEqual(["Featured A", "Work Thing"]);

    await user.click(screen.getByRole("button", { name: "Podcast" }));
    expect(screen.getByText("No projects match the current filters.")).toBeInTheDocument();
  });

  it("starts filtered by an initial skill that can be cleared", async () => {
    const user = renderGrid({ initialSkill: "react" });
    const chip = screen.getByRole("button", { name: "react" });
    expect(screen.getByText("2 projects")).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.getAttribute("aria-label"))).toEqual(["Hack Day", "Work Thing"]);

    await user.click(screen.getByRole("button", { name: "GitHub Repos" }));
    expect(screen.getByText("1 project")).toBeInTheDocument();

    await user.click(chip);
    expect(screen.queryByRole("button", { name: "react" })).not.toBeInTheDocument();
    expect(screen.getByText("2 projects")).toBeInTheDocument();
  });
});
