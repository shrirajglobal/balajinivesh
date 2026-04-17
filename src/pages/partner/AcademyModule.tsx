import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, ChevronRight, CheckCircle2, Brain, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Mod { id: string; slug: string; title: string; subtitle: string | null; description: string | null; total_chapters: number; pass_percentage: number; issues_certificate: boolean; certificate_label: string | null; cover_emoji: string | null; }
interface Chap { id: string; slug: string; title: string; summary: string | null; estimated_minutes: number; display_order: number; }

const ModuleOverview = () => {
  const { moduleSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mod, setMod] = useState<Mod | null>(null);
  const [chapters, setChapters] = useState<Chap[]>([]);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [hasCert, setHasCert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleSlug) return;
    (async () => {
      const { data: m } = await supabase.from("learning_modules").select("*").eq("slug", moduleSlug).maybeSingle();
      if (!m) { setLoading(false); return; }
      setMod(m as any);

      const [chapRes, qRes, progRes, certRes] = await Promise.all([
        supabase.from("learning_chapters").select("id, slug, title, summary, estimated_minutes, display_order").eq("module_id", m.id).eq("is_published", true).order("display_order"),
        supabase.from("quiz_questions").select("id", { count: "exact", head: true }).eq("module_id", m.id).eq("is_active", true),
        user ? supabase.from("partner_chapter_progress").select("chapter_id").eq("user_id", user.id).eq("module_id", m.id) : Promise.resolve({ data: [] as any[] }),
        user ? supabase.from("partner_module_progress").select("best_quiz_score_pct").eq("user_id", user.id).eq("module_id", m.id).maybeSingle() : Promise.resolve({ data: null as any }),
      ]);
      setChapters((chapRes.data as any) ?? []);
      setQuestionCount(qRes.count ?? 0);
      setDoneIds(new Set(((progRes.data as any) ?? []).map((p: any) => p.chapter_id)));
      setBestScore((certRes as any)?.data?.best_quiz_score_pct ?? null);
      if (user) {
        const { data: c } = await supabase.from("learning_certificates").select("id").eq("user_id", user.id).eq("module_id", m.id).maybeSingle();
        setHasCert(!!c);
      }
      setLoading(false);
    })();
  }, [moduleSlug, user]);

  const completedCount = chapters.filter((c) => doneIds.has(c.id)).length;
  const pct = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;
  const allChaptersDone = chapters.length > 0 && completedCount === chapters.length;

  if (loading) return <PartnerLayout><Skeleton className="h-96 w-full" /></PartnerLayout>;
  if (!mod) return <PartnerLayout><p className="text-muted-foreground">Module not found.</p></PartnerLayout>;

  return (
    <PartnerLayout>
      <Link to="/partner/academy" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All modules
      </Link>

      <div className="mt-3 flex flex-wrap items-start gap-4">
        <div className="text-4xl">{mod.cover_emoji ?? "📘"}</div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{mod.title}</h1>
          {mod.subtitle && <p className="text-muted-foreground">{mod.subtitle}</p>}
          <p className="mt-2 text-sm text-foreground/80">{mod.description}</p>
        </div>
        {hasCert && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">
            <Award className="h-3 w-3 mr-1" /> Certified
          </Badge>
        )}
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="min-w-[160px]">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Progress</p>
            <Progress value={pct} className="mt-1 h-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">{completedCount}/{chapters.length} chapters</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Quiz Best Score</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">{bestScore != null ? `${Math.round(bestScore)}%` : "—"}</p>
            <p className="text-xs text-muted-foreground">Pass mark: {mod.pass_percentage}%</p>
          </div>
          <div className="flex gap-2">
            {questionCount > 0 && (
              <Button variant={allChaptersDone ? "default" : "outline"} onClick={() => navigate(`/partner/academy/${mod.slug}/quiz`)}>
                <Brain className="h-4 w-4" /> Take Quiz ({questionCount})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Chapters</h2>
        <div className="mt-3 space-y-2">
          {chapters.length === 0 && (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No chapters published yet.</CardContent></Card>
          )}
          {chapters.map((c, i) => {
            const done = doneIds.has(c.id);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Link
                  to={`/partner/academy/${mod.slug}/${c.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-green-500/10 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-semibold">{i + 1}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{c.title}</p>
                    {c.summary && <p className="line-clamp-1 text-sm text-muted-foreground">{c.summary}</p>}
                    <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.estimated_minutes} min</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />Chapter {i + 1}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PartnerLayout>
  );
};

export default ModuleOverview;
