import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// GET single API key
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser();

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch API key:", error);
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// PATCH update API key
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser();
    const keyData = await request.json();

    // First verify the API key belongs to the user
    const { data: existingKey } = await supabase
      .from("api_keys")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("api_keys")
      .update(keyData)
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

// DELETE API key
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUser();

    // First verify the API key belongs to the user
    const { data: existingKey } = await supabase
      .from("api_keys")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
