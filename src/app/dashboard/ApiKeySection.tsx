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
import { supabase } from "@/lib/supabaseClient";
import { Check, Copy, Edit2, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit?: number;
  limit_enabled?: boolean;
  created_at?: string;
};

export function ApiKeySection() {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [keyName, setKeyName] = useState("");
  const [usageLimit, setUsageLimit] = useState("1000");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error("Failed to load API keys:", error);
      toast({
        variant: "destructive",
        description: "Failed to load API keys",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const key = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `git-insight-${key}`;
  };

  const handleEdit = (key: ApiKey) => {
    setEditingKey(key);
    setKeyName(key.name);
    setUsageLimit(key.limit?.toString() || "1000");
    setLimitEnabled(key.limit_enabled || false);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      if (editingKey) {
        const { error } = await supabase
          .from("api_keys")
          .update({
            name: keyName,
            limit: parseInt(usageLimit),
            limit_enabled: limitEnabled,
          })
          .eq("id", editingKey.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("api_keys").insert({
          name: keyName,
          key: generateApiKey(),
          usage: 0,
          limit: parseInt(usageLimit),
          limit_enabled: limitEnabled,
        });

        if (error) throw error;
      }

      await loadApiKeys();

      setKeyName("");
      setUsageLimit("1000");
      setLimitEnabled(false);
      setEditingKey(null);
      setDialogOpen(false);

      toast({
        className: "bg-[#15803d] text-white border-0",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {`API key successfully ${editingKey ? "updated" : "created"}`}
          </div>
        ),
      });
    } catch (error) {
      console.error("API Key operation failed:", error);
      toast({
        variant: "destructive",
        description: `Failed to ${editingKey ? "update" : "create"} API key`,
      });
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);

      if (error) throw error;

      await loadApiKeys();
      toast({
        className: "bg-[#dc2626] text-white border-0",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" /> API key successfully deleted
          </div>
        ),
      });
    } catch (error) {
      console.error("Failed to delete API key:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete API key",
      });
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = async (key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(key);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = key;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          textArea.remove();
        } catch (err) {
          console.error("Failed to copy text:", err);
          throw err;
        }
      }

      toast({
        className: "bg-[#15803d] text-white border-0",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Copied API Key to clipboard
          </div>
        ),
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        variant: "destructive",
        description: "Failed to copy API key",
      });
    }
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
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading API keys...
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No API keys found. Create one to get started.
              </div>
            ) : (
              apiKeys.map((apiKey) => (
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
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
