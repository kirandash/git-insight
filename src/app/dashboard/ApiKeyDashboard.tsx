"use client";

import { ApiKeySection } from "@/app/dashboard/ApiKeySection";
import { EmailAlerts } from "@/app/dashboard/EmailAlerts";
import { FeedbackSection } from "./FeedbackSection";
import { UsageStats } from "./UsageStats";

export function ApiKeyDashboard() {
  return (
    <div className="space-y-6">
      <UsageStats />
      <ApiKeySection />
      <EmailAlerts />
      <FeedbackSection />
    </div>
  );
}
