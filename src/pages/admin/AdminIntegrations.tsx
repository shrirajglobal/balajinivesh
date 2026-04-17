import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plug, CheckCircle2, XCircle, Loader2, Settings2, Key, Sparkles, TrendingUp, Mail, MessageSquare, BarChart3 } from "lucide-react";

interface IntegrationRow {
  id: string;
  category: string;
  provider_key: string;
  display_name: string;
  enabled: boolean;
  is_default: boolean;
  config: Record<string, any>;
  secret_names: string[];
  last_test_status: string | null;
  last_test_at: string | null;
  last_test_message: string | null;
}

const CATEGORY_META: Record<string, { label: string; icon: typeof Plug; description: string }> = {
  ai_provider: { label: "AI Providers", icon: Sparkles, description: "Models that power blog drafts, market summaries, the chatbot, and the academy" },
  market_data: { label: "Market Data", icon: TrendingUp, description: "Sources for daily Sensex, Nifty, gold, currency feeds" },
  email: { label: "Email", icon: Mail, description: "Newsletters, gift-claim notifications, and admin alerts" },
  whatsapp: { label: "WhatsApp", icon: MessageSquare, description: "Lead alerts, market updates broadcast, share tracking" },
  analytics: { label: "Analytics", icon: BarChart3, description: "Track traffic, conversions, and SEO performance" },
};

const AdminIntegrations = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<IntegrationRow | null>(null);
  const [draftConfig, setDraftConfig] = useState<Record<string, string>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["integration_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integration_settings")
        .select("*")
        .order("category", { ascending: true })
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data as IntegrationRow[];
    },
  });

  const toggleEnabled = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("integration_settings")
        .update({ enabled })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integration_settings"] });
      toast.success("Integration updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveConfig = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: Record<string, any> }) => {
      const { error } = await supabase
        .from("integration_settings")
        .update({ config })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integration_settings"] });
      toast.success("Configuration saved");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const testConnection = async (row: IntegrationRow) => {
    setTestingId(row.id);
    try {
      const { data: res, error } = await supabase.functions.invoke("test-integration", {
        body: { provider_key: row.provider_key, category: row.category },
      });
      if (error) throw error;
      const ok = res?.success === true;
      await supabase
        .from("integration_settings")
        .update({
          last_test_status: ok ? "success" : "failed",
          last_test_at: new Date().toISOString(),
          last_test_message: res?.message ?? null,
        })
        .eq("id", row.id);
      qc.invalidateQueries({ queryKey: ["integration_settings"] });
      ok ? toast.success(`${row.display_name}: ${res?.message ?? "Connection OK"}`) : toast.error(`${row.display_name}: ${res?.message ?? "Failed"}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Test failed";
      toast.error(msg);
    } finally {
      setTestingId(null);
    }
  };

  const openEdit = (row: IntegrationRow) => {
    setEditing(row);
    const cfg: Record<string, string> = {};
    Object.entries(row.config ?? {}).forEach(([k, v]) => {
      cfg[k] = typeof v === "string" ? v : JSON.stringify(v);
    });
    setDraftConfig(cfg);
  };

  const saveEdit = () => {
    if (!editing) return;
    const merged: Record<string, any> = { ...(editing.config ?? {}) };
    Object.entries(draftConfig).forEach(([k, v]) => {
      // try to preserve arrays / objects when value parses as JSON
      try {
        const parsed = JSON.parse(v);
        merged[k] = parsed;
      } catch {
        merged[k] = v;
      }
    });
    saveConfig.mutate({ id: editing.id, config: merged });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const grouped = (data ?? []).reduce<Record<string, IntegrationRow[]>>((acc, row) => {
    (acc[row.category] ||= []).push(row);
    return acc;
  }, {});

  const categoryKeys = Object.keys(CATEGORY_META).filter((k) => grouped[k]?.length);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-foreground">Integrations Hub</h1>
        <p className="text-sm text-muted-foreground">
          Central control for every external service the platform uses. Enable, configure, and test connections from one place — switching providers requires no code changes.
        </p>
      </div>

      <Tabs defaultValue={categoryKeys[0]} className="mt-6">
        <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
          {categoryKeys.map((key) => {
            const meta = CATEGORY_META[key];
            const Icon = meta.icon;
            const enabledCount = grouped[key].filter((r) => r.enabled).length;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="mr-2 h-4 w-4" />
                {meta.label}
                {enabledCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {enabledCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categoryKeys.map((key) => {
          const meta = CATEGORY_META[key];
          return (
            <TabsContent key={key} value={key} className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">{meta.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {grouped[key].map((row) => (
                  <Card key={row.id} className={row.enabled ? "border-primary/40" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Plug className="h-4 w-4" />
                            {row.display_name}
                            {row.is_default && <Badge variant="outline" className="text-xs">Default</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {row.provider_key}
                          </CardDescription>
                        </div>
                        <Switch
                          checked={row.enabled}
                          onCheckedChange={(v) => toggleEnabled.mutate({ id: row.id, enabled: v })}
                          aria-label={`Enable ${row.display_name}`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {row.secret_names.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                          <Key className="h-3 w-3" />
                          <span>Required secrets:</span>
                          {row.secret_names.map((s) => (
                            <code key={s} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                              {s}
                            </code>
                          ))}
                        </div>
                      )}

                      {row.last_test_status && (
                        <div className="flex items-center gap-2 text-xs">
                          {row.last_test_status === "success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                          )}
                          <span className="text-muted-foreground">
                            {row.last_test_status === "success" ? "Connected" : "Failed"} · {row.last_test_message ?? "—"}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                          <Settings2 className="mr-1.5 h-3.5 w-3.5" />
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testConnection(row)}
                          disabled={!row.enabled || testingId === row.id}
                        >
                          {testingId === row.id ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Plug className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.display_name} — Configuration</DialogTitle>
            <DialogDescription>
              Non-secret settings. Secret keys (API tokens) are stored separately via Lovable Cloud secrets.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {Object.keys(draftConfig).length === 0 && (
              <p className="text-sm text-muted-foreground">No configuration fields for this integration.</p>
            )}
            {Object.entries(draftConfig).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`cfg-${key}`} className="text-xs">{key}</Label>
                <Input
                  id={`cfg-${key}`}
                  value={value}
                  onChange={(e) => setDraftConfig({ ...draftConfig, [key]: e.target.value })}
                />
              </div>
            ))}
            {editing && editing.secret_names.length > 0 && (
              <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Secret keys</p>
                <p className="mt-1">
                  This integration needs the following backend secret(s): {editing.secret_names.map((s) => `"${s}"`).join(", ")}.
                  If they're not set, ask the build assistant to add them — they're stored securely and never exposed to the browser.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={saveConfig.isPending}>
              {saveConfig.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminIntegrations;
