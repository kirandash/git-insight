"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FeedbackSection() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Have any questions, feedback or need support? We&apos;d love to hear
            from you!
          </p>
          <Button variant="outline">Contact us</Button>
        </div>
      </CardContent>
    </Card>
  );
}
