import { auth } from "@/auth";
import { supabase } from "@/lib/supabaseClient";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Get user_id from Supabase based on email
  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) {
    throw new Error("User not found");
  }

  return user.id;
}
