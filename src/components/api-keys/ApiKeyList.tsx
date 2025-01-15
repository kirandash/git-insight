"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiKey } from "@/types/api-keys";
import { Check, Copy, Edit2, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

type ApiKeyListProps = {
  apiKeys: ApiKey[];
  loading: boolean;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
};

export function ApiKeyList({
  apiKeys,
  loading,
  onEdit,
  onDelete,
}: ApiKeyListProps) {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

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

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading API keys...
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No API keys found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {apiKeys.map((key) => (
        <div
          key={key.id}
          className="grid grid-cols-12 gap-4 p-4 text-sm items-center"
        >
          <div className="col-span-3 md:col-span-2 truncate" title={key.name}>
            {key.name}
          </div>
          <div className="col-span-2 md:col-span-1 text-muted-foreground">
            {key.usage}
          </div>
          <div
            className="col-span-5 md:col-span-7 font-mono text-muted-foreground truncate"
            title={showKey[key.id] ? key.key : undefined}
          >
            {showKey[key.id]
              ? key.key
              : "•".repeat(Math.min(key.key.length, 32))}
          </div>
          <div className="col-span-2 flex justify-end gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleKeyVisibility(key.id)}
              className="h-8 w-8"
              title={showKey[key.id] ? "Hide API Key" : "Show API Key"}
            >
              {showKey[key.id] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showKey[key.id] ? "Hide" : "Show"} API Key
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopyKey(key.key)}
              className="h-8 w-8"
              title="Copy API Key"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(key)}
              className="h-8 w-8"
              title="Edit API Key"
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(key.id)}
              className="h-8 w-8"
              title="Delete API Key"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
