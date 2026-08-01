import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Globe, RefreshCw } from "lucide-react";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  is_public: boolean;
}

const AdminSiteSettings = () => {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin_site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("setting_key");
      if (error) throw error;
      return data as SiteSetting[];
    },
  });

  useEffect(() => {
    if (data) {
      const initial: Record<string, string> = {};
      data.forEach((row) => {
        initial[row.setting_key] = row.setting_value ?? "";
      });
      setDraft(initial);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async (changes: { id: string; value: string }[]) => {
      for (const c of changes) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: c.value })
          .eq("id", c.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_site_settings"] });
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Settings saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSave = () => {
    if (!data) return;
    const changes = data
      .filter((row) => (row.setting_value ?? "") !== (draft[row.setting_key] ?? ""))
      .map((row) => ({ id: row.id, value: draft[row.setting_key] ?? "" }));
    if (changes.length === 0) {
      toast.info("No changes to save");
      return;
    }
    save.mutate(changes);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Master ARN/AMFI details and contact info. These values are surfaced site-wide automatically.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" />
            Global Configuration
          </CardTitle>
          <CardDescription>Updates apply across the website footer, disclaimers, and contact pages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data ?? []).map((row) => (
            <div key={row.id} className="grid gap-2 md:grid-cols-[280px_1fr] md:items-start md:gap-4">
              <div>
                <Label htmlFor={`s-${row.setting_key}`} className="text-sm font-medium">
                  {row.setting_key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Label>
                {row.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.description}</p>
                )}
                {row.setting_key === "google_place_id" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    How to find it: search your business on Google Maps, click "Share" → "Embed a map" —
                    the Place ID is in the embed code. Or use Google's Place ID Finder tool.
                  </p>
                )}
              </div>
              <Input
                id={`s-${row.setting_key}`}
                value={draft[row.setting_key] ?? ""}
                onChange={(e) => setDraft({ ...draft, [row.setting_key]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const t = toast.loading("Fetching latest Google rating…");
                const { data: res, error } = await supabase.functions.invoke("refresh-google-reviews");
                toast.dismiss(t);
                if (error) return toast.error(error.message);
                const r = res as { rating?: string; review_count?: string };
                toast.success(`Updated: ${r.rating ?? "?"} ★ · ${r.review_count ?? "?"} reviews`);
                qc.invalidateQueries({ queryKey: ["admin_site_settings"] });
                qc.invalidateQueries({ queryKey: ["site_settings"] });
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Google rating
            </Button>
            <Button onClick={handleSave} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSiteSettings;
