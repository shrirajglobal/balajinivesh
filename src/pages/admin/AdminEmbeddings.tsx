import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Database } from "lucide-react";
import { toast } from "sonner";

const AdminEmbeddings = () => {
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<any>(null);

  const { data: stats, refetch } = useQuery({
    queryKey: ["embedding-stats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_embeddings")
        .select("source_type", { count: "exact", head: false });
      const counts: Record<string, number> = {};
      (data ?? []).forEach((row: any) => {
        counts[row.source_type] = (counts[row.source_type] ?? 0) + 1;
      });
      return counts;
    },
  });

  const runEmbed = async (source_types?: string[]) => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("embed-content", {
        body: source_types ? { source_types } : {},
      });
      if (error) throw error;
      setLastRun(data);
      toast.success(`Embedded ${data?.total_embedded ?? 0} chunks`);
      refetch();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Chatbot Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground">Re-index content so the chatbot can answer questions about it.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Database className="h-5 w-5" />Indexed chunks</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["blog_post", "market_update", "academy_chapter"].map((k) => (
              <Badge key={k} variant="outline" className="text-sm">
                {k}: {stats?.[k] ?? 0}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Re-index</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Run this after publishing new blog posts, market updates, or academy chapters. Each run re-embeds the latest 50 items per source.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => runEmbed()} disabled={running}>
              {running ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
              Re-index everything
            </Button>
            <Button variant="outline" onClick={() => runEmbed(["blog_post"])} disabled={running}>Blog only</Button>
            <Button variant="outline" onClick={() => runEmbed(["market_update"])} disabled={running}>Market updates only</Button>
            <Button variant="outline" onClick={() => runEmbed(["academy_chapter"])} disabled={running}>Academy only</Button>
          </div>
          {lastRun && (
            <pre className="mt-4 overflow-auto rounded bg-muted p-3 text-xs">
              {JSON.stringify(lastRun, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmbeddings;
