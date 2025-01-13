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
      <div className="p-4 text-center text-muted-foreground">
        Loading API keys...
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No API keys found. Create one to get started.
      </div>
    );
  }

  return (
    <>
      {apiKeys.map((apiKey) => (
        <div
          key={apiKey.id}
          className="grid grid-cols-12 gap-4 p-4 items-center"
        >
          <div className="col-span-2 font-medium">{apiKey.name}</div>
          <div className="col-span-1">{apiKey.usage}</div>
          <div className="col-span-7 font-mono">
            {showKey[apiKey.id] ? apiKey.key : "•".repeat(apiKey.key.length)}
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
            <Button variant="ghost" size="icon" onClick={() => onEdit(apiKey)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(apiKey.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
