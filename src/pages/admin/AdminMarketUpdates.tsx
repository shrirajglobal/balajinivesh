import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, CheckCircle2, Eye, Calendar, Loader2, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { scanContentForCompliance } from "@/lib/complianceScanner";
import { toast } from "sonner";

interface MU {
  id: string;
  update_date: string;
  headline: string;
  summary: string;
  what_it_means: string | null;
  key_movers: string[];
  market_sentiment: string | null;
  status: string;
  ai_generated: boolean;
  published_at: string | null;
  sensex_close: number | null;
  nifty_close: number | null;
  meta_title: string | null;
  meta_description: string | null;
}

const statusBadge = (s: string) => {
  if (s === "published") return "bg-green-500/10 text-green-700 border-green-500/30";
  if (s === "approved") return "bg-blue-500/10 text-blue-700 border-blue-500/30";
  if (s === "draft") return "bg-amber-500/10 text-amber-700 border-amber-500/30";
  return "bg-muted text-muted-foreground";
};

const AdminMarketUpdates = () => {
  const [updates, setUpdates] = useState<MU[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState<MU | null>(null);
  const [automationMode, setAutomationMode] = useState("semi_auto");
  const [tab, setTab] = useState("draft");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("market_updates")
      .select("*")
      .order("update_date", { ascending: false })
      .limit(60);
    if (error) toast.error(error.message);
    setUpdates(((data as any) ?? []).map((d: any) => ({ ...d, key_movers: Array.isArray(d.key_movers) ? d.key_movers : [] })));

    const { data: setting } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "market_updates_automation_mode")
      .maybeSingle();
    if (setting?.setting_value) setAutomationMode(setting.setting_value);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const generateNow = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-market-update", { body: {} });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Generation failed");
      toast.success(data.skipped ? "Already generated for today" : `Draft created: ${data.headline}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setGenerating(false);
    }
  };

  const updateMode = async (mode: string) => {
    setAutomationMode(mode);
    const { error } = await supabase
      .from("site_settings")
      .update({ setting_value: mode })
      .eq("setting_key", "market_updates_automation_mode");
    if (error) toast.error(error.message);
    else toast.success(`Automation set to ${mode.replace("_", " ")}`);
  };

  const approve = async (mu: MU) => {
    const scan = scanContentForCompliance([mu.headline, mu.summary, mu.what_it_means ?? ""].join("\n"));
    if (!scan.passed) {
      toast.error(`Compliance check failed: ${scan.violations[0]?.matched}`);
      return;
    }
    const { error } = await supabase
      .from("market_updates")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
      })
      .eq("id", mu.id);
    if (error) toast.error(error.message);
    else { toast.success("Published"); load(); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("market_updates")
      .update({
        headline: editing.headline,
        summary: editing.summary,
        what_it_means: editing.what_it_means,
        key_movers: editing.key_movers,
        market_sentiment: editing.market_sentiment,
        meta_title: editing.meta_title,
        meta_description: editing.meta_description,
      })
      .eq("id", editing.id);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); load(); }
  };

  const filtered = updates.filter((u) =>
    tab === "all" ? true : tab === "published" ? u.status === "published" : u.status === "draft" || u.status === "approved",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Market Updates</h1>
          <p className="text-sm text-muted-foreground">Daily &quot;Samajhne Wali Khabar&quot; — fetched, summarised, and queued for review.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Mode</Label>
            <Select value={automationMode} onValueChange={updateMode}>
              <SelectTrigger className="h-8 w-36 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assisted">Assisted (manual)</SelectItem>
                <SelectItem value="semi_auto">Semi-Auto (review)</SelectItem>
                <SelectItem value="full_auto">Full Auto (publish)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generateNow} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Today&apos;s Update
          </Button>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="draft">Awaiting Review</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4 space-y-3">
              {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {!loading && filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No updates here yet.</p>
              )}
              {filtered.map((mu) => (
                <motion.div key={mu.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-border/60">
                    <CardContent className="flex flex-wrap items-start gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={statusBadge(mu.status)}>{mu.status}</Badge>
                          {mu.market_sentiment && (
                            <Badge variant="secondary" className="text-xs">{mu.market_sentiment}</Badge>
                          )}
                          {mu.ai_generated && <Badge variant="outline" className="text-xs">AI</Badge>}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(mu.update_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="mt-2 font-display text-base font-semibold text-foreground">{mu.headline}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{mu.summary}</p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditing(mu)}>
                          <Eye className="h-4 w-4" /> Review
                        </Button>
                        {mu.status !== "published" && (
                          <Button size="sm" onClick={() => approve(mu)}>
                            <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Market Update</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Headline</Label>
                <Input value={editing.headline} onChange={(e) => setEditing({ ...editing, headline: e.target.value })} />
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea rows={6} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
              </div>
              <div>
                <Label>What It Means</Label>
                <Textarea rows={5} value={editing.what_it_means ?? ""} onChange={(e) => setEditing({ ...editing, what_it_means: e.target.value })} />
              </div>
              <div>
                <Label>Key Movers (one per line)</Label>
                <Textarea
                  rows={4}
                  value={editing.key_movers.join("\n")}
                  onChange={(e) => setEditing({ ...editing, key_movers: e.target.value.split("\n").filter(Boolean) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Sentiment</Label>
                  <Select
                    value={editing.market_sentiment ?? "neutral"}
                    onValueChange={(v) => setEditing({ ...editing, market_sentiment: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["bullish", "bearish", "neutral", "cautious", "mixed"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Meta Title</Label>
                  <Input value={editing.meta_title ?? ""} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea rows={2} value={editing.meta_description ?? ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
                {editing.status !== "published" && (
                  <Button onClick={() => approve(editing)}>
                    <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMarketUpdates;
