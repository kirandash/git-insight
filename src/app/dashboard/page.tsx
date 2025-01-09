import { DashboardHeader } from "@/app/dashboard/DashboardHeader";
import { ApiKeyDashboard } from "./ApiKeyDashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-sm text-muted-foreground">Pages / Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm">Operational</span>
            </div>
          </div>
        </div>
        <ApiKeyDashboard />
      </main>
    </div>
  );
}
