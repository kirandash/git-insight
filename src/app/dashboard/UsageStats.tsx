"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";

export function UsageStats() {
  return (
    <Card className="bg-gradient-to-r from-rose-100 via-purple-100 to-blue-100">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">CURRENT PLAN</span>
          <Button variant="outline" className="bg-white/80">
            Manage Plan
          </Button>
        </div>

        <h2 className="text-3xl font-semibold">Researcher</h2>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">API Limit</span>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <Progress value={30} className="h-2" />
          <span className="text-sm text-muted-foreground">
            3/1,000 Requests
          </span>
        </div>
      </div>
    </Card>
  );
}
