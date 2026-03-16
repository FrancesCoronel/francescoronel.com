export async function getRepoStars(repo: string): Promise<number | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function getMultipleRepoStars(
  repos: Record<string, string>
): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    Object.entries(repos).map(async ([slug, repo]) => [slug, await getRepoStars(repo)])
  );
  return Object.fromEntries(entries);
}
