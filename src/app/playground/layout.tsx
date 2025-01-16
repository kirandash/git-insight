import { PlaygroundLayoutClient } from "@/app/playground/PlaygroundLayoutClient";
import { auth } from "@/auth";

export default async function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <PlaygroundLayoutClient session={session}>
      {children}
    </PlaygroundLayoutClient>
  );
}
