import { ApiKeyDashboard } from "./ApiKeyDashboard";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">API Key Management</h1>
      <ApiKeyDashboard />
    </div>
  );
}
