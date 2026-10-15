import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import OrganizationsPage, { metadata } from "./page";

describe("app/organizations/page", () => {
  it("exports metadata for the organizations index", () => {
    expect(metadata.title).toBe("Organizations");
    expect(metadata.alternates?.canonical).toBe("https://francescoronel.com/organizations");
  });

  it("lists organizations with references and hides ones without any", () => {
    const html = renderToStaticMarkup(<OrganizationsPage />);
    expect(html).toContain("Organizations 🏢");
    // Slack has posts, experience, testimonials and projects
    expect(html).toContain('href="/organizations/slack"');
    // Cornell Tech is matched via education and projects
    expect(html).toContain('href="/organizations/cornell-tech"');
    // Leland has no associated content at all
    expect(html).not.toContain('href="/organizations/leland"');
  });

  it("orders organizations by total references, most first", () => {
    const html = renderToStaticMarkup(<OrganizationsPage />);
    expect(html.indexOf('href="/organizations/slack"')).toBeLessThan(
      html.indexOf('href="/organizations/cornell-tech"'),
    );
  });
});
