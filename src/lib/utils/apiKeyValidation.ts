import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export type ApiKeyData = {
  id: string;
  usage: number;
  limit: string;
  limit_enabled: boolean;
};

// Helper function to validate API key and check rate limits
export async function validateApiKeyAndRateLimit(apiKey: string): Promise<{
  isValid: boolean;
  error?: NextResponse;
  keyData?: ApiKeyData;
}> {
  if (!apiKey) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      ),
    };
  }

  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("id, usage, limit, limit_enabled")
    .eq("key", apiKey)
    .single();

  if (keyError || !keyData) {
    return {
      isValid: false,
      error: NextResponse.json({ error: "Invalid API key" }, { status: 401 }),
    };
  }

  // Check rate limit if enabled
  if (keyData.limit_enabled) {
    const limit = parseInt(keyData.limit);
    if (keyData.usage >= limit) {
      return {
        isValid: false,
        error: NextResponse.json(
          {
            error: "Rate limit exceeded",
            usage: keyData.usage,
            limit: limit,
          },
          { status: 429 }
        ),
      };
    }
  }

  return { isValid: true, keyData };
}

// Helper function to increment API key usage
export async function incrementApiKeyUsage(keyData: ApiKeyData): Promise<{
  success: boolean;
  error?: NextResponse;
}> {
  const { error: updateError } = await supabase
    .from("api_keys")
    .update({ usage: keyData.usage + 1 })
    .eq("id", keyData.id);

  if (updateError) {
    console.error("Failed to update usage count:", updateError);
    return {
      success: false,
      error: NextResponse.json(
        { error: "Failed to update usage count" },
        { status: 500 }
      ),
    };
  }

  return { success: true };
}
