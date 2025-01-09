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

type FormData = {
  name: string;
  key: string;
  id?: string;
};

export function ApiKeyDashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);

  const handleSubmit = (data: FormData) => {
    if (editingKey) {
      // Update existing key
      if (!data.id) return;
      setApiKeys(
        apiKeys.map((key) =>
          key.id === data.id ? { ...key, name: data.name, key: data.key } : key
        )
      );
      setEditingKey(null);
    } else {
      // Create new key
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        name: data.name,
        key: data.key,
      };
      setApiKeys([...apiKeys, newKey]);
    }
  };

  const handleDeleteKey = (id: string) => {
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
