"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiKey } from "@/types/api-keys";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type ApiKeyFormProps = {
  editingKey: ApiKey | null;
  onSubmit: (formData: {
    name: string;
    usageLimit: string;
    limitEnabled: boolean;
  }) => Promise<void>;
  onCancel: () => void;
};

export function ApiKeyForm({
  editingKey,
  onSubmit,
  onCancel,
}: ApiKeyFormProps) {
  const [keyName, setKeyName] = useState(editingKey?.name || "");
  const [usageLimit, setUsageLimit] = useState(
    editingKey?.limit?.toString() || "1000"
  );
  const [limitEnabled, setLimitEnabled] = useState(
    editingKey?.limit_enabled || false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: keyName, usageLimit, limitEnabled });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {editingKey ? "Edit API key" : "Create a new API key"}
        </DialogTitle>
        <DialogDescription>
          {editingKey
            ? "Edit the name or limit for the API key."
            : "Enter a name and limit for the new API key."}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Key Name — A unique name to identify this key
          </Label>
          <Input
            id="name"
            placeholder="Key Name"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="limit"
              checked={limitEnabled}
              onCheckedChange={(checked) => setLimitEnabled(!!checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="limit">Limit monthly usage*</Label>
          </div>
          <Input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            disabled={!limitEnabled || isSubmitting}
          />
          <p className="text-sm text-muted-foreground">
            *If the combined usage of all your keys exceeds your plan&apos;s
            limit, all requests will be rejected.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editingKey ? "Saving..." : "Creating..."}
            </>
          ) : editingKey ? (
            "Save"
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}
