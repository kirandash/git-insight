"use client";

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your API Keys</h2>
      {apiKeys.length === 0 ? (
        <p className="text-gray-500">No API keys found. Create one above.</p>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{key.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(key.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm font-mono mt-1">{key.key}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(key)}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(key.id)}
                  className="px-3 py-1 text-sm border rounded-md text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
