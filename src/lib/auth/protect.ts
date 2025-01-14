import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function protectRoute() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return session;
}
