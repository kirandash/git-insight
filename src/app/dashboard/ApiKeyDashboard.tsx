"use client";

import { ApiKeySection } from "@/app/dashboard/ApiKeySection";
import { ContactSection } from "@/app/dashboard/ContactSection";
import { EmailAlerts } from "@/app/dashboard/EmailAlerts";
import { UsageStats } from "./UsageStats";

export function ApiKeyDashboard() {
  return (
    <div className="space-y-6">
      <UsageStats />
      <ApiKeySection />
      <EmailAlerts />
      <ContactSection />
    </div>
  );
}
