import { createReadmeAnalysisChain } from "@/lib/chains/readmeAnalysisChain";
import { supabase } from "@/lib/supabaseClient";
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
    // 1. Extract API key from headers
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    // 2. Validate API key and check rate limit
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("id, usage, limit, limit_enabled")
      .eq("key", apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Check rate limit if enabled
    if (keyData.limit_enabled) {
      const limit = parseInt(keyData.limit);
      if (keyData.usage >= limit) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            usage: keyData.usage,
            limit: limit,
          },
          { status: 429 }
        );
      }
    }

    // 3. Increment usage counter
    const { error: updateError } = await supabase
      .from("api_keys")
      .update({ usage: keyData.usage + 1 })
      .eq("id", keyData.id);

    if (updateError) {
      console.error("Failed to update usage count:", updateError);
      return NextResponse.json(
        { error: "Failed to update usage count" },
        { status: 500 }
      );
    }

    // 3. Extract and validate request body
    const { githubUrl } = await request.json();
    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    // 4. Parse GitHub URL
    const { owner, repo } = parseGitHubUrl(githubUrl);

    // 5. Fetch README content
    const readmeContent = await fetchReadmeContent(owner, repo);

    console.log(readmeContent);

    // 6. Analyze README using LangChain
    const chain = createReadmeAnalysisChain();
    const analysis = await chain.invoke({
      readmeContent,
    });

    // 7. Return the analysis
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
