import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, Languages, Brain, BookOpen, Lightbulb, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Markdown from "@/components/blog/Markdown";
import { toast } from "sonner";

interface Mod { id: string; slug: string; title: string; }
interface Chap {
  id: string; slug: string; title: string; summary: string | null;
  content_markdown: string; bengali_glossary: Record<string, string>;
  exam_traps: string | null; estimated_minutes: number; display_order: number;
  chapter_number: number | null;
  plain_english: string | null;
  real_world: string | null;
  quick_recap: string[] | null;
  exam_traps_list: string[] | null;
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
        {chap.chapter_number && (
          <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/10">Chapter {chap.chapter_number}</Badge>
        )}
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

        {/* Block 1: Plain English */}
        {chap.plain_english ? (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Plain English</h2>
            </div>
            <div className="text-foreground/90 leading-relaxed space-y-3">
              {chap.plain_english.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        ) : (
          <div className="mt-6">
            <Markdown content={chap.content_markdown || "_Chapter content coming soon._"} />
          </div>
        )}

        {/* Block 2: Real-World */}
        {chap.real_world && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-orange-500" />
              <h2 className="font-display font-semibold text-foreground">Real-World Application</h2>
            </div>
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{chap.real_world}</CardContent>
            </Card>
          </section>
        )}

        {/* Block 3: Exam Traps */}
        {((chap.exam_traps_list && chap.exam_traps_list.length > 0) || chap.exam_traps) && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h2 className="font-display font-semibold text-foreground">Common Exam Traps</h2>
            </div>
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4">
                {chap.exam_traps_list && chap.exam_traps_list.length > 0 ? (
                  <ol className="space-y-2 text-sm text-foreground/90 list-decimal pl-5">
                    {chap.exam_traps_list.map((t, i) => <li key={i}>{t}</li>)}
                  </ol>
                ) : (
                  <div className="text-sm text-foreground/90 whitespace-pre-line">{chap.exam_traps}</div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Block 4: Quick Recap */}
        {chap.quick_recap && chap.quick_recap.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-4 w-4 text-emerald-600" />
              <h2 className="font-display font-semibold text-foreground">Quick Recap</h2>
            </div>
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4">
                <ul className="space-y-1.5 text-sm text-foreground/90">
                  {chap.quick_recap.map((r, i) => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />{r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
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
