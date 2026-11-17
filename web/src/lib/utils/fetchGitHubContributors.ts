export interface GitHubContributor {
  login: string;
  avatar_url: string;
  type: string;
}

const PAGE_SIZE = 100;

/**
 * Given a GitHub repository ("owner/name"), return its human contributors,
 * excluding bots, or an empty array if the request fails.
 *
 * @example
 * await fetchGitHubContributors("namesakefyi/namesake")
 * // [{ login: "...", avatar_url: "...", type: "User" }]
 */
export async function fetchGitHubContributors(
  repo: string,
  token?: string,
): Promise<GitHubContributor[]> {
  // GitHub rejects requests without a User-Agent, which workerd omits.
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": repo,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const contributors: GitHubContributor[] = [];

  try {
    for (let page = 1; ; page++) {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contributors?per_page=${PAGE_SIZE}&page=${page}`,
        { headers },
      );

      if (!response.ok) {
        return [];
      }

      const pageContributors: GitHubContributor[] = await response.json();
      contributors.push(...pageContributors);

      if (pageContributors.length < PAGE_SIZE) break;
    }
  } catch {
    return [];
  }

  return contributors.filter((contributor) => contributor.type !== "Bot");
}
