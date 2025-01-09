"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Edit2, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit?: string;
  limitEnabled?: boolean;
};

export function ApiKeySection() {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [keyName, setKeyName] = useState("");
  const [usageLimit, setUsageLimit] = useState("1000");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "default-1",
      name: "default",
      key: "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",
      usage: 3,
      limit: "1000",
      limitEnabled: false,
    },
    {
      id: "default-2",
      name: "production",
      key: "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",
      usage: 0,
      limit: "1000",
      limitEnabled: true,
    },
  ]);

  const generateApiKey = () => {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const key = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `tvly-${key}`;
  };

  const handleEdit = (key: ApiKey) => {
    setEditingKey(key);
    setKeyName(key.name);
    setUsageLimit(key.limit || "1000");
    setLimitEnabled(key.limitEnabled || false);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    if (editingKey) {
      // Update existing key
      setApiKeys((prev) =>
        prev.map((key) =>
          key.id === editingKey.id
            ? {
                ...key,
                name: keyName,
                limit: usageLimit,
                limitEnabled,
              }
            : key
        )
      );
    } else {
      // Create new key
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        name: keyName,
        key: generateApiKey(),
        usage: 0,
        limit: usageLimit,
        limitEnabled,
      };
      setApiKeys((prev) => [...prev, newKey]);
    }

    // Reset form and close dialog
    setKeyName("");
    setUsageLimit("1000");
    setLimitEnabled(false);
    setEditingKey(null);
    setDialogOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    toast({
      className: "bg-[#15803d] text-white border-0",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" /> Copied API Key to clipboard
        </div>
      ),
      duration: 2000,
    });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">API Keys</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingKey ? "Edit API key" : "Create a new API key"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingKey
                        ? "Enter a new limit for the API key."
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
                        disabled={!!editingKey}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="limit"
                          checked={limitEnabled}
                          onCheckedChange={(checked) =>
                            setLimitEnabled(!!checked)
                          }
                        />
                        <Label htmlFor="limit">Limit monthly usage*</Label>
                      </div>
                      <Input
                        type="number"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        disabled={!limitEnabled}
                      />
                      <p className="text-sm text-muted-foreground">
                        *If the combined usage of all your keys exceeds your
                        plan&apos;s limit, all requests will be rejected.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditingKey(null);
                        setKeyName("");
                        setUsageLimit("1000");
                        setLimitEnabled(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingKey ? "Save" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          The key is used to authenticate your requests to the{" "}
          <Link href="#" className="text-primary hover:underline">
            Research API
          </Link>
          . To learn more, see the{" "}
          <Link href="#" className="text-primary hover:underline">
            documentation
          </Link>{" "}
          page.
        </div>

        <div className="rounded-lg">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">NAME</div>
            <div className="col-span-1">USAGE</div>
            <div className="col-span-7">KEY</div>
            <div className="col-span-2 text-right">OPTIONS</div>
          </div>
          <div className="border-t">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="grid grid-cols-12 gap-4 p-4 items-center"
              >
                <div className="col-span-2 font-medium">{apiKey.name}</div>
                <div className="col-span-1">{apiKey.usage}</div>
                <div className="col-span-7 font-mono">
                  {showKey[apiKey.id]
                    ? apiKey.key
                    : "•".repeat(apiKey.key.length)}
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKey[apiKey.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyKey(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(apiKey)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
