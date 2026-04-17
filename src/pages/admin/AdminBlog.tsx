import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Sparkles, FileText, Plus, Eye, Trash2, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { scanContent, hasBlockingViolations } from "@/lib/complianceScanner";
import { slugify, readingTime } from "@/lib/blogUtils";
import Markdown from "@/components/blog/Markdown";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  audience: string;
  status: string;
  category_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  cover_image_url: string | null;
  ai_generated: boolean;
  scheduled_for: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  view_count: number;
  created_at: string;
}

const AdminBlog = () => {
  const qc = useQueryClient();
  const [generateOpen, setGenerateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [genTopic, setGenTopic] = useState("");
  const [genCategory, setGenCategory] = useState<string>("");
  const [genAudience, setGenAudience] = useState<"investor" | "partner">("investor");
  const [generating, setGenerating] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_categories").select("*").order("display_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as Post[];
    },
  });

  const { data: jobs } = useQuery({
    queryKey: ["admin-blog-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_generation_jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  const generate = async () => {
    if (!genTopic.trim()) {
      toast.error("Topic required");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-post", {
        body: {
          topic: genTopic.trim(),
          category_id: genCategory || null,
          audience: genAudience,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Generation failed");
      toast.success("Draft generated — review & publish");
      setGenerateOpen(false);
      setGenTopic("");
      setGenCategory("");
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["admin-blog-jobs"] });
      // Open the new draft for review
      if (data.post_id) {
        const { data: post } = await supabase.from("blog_posts").select("*").eq("id", data.post_id).single();
        if (post) setEditingPost(post as Post);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const savePost = useMutation({
    mutationFn: async (p: Post) => {
      const violations = scanContent(`${p.title}\n${p.excerpt}\n${p.content}`);
      if (p.status === "published" && hasBlockingViolations(`${p.title}\n${p.excerpt}\n${p.content}`)) {
        throw new Error(
          `Cannot publish — compliance violations: ${violations
            .filter((v) => v.severity === "block")
            .map((v) => v.phrase)
            .join(", ")}`,
        );
      }
      const update: Partial<Post> = {
        title: p.title,
        slug: p.slug || slugify(p.title),
        excerpt: p.excerpt,
        content: p.content,
        audience: p.audience,
        status: p.status,
        category_id: p.category_id,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
        meta_keywords: p.meta_keywords,
        cover_image_url: p.cover_image_url,
        scheduled_for: p.scheduled_for,
        reading_time_minutes: readingTime(p.content),
      };
      if (p.status === "published" && !p.published_at) {
        (update as any).published_at = new Date().toISOString();
      }
      const { error } = await supabase.from("blog_posts").update(update).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post saved");
      setEditingPost(null);
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const violations = editingPost ? scanContent(`${editingPost.title}\n${editingPost.excerpt}\n${editingPost.content}`) : [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Blog CMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-assisted SEO content engine. Auto-drafts pass through compliance scan before publish.
          </p>
        </div>
        <Button onClick={() => setGenerateOpen(true)}>
          <Sparkles className="mr-2 h-4 w-4" />
          AI Auto-Draft
        </Button>
      </div>

      <Tabs defaultValue="posts" className="mt-6">
        <TabsList>
          <TabsTrigger value="posts">
            <FileText className="mr-2 h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : !posts?.length ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No posts yet — click "AI Auto-Draft" to generate your first article.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {p.title}
                            {p.ai_generated && <Badge variant="outline" className="text-[10px]">AI</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground">/{p.slug}</div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{p.audience}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={p.status === "published" ? "default" : "outline"} className="capitalize">
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.view_count}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(p.created_at), "d MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {p.status === "published" && (
                              <Button asChild size="icon" variant="ghost">
                                <Link to={`/blog/${p.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => setEditingPost(p)}>
                              Edit
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => {
                              if (confirm(`Delete "${p.title}"?`)) deletePost.mutate(p.id);
                            }}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {!jobs?.length ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No generation jobs yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((j: any) => (
                      <TableRow key={j.id}>
                        <TableCell className="font-medium">{j.topic}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{j.audience}</Badge></TableCell>
                        <TableCell>
                          <Badge
                            variant={j.status === "ready_for_review" || j.status === "published" ? "default" : j.status === "failed" ? "destructive" : "outline"}
                            className="capitalize"
                          >
                            {j.status.replace(/_/g, " ")}
                          </Badge>
                          {j.error_message && <div className="mt-1 text-xs text-destructive">{j.error_message}</div>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(j.created_at), "d MMM yyyy HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Auto-Draft</DialogTitle>
            <DialogDescription>
              Generate a SEO-optimised draft using the configured AI provider. The draft will be saved with status "draft" for your review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Audience</Label>
              <Select value={genAudience} onValueChange={(v: any) => setGenAudience(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="partner">Partner / Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Content Pillar (optional)</Label>
              <Select value={genCategory} onValueChange={setGenCategory}>
                <SelectTrigger><SelectValue placeholder="Select a category…" /></SelectTrigger>
                <SelectContent>
                  {categories?.filter((c: any) => c.audience === genAudience || c.audience === "both").map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Topic / Working Title</Label>
              <Textarea
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. How a homemaker in Kolkata can start a ₹500 SIP for her child's education"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>Cancel</Button>
            <Button onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingPost} onOpenChange={(o) => !o && setEditingPost(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Review the draft, edit the content, and publish. Compliance scan runs automatically.
            </DialogDescription>
          </DialogHeader>

          {editingPost && (
            <div className="space-y-4">
              {violations.length > 0 && (
                <div className={`rounded-md border p-3 text-sm ${hasBlockingViolations(`${editingPost.title}\n${editingPost.content}`) ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-warning/50 bg-warning/10"}`}>
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    Compliance flags
                  </div>
                  <ul className="mt-1 list-disc pl-5 text-xs">
                    {violations.map((v, i) => (
                      <li key={i}><strong>{v.phrase}</strong> — {v.reason} ({v.severity})</li>
                    ))}
                  </ul>
                </div>
              )}
              {violations.length === 0 && (
                <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Compliance scan: clean
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Title</Label>
                  <Input value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editingPost.slug} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} />
                </div>
                <div>
                  <Label>Audience</Label>
                  <Select value={editingPost.audience} onValueChange={(v) => setEditingPost({ ...editingPost, audience: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={editingPost.category_id ?? ""} onValueChange={(v) => setEditingPost({ ...editingPost, category_id: v || null })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editingPost.status} onValueChange={(v) => setEditingPost({ ...editingPost, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Excerpt</Label>
                  <Textarea rows={2} value={editingPost.excerpt} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Cover image URL (optional)</Label>
                  <Input value={editingPost.cover_image_url ?? ""} onChange={(e) => setEditingPost({ ...editingPost, cover_image_url: e.target.value || null })} />
                </div>
                <div>
                  <Label>Meta title</Label>
                  <Input value={editingPost.meta_title ?? ""} onChange={(e) => setEditingPost({ ...editingPost, meta_title: e.target.value })} />
                </div>
                <div>
                  <Label>Meta keywords (comma sep.)</Label>
                  <Input
                    value={(editingPost.meta_keywords ?? []).join(", ")}
                    onChange={(e) => setEditingPost({ ...editingPost, meta_keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Meta description</Label>
                  <Textarea rows={2} value={editingPost.meta_description ?? ""} onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Content (Markdown)</Label>
                  <Textarea
                    rows={18}
                    className="font-mono text-xs"
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  />
                </div>

                <details className="md:col-span-2 rounded-md border border-border p-3">
                  <summary className="cursor-pointer text-sm font-medium">Preview</summary>
                  <div className="mt-3 rounded bg-muted/40 p-4">
                    <Markdown content={editingPost.content} />
                  </div>
                </details>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
            <Button onClick={() => editingPost && savePost.mutate(editingPost)} disabled={savePost.isPending}>
              {savePost.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
