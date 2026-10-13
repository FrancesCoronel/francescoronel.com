import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType, ReactNode } from "react";
import { mdxComponents } from "./mdx-components";

type AnyComponent = ComponentType<Record<string, unknown> & { children?: ReactNode }>;
const c = mdxComponents as unknown as Record<string, AnyComponent>;
const A = c.a;
const Img = c.img;
const P = c.p;

const html = (node: ReactNode) => renderToStaticMarkup(<>{node}</>);

describe("mdxComponents.img", () => {
  it("renders nothing without a string src", () => {
    expect(html(<Img alt="x" />)).toBe("");
    expect(html(<Img src={new Blob() as unknown as string} alt="x" />)).toBe("");
  });

  it("uses next/image for optimizable hosts and forwards extra props", () => {
    const out = html(
      <Img src="https://cdn.prod.website-files.com/a.png" alt="Cover" title="Caption" />
    );
    expect(out).toContain('aria-label="Zoom: Cover"');
    expect(out).toContain("/_next/image?url=https%3A%2F%2Fcdn.prod.website-files.com%2Fa.png");
    expect(out).toContain('title="Caption"');
    expect(out).toContain('class="rounded-lg"');
  });

  it("defaults alt text to empty for optimized images", () => {
    const out = html(<Img src="/images/assets/frances-slack.jpg" />);
    expect(out).toContain('aria-label="Zoom: "');
    expect(out).toContain('alt=""');
    expect(out).toContain("/_next/image?url=%2Fimages%2Fassets%2Ffrances-slack.jpg");
  });

  it("normalizes protocol-relative URLs and falls back to a plain lazy img", () => {
    const out = html(<Img src="//example.com/pic.gif" />);
    expect(out).toContain('src="https://example.com/pic.gif"');
    expect(out).toContain('loading="lazy"');
    expect(out).toContain('alt=""');
    expect(out).toContain('aria-label="Zoom: "');
    expect(out).not.toContain("_next/image");
  });

  it("is also exposed as the Image MDX component", () => {
    expect(mdxComponents.Image).toBe(mdxComponents.img);
  });
});

describe("mdxComponents.a", () => {
  it("renders a span when there is no href", () => {
    expect(html(<A id="x">text</A>)).toBe('<span id="x">text</span>');
  });

  it("renders internal links with next/link", () => {
    const out = html(<A href="/about">About me</A>);
    expect(out).toContain('href="/about"');
    expect(out).not.toContain("target");
    expect(out).toContain(">About me</a>");
  });

  it("opens labelled external links in a new tab and forwards props", () => {
    const out = html(
      <A href="https://example.com" title="Example">
        Example site
      </A>
    );
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('title="Example"');
    expect(out).toContain(">Example site</a>");
  });

  it("treats protocol-relative links as external", () => {
    expect(html(<A href="//example.com/x">x</A>)).toContain('target="_blank"');
  });

  it("turns a naked tweet link into a View on X link", () => {
    for (const href of [
      "https://twitter.com/frances/status/12345",
      "https://x.com/frances/status/999",
    ]) {
      const out = html(<A href={href}>{href}</A>);
      const id = href.split("/").pop();
      expect(out).toContain(`href="https://twitter.com/i/status/${id}"`);
      expect(out).toContain("View on X/Twitter ↗");
    }
  });

  it("embeds naked YouTube links", () => {
    const cases: [string, string][] = [
      ["https://www.youtube.com/watch?v=abc_123", "abc_123"],
      ["https://youtube.com/shorts/Short-1", "Short-1"],
      ["https://youtu.be/xyz", "xyz"],
    ];
    for (const [href, id] of cases) {
      const out = html(<A href={href}>{href}</A>);
      expect(out).toContain(`src="https://www.youtube.com/embed/${id}"`);
      expect(out).toContain("allowFullScreen");
    }
  });

  it("embeds naked Instagram links", () => {
    for (const kind of ["p", "reel", "tv"]) {
      const href = `https://www.instagram.com/${kind}/Ab-1/`;
      const out = html(<A href={href}>{href}</A>);
      expect(out).toContain('src="https://www.instagram.com/p/Ab-1/embed/"');
      expect(out).toContain('height="505"');
    }
  });

  it("wraps other naked links in a link preview with a plain-link fallback", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const href = "https://news.example.com/story";
    const out = html(<A href={href}>{href}</A>);
    expect(out).toContain('class="not-prose my-6 flex justify-center"');
    expect(out).toContain(`href="${href}"`);
    expect(out).toContain(`>${href}</a>`);
  });
});

describe("mdxComponents.p", () => {
  it("renders a div when the only child is a naked external link", () => {
    const href = "https://youtu.be/xyz";
    expect(html(<P className="c"><A href={href}>{href}</A></P>)).toMatch(/^<div class="c">/);
    // single-element array children are unwrapped too
    expect(html(<P>{[<A key="a" href={href}>{href}</A>]}</P>)).toMatch(/^<div>/);
    expect(html(<P><A href="//example.com">{"//example.com"}</A></P>)).toMatch(/^<div>/);
  });

  it("keeps a paragraph for everything else", () => {
    expect(html(<P><A href="https://example.com">labelled</A></P>)).toMatch(/^<p>/);
    expect(html(<P><A href="/local">{"/local"}</A></P>)).toMatch(/^<p>/);
    expect(html(<P><A>no href</A></P>)).toMatch(/^<p>/);
    expect(html(<P><em>hi</em></P>)).toBe("<p><em>hi</em></p>");
    expect(html(<P>plain text</P>)).toBe("<p>plain text</p>");
    expect(html(<P>{null}</P>)).toBe("<p></p>");
    expect(html(<P>{["a", "b"]}</P>)).toBe("<p>ab</p>");
  });
});

describe("other MDX components", () => {
  it("renders Tweet as a link to the status", () => {
    const Tweet = c.Tweet;
    expect(html(<Tweet id="42" />)).toContain('href="https://twitter.com/i/status/42"');
  });

  it("renders a LinkedIn embed with a fallback link", () => {
    const LinkedInEmbed = c.LinkedInEmbed;
    const out = html(<LinkedInEmbed shareId="777" url="https://linkedin.com/posts/x" />);
    expect(out).toContain('src="https://www.linkedin.com/embed/feed/update/urn:li:share:777"');
    expect(out).toContain('title="Embedded LinkedIn post"');
    expect(out).toContain('href="https://linkedin.com/posts/x"');
    expect(out).toContain("View on LinkedIn →");
  });

  it("styles Callout by type, defaulting to info", () => {
    const Callout = c.Callout;
    expect(html(<Callout>note</Callout>)).toContain("border-blue-400");
    expect(html(<Callout type="warning">careful</Callout>)).toContain("border-amber-400");
    expect(html(<Callout type="tip">hint</Callout>)).toContain("border-green-400");
    expect(html(<Callout>note</Callout>)).toContain(">note</div>");
  });

  it("renders styled headings h1-h4 and forwards props", () => {
    for (const tag of ["h1", "h2", "h3", "h4"]) {
      const H = c[tag];
      const out = html(<H id={`${tag}-id`}>Title</H>);
      expect(out).toMatch(new RegExp(`^<${tag} class="[^"]+" id="${tag}-id">Title</${tag}>$`));
    }
  });
});
