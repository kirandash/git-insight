import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { supabase } from "@/lib/supabaseClient";
import { generateApiKey } from "@/lib/utils/generateApiKey";
import { NextResponse } from "next/server";

// GET all API keys for the authenticated user
export async function GET() {
  try {
    const userId = await getCurrentUser();

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST create new API key
export async function POST(request: Request) {
  try {
    const userId = await getCurrentUser();
    const keyData = await request.json();

    const apiKey = generateApiKey();

    const { data, error } = await supabase
      .from("api_keys")
      .insert({ ...keyData, key: apiKey, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to create API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}
