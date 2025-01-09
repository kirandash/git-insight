"use client";

import { useEffect, useState } from "react";

type ApiKeyFormProps = {
  onSubmit: (data: { name: string; key: string; id?: string }) => void;
  initialData?: { id: string; name: string; key: string } | null;
};

export function ApiKeyForm({
  onSubmit,
  initialData,
}: Readonly<ApiKeyFormProps>) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setKey(initialData.key);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      key,
      ...(initialData && { id: initialData.id }),
    });
    setName("");
    setKey("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          API Key Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="key" className="block text-sm font-medium mb-1">
          API Key
        </label>
        <input
          type="text"
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
      >
        {initialData ? "Update Key" : "Create Key"}
      </button>
    </form>
  );
}
