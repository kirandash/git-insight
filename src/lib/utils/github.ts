// Add interfaces
export type RepoStats = {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  lastUpdate: string;
  defaultBranch: string;
  language: string;
  topics: string[];
  size: number;
  hasWiki: boolean;
  isArchived: boolean;
  createdAt: string;
  homepage: string | null;
  license: {
    key: string;
    name: string;
    spdxId: string;
    url: string;
  } | null;
};

export type GitHubContributor = {
  login: string;
  contributions: number;
  html_url: string;
  avatar_url: string;
};

export const parseGitHubUrl = (url: string) => {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const matches = url.match(regex);
    if (!matches) throw new Error("Invalid GitHub URL format");
    return {
      owner: matches[1],
      repo: matches[2].replace(".git", ""),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Invalid GitHub URL format");
  }
};

export async function fetchReadmeContent(owner: string, repo: string) {
  try {
    const readmeVariants = [
      "README.md",
      "README.mdx",
      "readme.md",
      "readme.mdx",
    ];

    for (const variant of readmeVariants) {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${variant}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
          },
        }
      );

      if (response.ok) {
        return await response.text();
      }
    }

    throw new Error("README not found");
  } catch (error) {
    throw new Error(`Failed to fetch README: ${error}`);
  }
}

export async function fetchRepoStats(
  owner: string,
  repo: string
): Promise<RepoStats> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository stats");
  }

  const data = await response.json();

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.subscribers_count,
    openIssues: data.open_issues_count,
    lastUpdate: data.updated_at,
    defaultBranch: data.default_branch,
    language: data.language,
    topics: data.topics || [],
    size: data.size,
    hasWiki: data.has_wiki,
    isArchived: data.archived,
    createdAt: data.created_at,
    homepage: data.homepage,
    license: data.license
      ? {
          key: data.license.key,
          name: data.license.name,
          spdxId: data.license.spdx_id,
          url: data.license.url,
        }
      : null,
  };
}

export async function fetchContributorsStats(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contributors stats");
  }

  const contributors = await response.json();
  return contributors.map((contributor: GitHubContributor) => ({
    username: contributor.login,
    contributions: contributor.contributions,
    profileUrl: contributor.html_url,
    avatarUrl: contributor.avatar_url,
  }));
}

export async function fetchLatestRelease(owner: string, repo: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const release = await response.json();
    return {
      tagName: release.tag_name,
      name: release.name,
      publishedAt: release.published_at,
      url: release.html_url,
    };
  } catch {
    return null;
  }
}
