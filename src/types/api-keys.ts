export type ApiKey = {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit?: number;
  limit_enabled?: boolean;
  created_at?: string;
};
