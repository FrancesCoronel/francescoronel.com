// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { OrgGridClient } from "./org-grid-client";

afterEach(cleanup);

const org = (name: string, totalRefs: number) => ({
  name,
  slug: name.toLowerCase(),
  logo: `/images/organizations/${name.toLowerCase()}.png`,
  url: `https://${name.toLowerCase()}.com`,
  totalRefs,
});

describe("OrgGridClient", () => {
  it("shows an empty state", () => {
    render(<OrgGridClient organizations={[]} />);
    expect(screen.getByText("0 organizations")).toBeInTheDocument();
    expect(screen.getByText("No organizations found.")).toBeInTheDocument();
  });

  it("uses singular wording for one organization and one reference", () => {
    render(<OrgGridClient organizations={[org("Slack", 1)]} />);
    expect(screen.getByText("1 organization")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/organizations/slack");
    expect(screen.getByText("1 reference")).toBeInTheDocument();
  });

  it("pluralises and hides zero reference counts", () => {
    render(<OrgGridClient organizations={[org("Slack", 3), org("Cornell", 0)]} />);
    expect(screen.getByText("2 organizations")).toBeInTheDocument();
    expect(screen.getByText("3 references")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cornell/ })).not.toHaveTextContent("reference");
  });
});
