"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { useState } from "react";

export function EmailAlerts() {
  const [threshold, setThreshold] = useState("90");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email usage alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          An alert will be sent to your email when your monthly usage reaches
          the set threshold.
        </p>
        <div className="flex items-center gap-2">
          <span>Your alert threshold is currently set to:</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-16"
            />
            <span>%</span>
            <Button variant="outline" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">Enabled</span>
        </div>
      </CardContent>
    </Card>
  );
}
