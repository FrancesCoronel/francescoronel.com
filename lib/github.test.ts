import { describe, expect, it, vi } from "vitest";
import { getMultipleRepoStars, getRepoData, getRepoStars } from "./github";

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body } as Response;
}

describe("getRepoData", () => {
  it("maps the GitHub API response and sends the token when configured", async () => {
    vi.stubEnv("GITHUB_TOKEN", "secret-token");
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        stargazers_count: 42,
        forks_count: 7,
        open_issues_count: 3,
        language: "TypeScript",
        topics: ["react", "nextjs"],
        pushed_at: "2024-01-01T00:00:00Z",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getRepoData("owner/repo")).resolves.toEqual({
      stars: 42,
      forks: 7,
      openIssues: 3,
      language: "TypeScript",
      topics: ["react", "nextjs"],
      pushedAt: "2024-01-01T00:00:00Z",
    });
    expect(fetchMock).toHaveBeenCalledWith("https://api.github.com/repos/owner/repo", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "Bearer secret-token",
      },
      next: { revalidate: 3600 },
    });
  });

  it("fills defaults for missing fields and omits auth without a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ topics: "not-an-array" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getRepoData("owner/empty")).resolves.toEqual({
      stars: 0,
      forks: 0,
      openIssues: 0,
      language: null,
      topics: [],
      pushedAt: null,
    });
    expect(fetchMock.mock.calls[0][1].headers).toEqual({ Accept: "application/vnd.github.v3+json" });
  });

  it("returns null for non-OK responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, false)));
    await expect(getRepoData("owner/missing")).resolves.toBeNull();
  });

  it("returns null when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(getRepoData("owner/repo")).resolves.toBeNull();
  });
});

describe("getRepoStars", () => {
  it("returns the star count or null", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(jsonResponse({ stargazers_count: 5 })).mockResolvedValueOnce(jsonResponse({}, false)));
    await expect(getRepoStars("a/b")).resolves.toBe(5);
    await expect(getRepoStars("a/c")).resolves.toBeNull();
  });
});

describe("getMultipleRepoStars", () => {
  it("maps each slug to its repo's star count", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.endsWith("/good") ? jsonResponse({ stargazers_count: 10 }) : jsonResponse({}, false),
      ),
    );
    await expect(getMultipleRepoStars({ first: "o/good", second: "o/bad" })).resolves.toEqual({
      first: 10,
      second: null,
    });
  });
});
