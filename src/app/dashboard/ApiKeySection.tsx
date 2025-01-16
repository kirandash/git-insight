"use client";

import { ApiKeyForm } from "@/components/api-keys/ApiKeyForm";
import { ApiKeyList } from "@/components/api-keys/ApiKeyList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useApiKeys } from "@/hooks/use-api-keys";
import { ApiKey } from "@/types/api-keys";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ApiKeySection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const {
    apiKeys,
    loading,
    loadApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  useEffect(() => {
    loadApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (formData: {
    name: string;
    usageLimit: string;
    limitEnabled: boolean;
  }) => {
    if (editingKey) {
      await updateApiKey(editingKey.id, {
        name: formData.name,
        limit: parseInt(formData.usageLimit),
        limit_enabled: formData.limitEnabled,
      });
    } else {
      await createApiKey({
        name: formData.name,
        usage: 0,
        limit: parseInt(formData.usageLimit),
        limit_enabled: formData.limitEnabled,
      });
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingKey(null);
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
                <ApiKeyForm
                  editingKey={editingKey}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseDialog}
                />
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

        <div className="rounded-lg overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-3 md:col-span-2">NAME</div>
              <div className="col-span-2 md:col-span-1">USAGE</div>
              <div className="col-span-2 md:col-span-1">LIMIT</div>
              <div className="col-span-3 md:col-span-6">KEY</div>
              <div className="col-span-2 text-right">OPTIONS</div>
            </div>
            <div className="border-t">
              <ApiKeyList
                apiKeys={apiKeys}
                loading={loading}
                onEdit={(key) => {
                  setEditingKey(key);
                  setDialogOpen(true);
                }}
                onDelete={deleteApiKey}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
