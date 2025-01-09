"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";

export function ApiKeySection() {
  const [showKey, setShowKey] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Keys</CardTitle>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Key
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          The key is used to authenticate your requests to the Research API. To
          learn more, see the documentation page.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="text-sm font-medium">default</div>
              <div className="font-mono text-sm">
                {showKey
                  ? "tvly-************************"
                  : "••••••••••••••••••••••••••"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
