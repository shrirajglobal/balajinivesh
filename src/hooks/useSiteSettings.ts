import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  is_public: boolean;
}

/** Fetches all public site settings as a key-value map. Cached for 5 minutes. */
export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("is_public", true);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((row) => {
        map[row.setting_key] = row.setting_value ?? "";
      });
      return { rows: data as SiteSetting[], map };
    },
  });
}
