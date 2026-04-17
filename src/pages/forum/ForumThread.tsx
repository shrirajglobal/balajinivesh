import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import SEO from "@/components/seo/SEO";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

interface Thread {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: string;
  status: string;
  reply_count: number;
  created_at: string;
}
interface Post {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
}

const ForumThread = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [thread, setThread] = useState<Thread | null | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!slug) return;
    const { data: t } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    setThread((t as Thread) ?? null);
    if (t) {
      const { data: p } = await supabase
        .from("forum_posts")
        .select("id,body,created_at,user_id")
        .eq("thread_id", (t as Thread).id)
        .eq("status", "approved")
        .order("created_at");
      setPosts((p as Post[]) ?? []);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !thread || !reply.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("forum_posts").insert({
        thread_id: thread.id,
        user_id: user.id,
        body: reply.trim(),
        status: "pending",
      });
      if (error) throw error;
      toast.success("Reply submitted for moderation.");
      setReply("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (thread === undefined) {
    return (
      <div className="container flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!thread || (thread.status !== "approved" && thread.status !== "locked")) {
    return <Navigate to="/forum" replace />;
  }

  return (
    <article className="container max-w-3xl py-10 lg:py-12">
      <SEO
        title={`${thread.title} — Forum | Balaji Nivesh`}
        description={thread.body.slice(0, 160)}
        canonical={`/forum/${thread.slug}`}
      />

      <Link to="/forum" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to forum
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{thread.category}</Badge>
              {thread.status === "locked" && <Badge variant="secondary">Locked</Badge>}
              <span className="text-xs text-muted-foreground">
                {format(new Date(thread.created_at), "d MMM yyyy")}
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">{thread.title}</h1>
            <p className="mt-3 whitespace-pre-line text-foreground/90">{thread.body}</p>
          </CardContent>
        </Card>
      </motion.div>

      <h2 className="mt-8 font-display text-lg font-semibold text-foreground">
        Replies ({posts.length})
      </h2>
      <div className="mt-3 space-y-3">
        {posts.map((p) => (
          <Card key={p.id} className="border-border/60">
            <CardContent className="p-4 sm:p-5">
              <p className="whitespace-pre-line text-sm text-foreground/90">{p.body}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No replies yet — be the first to respond.</p>
        )}
      </div>

      {thread.status === "approved" && (
        <Card className="mt-6 border-border/60">
          <CardContent className="p-4 sm:p-5">
            {user ? (
              <form onSubmit={submit} className="space-y-3">
                <Textarea
                  placeholder="Write a thoughtful reply…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  required
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    Replies are moderated before publishing.
                  </p>
                  <Button type="submit" disabled={submitting || !reply.trim()}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
                    Post reply
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Sign in to reply.</span>
                <Button asChild>
                  <Link to={`/auth?redirect=/forum/${thread.slug}`}>Sign in</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <SebiDisclaimer variant="full" />
      </div>
    </article>
  );
};

export default ForumThread;
