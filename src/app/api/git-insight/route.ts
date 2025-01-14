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
    // First try to fetch the README.md
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          // Add GitHub token if you have rate limiting issues
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      // If README.md doesn't exist, try README.mdx
      const mdxResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/README.mdx`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      if (!mdxResponse.ok) {
        throw new Error("README not found");
      }

      return await mdxResponse.text();
    }

    return await response.text();
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

    // 2. Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select()
      .eq("key", apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
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

    // 6. Return the README content
    return NextResponse.json({
      repository: {
        owner,
        repo,
        url: githubUrl,
      },
      readme: readmeContent,
      summary: "Repository analysis pending implementation",
      cool_facts: ["Feature coming soon"],
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
