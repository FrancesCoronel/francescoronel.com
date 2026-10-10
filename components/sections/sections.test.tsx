// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { getAwards, getExperiences, getOrganizations, getTestimonials } from "@/lib/content";
import { ActionCards } from "./action-cards";
import { AwardsSection } from "./awards-section";
import { BioSection } from "./bio-section";
import { ConnectCTA } from "./connect-cta";
import { CredentialsMarquee } from "./credentials-marquee";
import { Hero } from "./hero";
import { LanguagesSection } from "./languages-section";
import { MemojiSection } from "./memoji-section";
import { NewsletterCTA } from "./newsletter-cta";
import { OrganizationsPreview } from "./organizations-preview";
import { TestimonialsPreview } from "./testimonials-preview";
import { TimelineSection } from "./timeline-section";

afterEach(cleanup);

describe("ActionCards", () => {
  it("renders the six default cards linking to the main pages", () => {
    render(<ActionCards />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/about",
      "/mentoring",
      "/posts",
      "/speaking",
      "/work",
      "/contact",
    ]);
    expect(screen.getByText("Book a 1:1 session with me")).toBeInTheDocument();
  });

  it("renders custom cards", () => {
    render(
      <ActionCards
        cards={[{ label: "Uses", description: "My setup", href: "/uses", image: "/images/x.png" }]}
      />
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/uses");
    expect(screen.getByText("My setup")).toBeInTheDocument();
  });
});

describe("AwardsSection", () => {
  it("renders nothing without awards", () => {
    const { container } = render(<AwardsSection awards={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("links to blog posts, external URLs or award pages", () => {
    render(
      <AwardsSection
        awards={[
          { slug: "blogged", title: "Blogged Award", date: "2024-03-05", url: "https://x.org" },
          { slug: "external", title: "External Award", date: "2023-01-10", url: "https://award.org", organization: "Award Org" },
          { slug: "local", title: "Local Award", date: "2022-07-04" },
        ]}
        blogPostMap={{ blogged: "my-award-post" }}
      />
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Awards 🏆");

    const blogged = screen.getByRole("link", { name: /Blogged Award/ });
    expect(blogged).toHaveAttribute("href", "/posts/my-award-post");
    expect(blogged).not.toHaveAttribute("target");
    expect(blogged.querySelector("svg")).toBeNull();

    const external = screen.getByRole("link", { name: /External Award/ });
    expect(external).toHaveAttribute("href", "https://award.org");
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    expect(external.querySelector("svg")).not.toBeNull();
    expect(within(external).getByText("Award Org")).toBeInTheDocument();
    expect(within(external).getByText("January 10, 2023")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Local Award/ })).toHaveAttribute(
      "href",
      "/awards/local"
    );
  });

  it("renders real awards from content", () => {
    const awards = getAwards();
    render(<AwardsSection awards={awards} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(awards.length);
  });
});

describe("BioSection", () => {
  it("renders each variant and widens colSpan=2 cards", () => {
    render(
      <BioSection
        variants={[
          { label: "Short", content: <p>Short bio</p> },
          { label: "Long", content: <p>Long bio</p>, colSpan: 2 },
        ]}
      />
    );
    const short = screen.getByRole("heading", { name: "Short" }).parentElement!;
    const long = screen.getByRole("heading", { name: "Long" }).parentElement!;
    expect(short).not.toHaveClass("md:col-span-2");
    expect(long).toHaveClass("md:col-span-2");
    expect(within(long).getByText("Long bio")).toBeInTheDocument();
  });
});

describe("ConnectCTA", () => {
  it("renders the default variant with internal links and a LinkedIn follow link", () => {
    const { container } = render(<ConnectCTA />);
    expect(screen.getByRole("heading")).toHaveTextContent("Let’s Connect 👋🏽");
    expect(screen.getByRole("link", { name: /Get in Touch/ })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: /Get in Touch/ })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: /Book Mentoring/ })).toHaveAttribute(
      "href",
      "/mentoring"
    );
    expect(screen.getByRole("link", { name: "Follow on LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/francescoronel"
    );
    expect(container.querySelector("section")).toHaveClass("bg-horchata-50");
  });

  it("opens external primary links in a new tab and hides the extra LinkedIn link", () => {
    render(<ConnectCTA variant="mentoring" sectionClassName="custom-bg" />);
    const primary = screen.getByRole("link", { name: /Book a Session/ });
    expect(primary).toHaveAttribute("href", "https://cal.com/francescoronel/mentoring");
    expect(primary).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("link", { name: "Follow on LinkedIn" })).toBeNull();
    expect(document.querySelector("section")).toHaveClass("custom-bg");
  });

  it("opens external secondary links in a new tab", () => {
    render(<ConnectCTA variant="projects" />);
    const secondary = screen.getByRole("link", { name: /View on GitHub/ });
    expect(secondary).toHaveAttribute("href", "https://github.com/FrancesCoronel");
    expect(secondary).toHaveAttribute("target", "_blank");
  });

  it.each([
    ["speaking", "Want Me to Speak? 🎤"],
    ["follow", "Stay in the Loop ✍🏽"],
    ["hire", "Let’s Work Together 💼"],
    ["contact", "Let's Connect 📨"],
  ] as const)("renders the %s variant heading", (variant, heading) => {
    render(<ConnectCTA variant={variant} />);
    expect(screen.getByRole("heading")).toHaveTextContent(heading);
  });
});

describe("CredentialsMarquee", () => {
  it("renders the credential links twice for a seamless loop", () => {
    render(<CredentialsMarquee />);
    const slack = screen.getAllByRole("link", { name: "Senior Software Engineer @ Slack" });
    expect(slack).toHaveLength(2);
    expect(slack[0]).toHaveAttribute("href", "/experience/senior-software-engineer-messaging");
    expect(screen.getAllByRole("link")).toHaveLength(20);
  });
});

describe("Hero", () => {
  it("renders the heading, descriptors, photo and action cards", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hi, I'm Frances! 👋🏽");
    expect(screen.getByText(/Proud Peruvian-American/)).toBeInTheDocument();
    expect(screen.getByAltText("Frances Coronel")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(6);
  });
});

describe("LanguagesSection", () => {
  it("renders the default languages", () => {
    render(<LanguagesSection />);
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
  });

  it("renders custom languages", () => {
    render(<LanguagesSection languages={[{ flag: "🇫🇷", name: "French", level: "Basic" }]} />);
    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.queryByText("English")).toBeNull();
  });
});

describe("MemojiSection", () => {
  it("renders downloadable default memojis", () => {
    render(<MemojiSection />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(10);
    expect(links[0]).toHaveAttribute("href", "/images/assets/memoji-wave.png");
    expect(links[0]).toHaveAttribute("download");
    expect(links[0]).toHaveAttribute("title", "Download: Waving 👋🏽");
  });

  it("renders custom memojis", () => {
    render(<MemojiSection memojis={[{ src: "/m.png", alt: "Custom", mood: "Calm" }]} />);
    expect(screen.getByRole("link")).toHaveAttribute("title", "Download: Calm");
    expect(screen.getByAltText("Custom")).toBeInTheDocument();
  });
});

describe("NewsletterCTA", () => {
  it("renders the newsletter pitch and form", () => {
    render(<NewsletterCTA />);
    expect(screen.getByRole("heading")).toHaveTextContent("🦄 The Unicorn Engineer ✨");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("No spam. Unsubscribe anytime.")).toBeInTheDocument();
  });
});

describe("OrganizationsPreview", () => {
  it("renders nothing without organizations", () => {
    const { container } = render(<OrganizationsPreview organizations={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("links to each organization page", () => {
    const orgs = getOrganizations().slice(0, 3);
    render(<OrganizationsPreview organizations={orgs} />);
    expect(screen.getByRole("link", { name: "View all →" })).toHaveAttribute(
      "href",
      "/organizations"
    );
    for (const org of orgs) {
      expect(screen.getByRole("link", { name: org.name })).toHaveAttribute(
        "href",
        `/organizations/${org.slug}`
      );
    }
  });
});

describe("TestimonialsPreview", () => {
  it("renders nothing without testimonials", () => {
    const { container } = render(<TestimonialsPreview testimonials={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders testimonial cards with the default heading and background", () => {
    const testimonials = getTestimonials().slice(0, 3);
    const { container } = render(<TestimonialsPreview testimonials={testimonials} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("What People Say");
    expect(screen.getByRole("link", { name: "See all testimonials →" })).toHaveAttribute(
      "href",
      "/testimonials"
    );
    expect(
      container.querySelectorAll(`a[href^="/testimonials/"]`)
    ).toHaveLength(3);
    expect(container.querySelector("section")).toHaveClass("bg-horchata-100");
  });

  it("accepts a custom heading and section class", () => {
    const { container } = render(
      <TestimonialsPreview
        testimonials={getTestimonials().slice(0, 1)}
        heading="Kind Words"
        sectionClassName="bg-white"
      />
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Kind Words");
    expect(container.querySelector("section")).toHaveAttribute("class", "bg-white");
  });
});

describe("TimelineSection", () => {
  const items = getExperiences()
    .slice(0, 2)
    .map((e) => ({
      title: e.title,
      subtitle: e.company,
      logo: e.companyLogo,
      slug: e.slug,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description,
      linkPrefix: "/experience",
    }));

  it("renders nothing without items", () => {
    const { container } = render(
      <TimelineSection id="work" label="Career" heading="Experience" items={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a light section by default", () => {
    const { container } = render(
      <TimelineSection id="work" label="Career" heading="Experience 💼" items={items} />
    );
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "work");
    expect(section).not.toHaveClass("bg-horchata-100");
    expect(screen.getByText("Career")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Experience 💼");
    expect(screen.getByRole("link", { name: items[0].title })).toHaveAttribute(
      "href",
      `/experience/${items[0].slug}`
    );
  });

  it("renders a dark section when requested", () => {
    const { container } = render(
      <TimelineSection id="edu" label="School" heading="Education" items={items} dark />
    );
    expect(container.querySelector("section")).toHaveClass("bg-horchata-100");
  });
});
