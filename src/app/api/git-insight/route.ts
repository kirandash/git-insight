import { createReadmeAnalysisChain } from "@/lib/chains/readmeAnalysisChain";
import {
  incrementApiKeyUsage,
  validateApiKeyAndRateLimit,
} from "@/lib/utils/apiKeyValidation";
import { NextResponse } from "next/server";

// Add interface for repository stats
type RepoStats = {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  lastUpdate: string;
  defaultBranch: string;
  language: string;
  topics: string[];
  license?: string;
  size: number;
  hasWiki: boolean;
  isArchived: boolean;
  createdAt: string;
};

// Helper function to parse GitHub URL
const parseGitHubUrl = (url: string) => {
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

// Helper function to fetch README content
async function fetchReadmeContent(owner: string, repo: string) {
  try {
    // Array of possible README file names to try
    const readmeVariants = [
      "README.md",
      "README.mdx",
      "readme.md",
      "readme.mdx",
    ];

    // Try each variant until we find one that works
    for (const variant of readmeVariants) {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${variant}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            // Add GitHub token if you have rate limiting issues
            // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
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

// Helper function to fetch repository stats
async function fetchRepoStats(owner: string, repo: string): Promise<RepoStats> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add GitHub token if you have rate limiting issues
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
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
    license: data.license?.name,
    size: data.size,
    hasWiki: data.has_wiki,
    isArchived: data.archived,
    createdAt: data.created_at,
  };
}

// Helper function to fetch contributors stats
async function fetchContributorsStats(owner: string, repo: string) {
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
  return contributors.map((contributor: any) => ({
    username: contributor.login,
    contributions: contributor.contributions,
    profileUrl: contributor.html_url,
    avatarUrl: contributor.avatar_url,
  }));
}

// Helper function to fetch release information
async function fetchLatestRelease(owner: string, repo: string) {
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

export async function POST(request: Request) {
  try {
    // 1. Validate API key and check rate limit
    const apiKey = request.headers.get("x-api-key") ?? "";
    const { isValid, error, keyData } = await validateApiKeyAndRateLimit(
      apiKey
    );

    if (!isValid) {
      return error;
    }

    // 2. Increment usage counter
    const { success, error: incrementError } = await incrementApiKeyUsage(
      keyData!
    );
    if (!success) {
      return incrementError;
    }

    // 3. Process the request and fetch GitHub data
    const { githubUrl } = await request.json();
    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    // 4. Parse GitHub URL and fetch README
    const { owner, repo } = parseGitHubUrl(githubUrl);

    // Fetch all data in parallel
    const [readmeContent, repoStats, contributors, latestRelease] =
      await Promise.all([
        fetchReadmeContent(owner, repo),
        fetchRepoStats(owner, repo),
        fetchContributorsStats(owner, repo),
        fetchLatestRelease(owner, repo),
      ]);

    // Analyze README using LangChain
    const chain = createReadmeAnalysisChain();
    const analysis = await chain.invoke({
      readmeContent,
    });

    // Return enriched response
    return NextResponse.json({
      repository: {
        owner,
        repo,
        url: githubUrl,
        stats: repoStats,
        contributors,
        latestRelease,
      },
      ...analysis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
