import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Send, FileText, TrendingUp, Sparkles, Loader2, Users, Mail } from "lucide-react";
import { format } from "date-fns";

const AdminNewsletter = () => {
  const qc = useQueryClient();
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [sourceType, setSourceType] = useState<"market_update" | "blog_post" | "custom">("custom");
  const [testEmail, setTestEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: subs } = useQuery({
    queryKey: ["subscriber-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("subscribers").select("status");
      const stats = { confirmed: 0, pending: 0, unsubscribed: 0 };
      (data ?? []).forEach((r: any) => { if (stats.hasOwnProperty(r.status)) (stats as any)[r.status]++; });
      return stats;
    },
  });

  const { data: campaigns } = useQuery({
    queryKey: ["newsletter_campaigns"],
    queryFn: async () => {
      const { data } = await supabase.from("newsletter_campaigns").select("*").order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  const { data: latestMarket } = useQuery({
    queryKey: ["latest-market-update"],
    queryFn: async () => {
      const { data } = await supabase.from("market_updates").select("*").eq("status", "published").order("update_date", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  const { data: latestBlogs } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("id, title, excerpt, slug, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const pullMarket = () => {
    if (!latestMarket) return toast.error("No published market update yet");
    setSourceType("market_update");
    setSubject(`📊 ${latestMarket.headline}`);
    setPreheader(latestMarket.summary?.slice(0, 100) ?? "");
    setHtmlBody(`
<h2 style="margin:0 0 12px;font-size:20px;color:#0f172a">${latestMarket.headline}</h2>
<p style="margin:0 0 14px;color:#475569;font-size:14px">${format(new Date(latestMarket.update_date), "EEEE, d MMMM yyyy")}</p>
<p style="margin:0 0 18px;line-height:1.6">${latestMarket.summary}</p>
${latestMarket.what_it_means ? `<div style="background:#fff6ee;border-left:3px solid #ea7c2f;padding:14px 16px;margin:18px 0;border-radius:6px"><strong style="display:block;margin-bottom:6px">What this means for you</strong><span style="font-size:14px">${latestMarket.what_it_means}</span></div>` : ""}
<p style="margin:24px 0 0"><a href="https://balajinivesh.studydna.in/market-updates/${latestMarket.update_date}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">Read full update →</a></p>`);
    toast.success("Composed from today's market update");
  };

  const pullBlog = (post: any) => {
    setSourceType("blog_post");
    setSubject(`📖 ${post.title}`);
    setPreheader(post.excerpt?.slice(0, 100) ?? "");
    setHtmlBody(`
<h2 style="margin:0 0 12px;font-size:20px;color:#0f172a">${post.title}</h2>
<p style="margin:0 0 18px;line-height:1.6;color:#374151">${post.excerpt}</p>
<p style="margin:24px 0 0"><a href="https://balajinivesh.studydna.in/blog/${post.slug}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600">Read the full article →</a></p>`);
    toast.success("Composed from blog post");
  };

  const saveDraft = useMutation({
    mutationFn: async () => {
      if (!subject.trim() || !htmlBody.trim()) throw new Error("Subject and body are required");
      const payload = { subject, preheader, html_body: htmlBody, source_type: sourceType, status: "draft" };
      if (editingId) {
        const { error } = await supabase.from("newsletter_campaigns").update(payload).eq("id", editingId);
        if (error) throw error;
        return editingId;
      }
      const { data, error } = await supabase.from("newsletter_campaigns").insert(payload).select("id").single();
      if (error) throw error;
      setEditingId(data.id);
      return data.id;
    },
    onSuccess: () => { toast.success("Draft saved"); qc.invalidateQueries({ queryKey: ["newsletter_campaigns"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const sendTest = useMutation({
    mutationFn: async () => {
      if (!testEmail.trim()) throw new Error("Enter a test email");
      const id = editingId ?? (await saveDraft.mutateAsync());
      const { data, error } = await supabase.functions.invoke("send-newsletter", { body: { campaignId: id, testEmail: testEmail.trim() } });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      return data;
    },
    onSuccess: (d: any) => toast.success(d?.simulated ? "Test simulated (add Resend key for real send)" : `Test sent to ${testEmail}`),
    onError: (e: any) => toast.error(e.message),
  });

  const sendBlast = useMutation({
    mutationFn: async () => {
      const id = editingId ?? (await saveDraft.mutateAsync());
      if (!confirm(`Send to all ${subs?.confirmed ?? 0} confirmed subscribers?`)) throw new Error("Cancelled");
      const { data, error } = await supabase.functions.invoke("send-newsletter", { body: { campaignId: id } });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      return data;
    },
    onSuccess: (d: any) => {
      toast.success(`Sent to ${d.sent} subscribers (${d.failed} failed)`);
      qc.invalidateQueries({ queryKey: ["newsletter_campaigns"] });
      setEditingId(null); setSubject(""); setPreheader(""); setHtmlBody("");
    },
    onError: (e: any) => { if (e.message !== "Cancelled") toast.error(e.message); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Newsletter</h1>
          <p className="text-sm text-muted-foreground">Compose, test, and send Samajhne Wali Khabar to confirmed subscribers.</p>
        </div>
        <div className="flex gap-2">
          <Card className="border-border/60"><CardContent className="flex items-center gap-2 px-4 py-2"><Users className="h-4 w-4 text-brand-green" /><div><div className="text-xs text-muted-foreground">Confirmed</div><div className="font-display text-lg font-bold">{subs?.confirmed ?? 0}</div></div></CardContent></Card>
          <Card className="border-border/60"><CardContent className="flex items-center gap-2 px-4 py-2"><Mail className="h-4 w-4 text-primary" /><div><div className="text-xs text-muted-foreground">Pending</div><div className="font-display text-lg font-bold">{subs?.pending ?? 0}</div></div></CardContent></Card>
        </div>
      </div>

      <Tabs defaultValue="compose">
        <TabsList><TabsTrigger value="compose">Compose</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>

        <TabsContent value="compose" className="mt-4 space-y-4">
          <Card><CardHeader><CardTitle className="text-sm">Quick-start: pull from existing content</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={pullMarket}><TrendingUp className="mr-1 h-3.5 w-3.5" /> Latest market update</Button>
              {(latestBlogs ?? []).slice(0, 3).map((p) => (
                <Button key={p.id} size="sm" variant="outline" onClick={() => pullBlog(p)}><FileText className="mr-1 h-3.5 w-3.5" /> {p.title.slice(0, 36)}…</Button>
              ))}
            </CardContent>
          </Card>

          <Card><CardContent className="space-y-3 p-4">
            <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Today in markets — Sensex back above 75,000" /></div>
            <div><Label>Preheader (preview text)</Label><Input value={preheader} onChange={(e) => setPreheader(e.target.value)} placeholder="Quick read: what moved today and why it matters" /></div>
            <div><Label>HTML body</Label>
              <Textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} rows={14} placeholder="<h2>Headline</h2><p>Body…</p>" className="font-mono text-xs" />
              <p className="mt-1 text-xs text-muted-foreground">A branded wrapper, greeting, and unsubscribe footer are added automatically.</p>
            </div>
            <div className="flex flex-wrap items-end gap-2 border-t border-border pt-3">
              <Button onClick={() => saveDraft.mutate()} disabled={saveDraft.isPending} variant="outline">
                {saveDraft.isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />} Save draft
              </Button>
              <div className="flex items-end gap-1.5">
                <div><Label className="text-xs">Test email</Label><Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="me@example.com" className="h-9 w-56" /></div>
                <Button onClick={() => sendTest.mutate()} disabled={sendTest.isPending} variant="outline">
                  {sendTest.isPending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1 h-3.5 w-3.5" />} Send test
                </Button>
              </div>
              <Button onClick={() => sendBlast.mutate()} disabled={sendBlast.isPending} className="ml-auto">
                {sendBlast.isPending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1 h-3.5 w-3.5" />}
                Send to {subs?.confirmed ?? 0} subscribers
              </Button>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-2">
          {(campaigns ?? []).map((c: any) => (
            <Card key={c.id}><CardContent className="flex items-center gap-3 p-3">
              <Badge variant={c.status === "sent" ? "default" : "outline"}>{c.status}</Badge>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.subject}</div>
                <div className="text-xs text-muted-foreground">{c.sent_at ? format(new Date(c.sent_at), "d MMM yyyy, HH:mm") : "Draft"} · {c.recipient_count} recipients</div>
              </div>
              {c.status === "draft" && (
                <Button size="sm" variant="outline" onClick={() => { setEditingId(c.id); setSubject(c.subject); setPreheader(c.preheader ?? ""); setHtmlBody(c.html_body); setSourceType(c.source_type); }}>Edit</Button>
              )}
            </CardContent></Card>
          ))}
          {!campaigns?.length && <p className="text-sm text-muted-foreground">No campaigns yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNewsletter;
