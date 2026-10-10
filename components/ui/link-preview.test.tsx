// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LinkPreview } from "./link-preview";

afterEach(cleanup);

const URL_ = "https://www.example.com/article";

function mockHtml(html: string, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, text: () => Promise.resolve(html) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function renderPreview(url = URL_) {
  return render(await LinkPreview({ url }));
}

describe("LinkPreview", () => {
  it("renders a rich card from Open Graph tags and decodes entities", async () => {
    const fetchMock = mockHtml(`
      <html><head>
        <meta property="og:title" content="Tom &amp; Jerry &lt;3 &#039;cheese&#039;">
        <meta property="og:description" content="A &quot;classic&quot; &apos;cartoon&apos; &#65;">
        <meta property="og:image" content="https://img.example.com/og.png">
        <meta property="og:site_name" content="Example News">
      </head></html>`);
    const { container } = await renderPreview();

    expect(fetchMock).toHaveBeenCalledWith(
      URL_,
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "text/html,application/xhtml+xml" }),
      })
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", URL_);
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Tom & Jerry <3 'cheese'")).toBeInTheDocument();
    expect(screen.getByText(`A "classic" 'cartoon' A`)).toBeInTheDocument();
    expect(screen.getByText("Example News")).toBeInTheDocument();
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "https://img.example.com/og.png");
  });

  it("reads content-first meta tags and Twitter fallbacks", async () => {
    mockHtml(`
      <meta content="Tweet title" name="twitter:title">
      <meta content="Tweet description" name="twitter:description">
      <meta content="https://img.example.com/tw.png" name="twitter:image">`);
    const { container } = await renderPreview();
    expect(screen.getByText("Tweet title")).toBeInTheDocument();
    expect(screen.getByText("Tweet description")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "https://img.example.com/tw.png");
    // site name falls back to the hostname without www.
    expect(screen.getAllByText("example.com")).toHaveLength(2);
  });

  it("falls back to the <title> tag and the plain description meta", async () => {
    mockHtml(`<title>Plain Title</title><meta name="description" content="Plain description">`);
    const { container } = await renderPreview();
    expect(screen.getByText("Plain Title")).toBeInTheDocument();
    expect(screen.getByText("Plain description")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("omits the description when the page has none", async () => {
    mockHtml(`<title>Only Title</title>`);
    const { container } = await renderPreview();
    expect(screen.getByText("Only Title")).toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("falls back to a plain link when the page has no title", async () => {
    mockHtml(`<html><body>nothing here</body></html>`);
    await renderPreview();
    expect(screen.getByRole("link")).toHaveTextContent(URL_);
  });

  it("falls back to a plain link on HTTP errors", async () => {
    mockHtml("<title>Error page</title>", false);
    await renderPreview();
    expect(screen.getByRole("link")).toHaveTextContent(URL_);
    expect(screen.queryByText("Error page")).toBeNull();
  });

  it("falls back to a plain link when the fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    await renderPreview();
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent(URL_);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
