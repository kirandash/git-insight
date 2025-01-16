import { createReadmeAnalysisChain } from "@/lib/chains/readmeAnalysisChain";
import {
  incrementApiKeyUsage,
  validateApiKeyAndRateLimit,
} from "@/lib/utils/apiKeyValidation";
import {
  fetchContributorsStats,
  fetchLatestRelease,
  fetchReadmeContent,
  fetchRepoStats,
  parseGitHubUrl,
} from "@/lib/utils/github";
import { NextResponse } from "next/server";

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

    // 4. Parse GitHub URL and fetch data
    const { owner, repo } = parseGitHubUrl(githubUrl);

    const [readmeContent, repoStats, contributors, latestRelease] =
      await Promise.all([
        fetchReadmeContent(owner, repo),
        fetchRepoStats(owner, repo),
        fetchContributorsStats(owner, repo),
        fetchLatestRelease(owner, repo),
      ]);

    // 5. Analyze README using LangChain
    const chain = createReadmeAnalysisChain();
    const analysis = await chain.invoke({
      readmeContent,
    });

    // 6. Return enriched response
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
