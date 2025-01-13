import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { ApiKey } from "@/types/api-keys";
import { Check } from "lucide-react";
import { useState } from "react";

export const useApiKeys = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

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

  const createApiKey = async (keyData: Partial<ApiKey>) => {
    try {
      const { error } = await supabase.from("api_keys").insert(keyData);
      if (error) throw error;

      await loadApiKeys();
      showSuccessToast("created");
    } catch (error) {
      console.error("Failed to create API key:", error);
      showErrorToast("create");
    }
  };

  const updateApiKey = async (id: string, keyData: Partial<ApiKey>) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update(keyData)
        .eq("id", id);

      if (error) throw error;

      await loadApiKeys();
      showSuccessToast("updated");
    } catch (error) {
      console.error("Failed to update API key:", error);
      showErrorToast("update");
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;

      await loadApiKeys();
      showSuccessToast("deleted", true);
    } catch (error) {
      console.error("Failed to delete API key:", error);
      showErrorToast("delete");
    }
  };

  const showSuccessToast = (action: string, isDelete: boolean = false) => {
    toast({
      className: isDelete
        ? "bg-[#dc2626] text-white border-0"
        : "bg-[#15803d] text-white border-0",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          {`API key successfully ${action}`}
        </div>
      ),
    });
  };

  const showErrorToast = (action: string) => {
    toast({
      variant: "destructive",
      description: `Failed to ${action} API key`,
    });
  };

  return {
    apiKeys,
    loading,
    loadApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
};
