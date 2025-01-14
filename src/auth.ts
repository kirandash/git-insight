import { supabase } from "@/lib/supabaseClient";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      console.log("user", user);
      if (!user.email) return false;

      try {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select()
          .eq("email", user.email)
          .single();

        // If user doesn't exist, create new user
        if (!existingUser) {
          const { error } = await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          });

          if (error) {
            console.error("Error creating user:", error);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
});
