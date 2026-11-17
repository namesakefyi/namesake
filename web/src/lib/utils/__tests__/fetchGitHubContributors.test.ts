import { describe, expect, it, vi } from "vitest";
import {
  fetchGitHubContributors,
  type GitHubContributor,
} from "../fetchGitHubContributors";

const REPO = "namesakefyi/namesake";

const createContributor = (
  login: string,
  type = "User",
): GitHubContributor => ({
  login,
  avatar_url: `https://avatars.githubusercontent.com/${login}`,
  type,
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("fetchGitHubContributors", () => {
  it("returns contributors, excluding bots", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse([
        createContributor("ky"),
        createContributor("renovate[bot]", "Bot"),
        createContributor("luke"),
      ]),
    );

    const result = await fetchGitHubContributors(REPO);

    expect(result.map((contributor) => contributor.login)).toEqual([
      "ky",
      "luke",
    ]);
  });

  it("requests every page until a partial page is returned", async () => {
    const fullPage = Array.from({ length: 100 }, (_, index) =>
      createContributor(`user-${index}`),
    );
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(jsonResponse(fullPage))
      .mockResolvedValueOnce(jsonResponse([createContributor("last")]));

    const result = await fetchGitHubContributors(REPO);

    expect(result).toHaveLength(101);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(vi.mocked(global.fetch).mock.calls[1][0]).toContain("page=2");
  });

  it("sends a User-Agent header, which the GitHub API requires", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(jsonResponse([]));

    await fetchGitHubContributors(REPO);

    expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
      headers: expect.objectContaining({ "User-Agent": REPO }),
    });
  });

  it("sends the token as a bearer authorization header when given", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(jsonResponse([]));

    await fetchGitHubContributors(REPO, "secret");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/repos/${REPO}/contributors`),
      {
        headers: expect.objectContaining({ Authorization: "Bearer secret" }),
      },
    );
  });

  it("returns an empty array when the response is not ok", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(null, { status: 403 }),
    );

    expect(await fetchGitHubContributors(REPO)).toEqual([]);
  });

  it("returns an empty array when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    expect(await fetchGitHubContributors(REPO)).toEqual([]);
  });
});
