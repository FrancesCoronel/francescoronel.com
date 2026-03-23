export interface RepoData {
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  topics: string[];
  pushedAt: string | null;
}

async function fetchRepo(repo: string): Promise<RepoData | null> {
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
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
      language: data.language ?? null,
      topics: Array.isArray(data.topics) ? data.topics : [],
      pushedAt: data.pushed_at ?? null,
    };
  } catch {
    return null;
  }
}

export async function getRepoStars(repo: string): Promise<number | null> {
  const data = await fetchRepo(repo);
  return data ? data.stars : null;
}

export async function getRepoData(repo: string): Promise<RepoData | null> {
  return fetchRepo(repo);
}

export async function getMultipleRepoStars(
  repos: Record<string, string>
): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    Object.entries(repos).map(async ([slug, repo]) => [slug, await getRepoStars(repo)])
  );
  return Object.fromEntries(entries);
}
