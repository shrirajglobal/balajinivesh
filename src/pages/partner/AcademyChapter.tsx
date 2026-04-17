import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, Languages, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Markdown from "@/components/blog/Markdown";
import { toast } from "sonner";

interface Mod { id: string; slug: string; title: string; }
interface Chap {
  id: string; slug: string; title: string; summary: string | null;
  content_markdown: string; bengali_glossary: Record<string, string>;
  exam_traps: string | null; estimated_minutes: number; display_order: number;
}

const AcademyChapter = () => {
  const { moduleSlug, chapterSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mod, setMod] = useState<Mod | null>(null);
  const [chap, setChap] = useState<Chap | null>(null);
  const [siblings, setSiblings] = useState<{ id: string; slug: string; display_order: number }[]>([]);
  const [done, setDone] = useState(false);
  const [showBengali, setShowBengali] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!moduleSlug || !chapterSlug) return;
    (async () => {
      setLoading(true);
      const { data: m } = await supabase.from("learning_modules").select("id, slug, title").eq("slug", moduleSlug).maybeSingle();
      if (!m) { setLoading(false); return; }
      setMod(m as any);
      const { data: c } = await supabase.from("learning_chapters").select("*").eq("module_id", m.id).eq("slug", chapterSlug).maybeSingle();
      setChap(c as any);
      const { data: sibs } = await supabase.from("learning_chapters").select("id, slug, display_order").eq("module_id", m.id).eq("is_published", true).order("display_order");
      setSiblings((sibs as any) ?? []);
      if (user && c) {
        const { data: prog } = await supabase.from("partner_chapter_progress").select("id").eq("user_id", user.id).eq("chapter_id", c.id).maybeSingle();
        setDone(!!prog);
      }
      setLoading(false);
    })();
  }, [moduleSlug, chapterSlug, user]);

  const idx = siblings.findIndex((s) => s.slug === chapterSlug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const markDone = async () => {
    if (!user || !chap || !mod || done) return;
    setMarking(true);
    try {
      const { error } = await supabase.from("partner_chapter_progress").insert({
        user_id: user.id, module_id: mod.id, chapter_id: chap.id,
      });
      if (error && !error.message.includes("duplicate")) throw error;
      setDone(true);

      // recompute aggregate
      const { count } = await supabase
        .from("partner_chapter_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("module_id", mod.id);
      await supabase.from("partner_module_progress").upsert({
        user_id: user.id, module_id: mod.id,
        chapters_completed: count ?? 0,
        last_activity_at: new Date().toISOString(),
      }, { onConflict: "user_id,module_id" });

      toast.success("Chapter completed");
      if (next) navigate(`/partner/academy/${moduleSlug}/${next.slug}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <PartnerLayout><Skeleton className="h-96 w-full" /></PartnerLayout>;
  if (!chap || !mod) return <PartnerLayout><p className="text-muted-foreground">Chapter not found.</p></PartnerLayout>;

  const bengaliEntries = Object.entries(chap.bengali_glossary || {});

  return (
    <PartnerLayout>
      <Link to={`/partner/academy/${moduleSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> {mod.title}
      </Link>

      <article className="mt-4 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground">{chap.title}</h1>
        {chap.summary && <p className="mt-2 text-muted-foreground">{chap.summary}</p>}

        {bengaliEntries.length > 0 && (
          <div className="mt-4 inline-flex">
            <Button variant="outline" size="sm" onClick={() => setShowBengali((v) => !v)}>
              <Languages className="h-3.5 w-3.5" /> {showBengali ? "Hide" : "Show"} Bengali glossary
            </Button>
          </div>
        )}

        {showBengali && bengaliEntries.length > 0 && (
          <Card className="mt-3 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Key terms (Bengali)</p>
              <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                {bengaliEntries.map(([en, bn]) => (
                  <div key={en} className="text-sm">
                    <dt className="font-medium text-foreground">{en}</dt>
                    <dd className="text-muted-foreground">{bn}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        )}

        <div className="mt-6">
          <Markdown content={chap.content_markdown || "_Chapter content coming soon._"} />
        </div>

        {chap.exam_traps && (
          <Card className="mt-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-display font-semibold text-foreground">Common Exam Traps</p>
                  <div className="mt-1 text-sm text-foreground/90 whitespace-pre-line">{chap.exam_traps}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </article>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
        <div>
          {prev ? (
            <Button variant="outline" asChild>
              <Link to={`/partner/academy/${moduleSlug}/${prev.slug}`}><ArrowLeft className="h-4 w-4" /> Previous</Link>
            </Button>
          ) : <span />}
        </div>
        <div className="flex flex-wrap gap-2">
          {!done && (
            <Button onClick={markDone} disabled={marking}>
              <CheckCircle2 className="h-4 w-4" /> Mark Complete
            </Button>
          )}
          {done && !next && (
            <Button asChild>
              <Link to={`/partner/academy/${moduleSlug}/quiz`}><Brain className="h-4 w-4" /> Take Quiz</Link>
            </Button>
          )}
          {next && (
            <Button asChild variant={done ? "default" : "outline"}>
              <Link to={`/partner/academy/${moduleSlug}/${next.slug}`}>Next chapter <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          )}
        </div>
      </div>
    </PartnerLayout>
  );
};

export default AcademyChapter;
