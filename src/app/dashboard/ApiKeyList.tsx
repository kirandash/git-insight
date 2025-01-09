"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
};

type ApiKeyListProps = {
  apiKeys: ApiKey[];
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
};

export function ApiKeyList({
  apiKeys,
  onEdit,
  onDelete,
}: Readonly<ApiKeyListProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for accessing the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.length === 0 ? (
          <p className="text-muted-foreground">
            No API keys found. Create one above.
          </p>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardContent className="pt-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-mono mt-1">{key.key}</p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(key)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this API key? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(key.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
