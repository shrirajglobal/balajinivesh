import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MessagesSquare, Plus, Loader2, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeroBanner from "@/components/layout/HeroBanner";
import SEO from "@/components/seo/SEO";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Thread {
  id: string;
  slug: string;
  title: string;
  category: string;
  reply_count: number;
  last_activity_at: string;
  created_at: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  general: "General",
  sip: "SIP",
  tax: "Tax",
  nism_prep: "NISM Prep",
  market: "Market",
  partner_only: "Partner only",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const ForumIndex = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("forum_threads")
        .select("id,slug,title,category,reply_count,last_activity_at,created_at")
        .in("status", ["approved", "locked"])
        .order("last_activity_at", { ascending: false })
        .limit(50);
      setThreads((data as Thread[]) ?? []);
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth?redirect=/forum");
      return;
    }
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const baseSlug = slugify(title) || crypto.randomUUID().slice(0, 8);
      const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;
      const { error } = await supabase.from("forum_threads").insert({
        user_id: user.id,
        slug,
        title: title.trim(),
        body: body.trim(),
        category,
        status: "pending",
      });
      if (error) throw error;
      toast.success("Thank you! Your post is under review and will appear once approved.");
      setTitle("");
      setBody("");
      setCategory("general");
      setShowForm(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title="Community Forum — Balaji Nivesh"
        description="Ask, share, and learn from the Balaji Nivesh investor and partner community. Moderated for safety and SEBI compliance."
        canonical="/forum"
      />

      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-light text-brand-green">
            <MessagesSquare className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">Community Forum</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Investor and partner Q&amp;A. All threads are moderated.
          </p>
        </motion.div>
      </HeroBanner>

      <section className="py-10 lg:py-12">
        <div className="container max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">Recent threads</h2>
            <Button onClick={() => (user ? setShowForm((v) => !v) : navigate("/auth?redirect=/forum"))}>
              <Plus className="mr-1 h-4 w-4" />
              {showForm ? "Cancel" : "New thread"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 border-primary/20">
              <CardContent className="p-6">
                <form onSubmit={submit} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input
                      placeholder="What's your question?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={140}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_LABEL).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Details</label>
                    <Textarea
                      placeholder="Share context, what you've tried, and your specific question."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={5}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-muted-foreground">
                      Posts are reviewed before publishing. Please don't ask for specific scheme picks.
                    </p>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {!threads ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No threads yet — be the first to start a conversation!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {threads.map((t) => (
                <Link
                  key={t.id}
                  to={`/forum/${t.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{CATEGORY_LABEL[t.category] ?? t.category}</Badge>
                      <h3 className="font-display text-sm font-semibold text-foreground">{t.title}</h3>
                    </div>
                    <p className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(t.last_activity_at), { addSuffix: true })}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {t.reply_count} replies</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8">
            <SebiDisclaimer variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForumIndex;
