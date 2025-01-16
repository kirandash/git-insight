import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button variant="ghost" className="w-full justify-start" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </form>
  );
}
