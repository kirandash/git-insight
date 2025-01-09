"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

type ApiKeyFormProps = {
  onSubmit: (data: { name: string }) => void;
  initialData?: { id: string; name: string; key: string } | null;
};

export function ApiKeyForm({
  onSubmit,
  initialData,
}: Readonly<ApiKeyFormProps>) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      ...(initialData && { id: initialData.id }),
    });
    setName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit API Key" : "Create New API Key"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">API Key Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter a name for your API key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit">
            {initialData ? "Update Key" : "Create Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
