import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["general", "sip_basics", "market_education", "partner_training", "nism_prep", "homemakers", "kids"];
const AUDIENCES = ["investor", "partner", "all"];

function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : trimmed;
}

const AdminVideos = () => {
  const qc = useQueryClient();
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    youtube_id: "",
    category: "general",
    audience: "investor",
    display_order: 0,
  });

  const { data: videos } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_resources")
        .select("*")
        .order("display_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const youtube_id = extractYouTubeId(draft.youtube_id);
      if (!youtube_id || youtube_id.length !== 11) throw new Error("Invalid YouTube ID or URL");
      const { error } = await supabase.from("video_resources").insert({
        ...draft,
        youtube_id,
        thumbnail_url: `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Video added");
      setDraft({ title: "", description: "", youtube_id: "", category: "general", audience: "investor", display_order: 0 });
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, any> }) => {
      const { error } = await supabase.from("video_resources").update(patch as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-videos"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("video_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Video removed");
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Video Resources</h1>
        <p className="text-sm text-muted-foreground">Manage the public Video Explainer Series.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Add a video</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">YouTube URL or ID</label>
              <Input
                placeholder="https://youtu.be/dQw4w9WgXcQ or dQw4w9WgXcQ"
                value={draft.youtube_id}
                onChange={(e) => setDraft({ ...draft, youtube_id: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Display order</label>
              <Input
                type="number"
                value={draft.display_order}
                onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description (optional)</label>
            <Textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Audience</label>
              <Select value={draft.audience} onValueChange={(v) => setDraft({ ...draft, audience: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => create.mutate()} disabled={create.isPending || !draft.title || !draft.youtube_id}>
            <Plus className="mr-1 h-4 w-4" /> Add video
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-foreground">All videos</h2>
        {videos?.map((v) => (
          <Card key={v.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <img
                src={v.thumbnail_url ?? `https://i.ytimg.com/vi/${v.youtube_id}/default.jpg`}
                alt={v.title}
                className="h-16 w-28 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.category} · {v.audience} · order {v.display_order}</p>
              </div>
              <Switch
                checked={v.is_published}
                onCheckedChange={(checked) => update.mutate({ id: v.id, patch: { is_published: checked } })}
              />
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(v.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminVideos;
