import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        {session?.user?.image && (
          <div className="flex justify-center mb-4">
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Profile picture"}
              width={80}
              height={80}
              className="rounded-full border-2 border-primary"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl font-bold">Welcome {session?.user?.name}</h1>
        {session ? (
          <p className="text-muted-foreground">You are signed in!</p>
        ) : (
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        )}
      </div>

      {!session ? (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <Button asChild size="lg">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="outline" size="lg">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
