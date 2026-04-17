import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Phone, Inbox, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact form", gift_claim: "Gift claim", partner_application: "Partner",
  risk_profiler: "Risk profile", newsletter: "Newsletter", health_check: "Health check", sip_goal: "Goal planner",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-brand-blue/10 text-brand-blue border-brand-blue/30",
  contacted: "bg-amber-100 text-amber-800 border-amber-300",
  qualified: "bg-violet-100 text-violet-800 border-violet-300",
  converted: "bg-brand-green/10 text-brand-green border-brand-green/30",
  closed: "bg-muted text-muted-foreground border-border",
};

const AdminCRM = () => {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("new");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["lead_inbox", statusFilter, sourceFilter],
    queryFn: async () => {
      let q = supabase.from("lead_inbox").select("*").order("created_at", { ascending: false }).limit(200);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      if (sourceFilter !== "all") q = q.eq("source", sourceFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, any> }) => {
      const { error } = await supabase.from("lead_inbox").update(patch as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["lead_inbox"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2"><Inbox className="h-6 w-6" /> CRM Inbox</h1>
        <p className="text-sm text-muted-foreground">All leads from contact form, gift claims, partner applications, and newsletter signups in one place.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-semibold text-muted-foreground">Status</span></div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            {["new", "contacted", "qualified", "converted", "closed", "all"].map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Source</span>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {Object.entries(SOURCE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      <div className="space-y-2">
        {(leads ?? []).map((lead: any) => (
          <Card key={lead.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                <Badge variant="outline" className={STATUS_COLORS[lead.status]}>{lead.status}</Badge>
                <Badge variant="outline" className="text-xs">{SOURCE_LABELS[lead.source] ?? lead.source}</Badge>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                <div className="ml-auto flex items-center gap-2">
                  <Select value={lead.status} onValueChange={(v) => update.mutate({ id: lead.id, patch: { status: v } })}>
                    <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{["new", "contacted", "qualified", "converted", "closed"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <div><div className="text-xs text-muted-foreground">Name</div><div className="font-medium text-sm">{lead.name ?? "—"}</div></div>
                <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span className="truncate text-sm">{lead.email ?? "—"}</span></div>
                <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-sm">{lead.phone ?? "—"}</span></div>
              </div>
              {lead.payload && Object.keys(lead.payload).length > 0 && (
                <details className="mt-2"><summary className="cursor-pointer text-xs text-muted-foreground">Payload</summary>
                  <pre className="mt-1 max-h-40 overflow-auto rounded bg-muted/50 p-2 text-[11px]">{JSON.stringify(lead.payload, null, 2)}</pre>
                </details>
              )}
              <div className="mt-3 border-t border-border pt-2">
                {openId === lead.id ? (
                  <div className="space-y-2">
                    <Textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={2} placeholder="Add a note…" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { update.mutate({ id: lead.id, patch: { notes: noteDraft } }); setOpenId(null); setNoteDraft(""); }}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setOpenId(null); setNoteDraft(""); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    {lead.notes ? <p className="text-sm text-foreground">{lead.notes}</p> : <p className="text-xs text-muted-foreground italic">No notes yet</p>}
                    <Button size="sm" variant="ghost" onClick={() => { setOpenId(lead.id); setNoteDraft(lead.notes ?? ""); }}>{lead.notes ? "Edit" : "Add"} note</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && !leads?.length && <p className="py-10 text-center text-sm text-muted-foreground">No leads match these filters.</p>}
      </div>
    </div>
  );
};

export default AdminCRM;
