import { createReadmeAnalysisChain } from "@/lib/chains/readmeAnalysisChain";
import {
  incrementApiKeyUsage,
  validateApiKeyAndRateLimit,
} from "@/lib/utils/apiKeyValidation";
import { NextResponse } from "next/server";

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
    const readmeContent = await fetchReadmeContent(owner, repo);

    // 5. Analyze README using LangChain
    const chain = createReadmeAnalysisChain();
    const analysis = await chain.invoke({
      readmeContent,
    });

    // 6. Return the analysis results
    return NextResponse.json({
      repository: {
        owner,
        repo,
        url: githubUrl,
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
