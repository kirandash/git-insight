"use client";

import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-muted-foreground">
        Have any questions, feedback or need support? We&apos;d love to hear
        from you!
      </p>
      <Button variant="outline">Contact us</Button>
    </div>
  );
}
