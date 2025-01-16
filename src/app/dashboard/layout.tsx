import { DashboardLayoutClient } from "@/app/dashboard/DashboardLayoutClient";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <DashboardLayoutClient session={session}>{children}</DashboardLayoutClient>;
}
