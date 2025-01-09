"use client";

import { ApiKeyForm } from "@/app/dashboard/ApiKeyForm";
import { ApiKeyList } from "@/app/dashboard/ApiKeyList";
import { useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
};

const generateApiKey = () => {
  // Generate a random 32-character string
  const key = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sk_${key}`;
};

export function ApiKeyDashboard() {
  // TODO: Replace with API call - GET /api/keys
  // Initial fetch of API keys should happen here using useEffect
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);

  const handleSubmit = (data: { name: string; id?: string }) => {
    if (editingKey) {
      // Update existing key
      if (!data.id) return;
      setApiKeys(
        apiKeys.map((key) =>
          key.id === data.id ? { ...key, name: data.name } : key
        )
      );
      setEditingKey(null);
    } else {
      // Create new key with auto-generated API key
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        name: data.name,
        key: generateApiKey(),
      };
      setApiKeys([...apiKeys, newKey]);
    }
  };

  const handleDeleteKey = (id: string) => {
    // TODO: Replace with API call - DELETE /api/keys/:id
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  return (
    <div className="space-y-8">
      <ApiKeyForm onSubmit={handleSubmit} initialData={editingKey} />
      <ApiKeyList
        apiKeys={apiKeys}
        onEdit={setEditingKey}
        onDelete={handleDeleteKey}
      />
    </div>
  );
}
