import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, X, Lock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminForum = () => {
  const qc = useQueryClient();
  const [tab, setTab] = useState("threads_pending");

  const { data: threads } = useQuery({
    queryKey: ["admin-threads", tab],
    queryFn: async () => {
      const status = tab === "threads_pending" ? "pending" : "approved";
      const { data } = await supabase
        .from("forum_threads")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
    enabled: tab.startsWith("threads"),
  });

  const { data: posts } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("forum_posts")
        .select("*, forum_threads(slug,title)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
    enabled: tab === "posts_pending",
  });

  const setThreadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("forum_threads").update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-threads"] });
    },
  });

  const setPostStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("forum_posts").update({ status } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Forum Moderation</h1>
        <p className="text-sm text-muted-foreground">Review pending threads and replies.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="threads_pending">Pending threads</TabsTrigger>
          <TabsTrigger value="threads_approved">Approved threads</TabsTrigger>
          <TabsTrigger value="posts_pending">Pending replies</TabsTrigger>
        </TabsList>

        <TabsContent value="threads_pending" className="space-y-2">
          {threads?.length === 0 && <p className="text-sm text-muted-foreground">Nothing pending. 🎉</p>}
          {threads?.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{t.category}</Badge>
                      <h3 className="font-display text-base font-semibold text-foreground">{t.title}</h3>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">{t.body}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="sm" onClick={() => setThreadStatus.mutate({ id: t.id, status: "approved" })}>
                      <Check className="mr-1 h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setThreadStatus.mutate({ id: t.id, status: "rejected" })}>
                      <X className="mr-1 h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="threads_approved" className="space-y-2">
          {threads?.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <Link to={`/forum/${t.slug}`} className="font-display text-sm font-semibold text-foreground hover:text-primary">{t.title}</Link>
                  <p className="text-xs text-muted-foreground">{t.category} · {t.reply_count} replies</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="outline" onClick={() => setThreadStatus.mutate({ id: t.id, status: "locked" })}>
                    <Lock className="mr-1 h-3.5 w-3.5" /> Lock
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setThreadStatus.mutate({ id: t.id, status: "rejected" })}>
                    <X className="mr-1 h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="posts_pending" className="space-y-2">
          {posts?.length === 0 && <p className="text-sm text-muted-foreground">No pending replies. 🎉</p>}
          {posts?.map((p: any) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  Reply to: <Link to={`/forum/${p.forum_threads?.slug}`} className="font-medium text-foreground hover:text-primary">{p.forum_threads?.title}</Link>
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">{p.body}</p>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" onClick={() => setPostStatus.mutate({ id: p.id, status: "approved" })}>
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPostStatus.mutate({ id: p.id, status: "rejected" })}>
                    <X className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminForum;
