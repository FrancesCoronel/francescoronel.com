import { describe, expect, it } from "vitest";
import { pagefindUrlToRoute } from "./search-url";

describe("pagefindUrlToRoute", () => {
  it.each([
    ["/posts/foo.html", "/posts/foo"],
    ["/posts/foo.prerender-fallback.html", "/posts/foo"],
    ["/tags/mentoring.prerender-fallback.html", "/tags/mentoring"],
    ["/about/index.html", "/about"],
    ["about/index.html", "/about"],
    ["/index.html", "/"],
    ["/index.prerender-fallback.html", "/"],
    ["/posts/foo", "/posts/foo"],
    ["/posts/reindex.prerender-fallback.html", "/posts/reindex"],
  ])("%s -> %s", (input, expected) => {
    expect(pagefindUrlToRoute(input)).toBe(expected);
  });
});
