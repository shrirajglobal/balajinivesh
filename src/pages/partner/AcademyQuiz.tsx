import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Brain, Award, RotateCcw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { nextReview } from "@/lib/spacedRepetition";
import { toast } from "sonner";

interface Mod { id: string; slug: string; title: string; pass_percentage: number; issues_certificate: boolean; certificate_label: string | null; }
interface Q {
  id: string; question: string; options: string[]; correct_index: number;
  explanation: string | null; difficulty: string; chapter_id: string | null;
}
interface Attempt { question_id: string; ease_factor: number; interval_days: number; }

const QUIZ_SIZE = 10;

function pickQuestions(all: Q[], dueWeak: Set<string>): Q[] {
  if (all.length <= QUIZ_SIZE) return shuffle(all);
  // Prioritise weak/due questions, then fill randomly
  const weak = all.filter((q) => dueWeak.has(q.id));
  const rest = all.filter((q) => !dueWeak.has(q.id));
  const picked = [...shuffle(weak).slice(0, Math.min(weak.length, Math.floor(QUIZ_SIZE / 2))), ...shuffle(rest)].slice(0, QUIZ_SIZE);
  return shuffle(picked);
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const AcademyQuiz = () => {
  const { moduleSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mod, setMod] = useState<Mod | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [latestAttempts, setLatestAttempts] = useState<Map<string, Attempt>>(new Map());
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [issuingCert, setIssuingCert] = useState(false);

  useEffect(() => {
    if (!moduleSlug) return;
    (async () => {
      setLoading(true);
      const { data: m } = await supabase.from("learning_modules").select("id, slug, title, pass_percentage, issues_certificate, certificate_label").eq("slug", moduleSlug).maybeSingle();
      if (!m) { setLoading(false); return; }
      setMod(m as any);
      const { data: qs } = await supabase.from("quiz_questions").select("*").eq("module_id", m.id).eq("is_active", true);
      const allQ = ((qs as any) ?? []).map((q: any) => ({ ...q, options: Array.isArray(q.options) ? q.options : (q.options?.options ?? []) }));

      // Build "due weak" set: questions whose latest attempt was wrong OR next_review_at <= now
      const dueWeak = new Set<string>();
      const latest = new Map<string, Attempt>();
      if (user) {
        const { data: atts } = await supabase
          .from("quiz_attempts").select("question_id, is_correct, ease_factor, interval_days, next_review_at, created_at")
          .eq("user_id", user.id).eq("module_id", m.id).order("created_at", { ascending: false });
        for (const a of (atts ?? []) as any[]) {
          if (latest.has(a.question_id)) continue;
          latest.set(a.question_id, { question_id: a.question_id, ease_factor: a.ease_factor, interval_days: a.interval_days });
          if (!a.is_correct || (a.next_review_at && new Date(a.next_review_at) <= new Date())) {
            dueWeak.add(a.question_id);
          }
        }
      }
      setLatestAttempts(latest);
      setQuestions(pickQuestions(allQ, dueWeak));
      setStartedAt(Date.now());
      setQuestionStartedAt(Date.now());
      setLoading(false);
    })();
  }, [moduleSlug, user]);

  const current = questions[idx];
  const progress = questions.length === 0 ? 0 : ((idx + (revealed ? 1 : 0)) / questions.length) * 100;

  const submit = async (i: number) => {
    if (revealed || !current) return;
    setSelected(i);
    setRevealed(true);
    const isCorrect = i === current.correct_index;
    if (isCorrect) setCorrectCount((c) => c + 1);

    if (user && mod) {
      const responseSec = Math.round((Date.now() - questionStartedAt) / 1000);
      const prev = latestAttempts.get(current.id) ?? null;
      const srs = nextReview(prev ? { ease_factor: prev.ease_factor, interval_days: prev.interval_days } : null, isCorrect);
      await supabase.from("quiz_attempts").insert({
        user_id: user.id, module_id: mod.id, chapter_id: current.chapter_id,
        question_id: current.id, selected_index: i, is_correct: isCorrect,
        response_seconds: responseSec,
        ease_factor: srs.ease_factor, interval_days: srs.interval_days, next_review_at: srs.next_review_at,
      });
    }
  };

  const advance = async () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
      setQuestionStartedAt(Date.now());
    } else {
      // Finish quiz
      setFinished(true);
      const scorePct = questions.length === 0 ? 0 : (correctCount / questions.length) * 100;
      if (user && mod) {
        const { data: existing } = await supabase
          .from("partner_module_progress")
          .select("best_quiz_score_pct, chapters_completed")
          .eq("user_id", user.id).eq("module_id", mod.id).maybeSingle();
        const best = Math.max(scorePct, existing?.best_quiz_score_pct ?? 0);
        const passed = scorePct >= mod.pass_percentage;
        await supabase.from("partner_module_progress").upsert({
          user_id: user.id, module_id: mod.id,
          chapters_completed: existing?.chapters_completed ?? 0,
          quiz_score_pct: scorePct,
          best_quiz_score_pct: best,
          last_activity_at: new Date().toISOString(),
          completed_at: passed ? new Date().toISOString() : null,
        }, { onConflict: "user_id,module_id" });

        // Auto-issue certificate
        if (passed && mod.issues_certificate) {
          setIssuingCert(true);
          const { data: existingCert } = await supabase.from("learning_certificates").select("id").eq("user_id", user.id).eq("module_id", mod.id).maybeSingle();
          if (!existingCert) {
            const certNumber = `BN-${mod.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
            await supabase.from("learning_certificates").insert({
              user_id: user.id, module_id: mod.id,
              certificate_number: certNumber,
              module_title: mod.certificate_label || mod.title,
              score_pct: best,
            });
            toast.success("Certificate earned!");
          }
          setIssuingCert(false);
        }
      }
    }
  };

  const restart = () => {
    setIdx(0); setSelected(null); setRevealed(false); setCorrectCount(0); setFinished(false);
    setStartedAt(Date.now()); setQuestionStartedAt(Date.now());
    setQuestions((qs) => shuffle(qs));
  };

  if (loading) return <PartnerLayout><Skeleton className="h-96 w-full" /></PartnerLayout>;
  if (!mod) return <PartnerLayout><p className="text-muted-foreground">Module not found.</p></PartnerLayout>;

  if (questions.length === 0) {
    return (
      <PartnerLayout>
        <Card><CardContent className="py-12 text-center text-muted-foreground">No quiz questions published yet for this module.</CardContent></Card>
      </PartnerLayout>
    );
  }

  if (finished) {
    const scorePct = (correctCount / questions.length) * 100;
    const passed = scorePct >= mod.pass_percentage;
    return (
      <PartnerLayout>
        <Link to={`/partner/academy/${moduleSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to module
        </Link>
        <Card className="mt-4 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              {passed ? <Award className="h-8 w-8" /> : <Brain className="h-8 w-8" />}
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">{passed ? "Passed!" : "Keep practising"}</h2>
            <p className="mt-1 text-muted-foreground">You scored {correctCount} out of {questions.length} ({Math.round(scorePct)}%).</p>
            <p className="mt-1 text-xs text-muted-foreground">Pass mark: {mod.pass_percentage}%</p>
            {passed && mod.issues_certificate && (
              <p className="mt-4 text-sm text-foreground">
                {issuingCert ? "Issuing your certificate…" : "Your certificate has been issued — view it on the Certificates page."}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={restart}><RotateCcw className="h-4 w-4" /> Try again</Button>
              <Button asChild><Link to={`/partner/academy/${moduleSlug}`}>Back to module</Link></Button>
              {passed && mod.issues_certificate && (
                <Button asChild variant="outline"><Link to="/partner/dashboard"><Award className="h-4 w-4" /> View certificates</Link></Button>
              )}
            </div>
          </CardContent>
        </Card>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <Link to={`/partner/academy/${moduleSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Exit quiz
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">{mod.title} — Quiz</h1>
        </div>
        <Badge variant="secondary">Q {idx + 1} / {questions.length}</Badge>
      </div>
      <Progress value={progress} className="mt-2 h-1.5" />

      <AnimatePresence mode="wait">
        <motion.div key={current?.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <Card className="mt-6 border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{current.difficulty}</Badge>
                {latestAttempts.has(current.id) && (
                  <Badge variant="outline" className="text-xs"><Sparkles className="h-3 w-3 mr-1" />Review</Badge>
                )}
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-foreground">{current.question}</p>
              <div className="mt-4 space-y-2">
                {current.options.map((opt, i) => {
                  const isCorrect = i === current.correct_index;
                  const isSelected = i === selected;
                  let cls = "border-border/60 hover:border-primary/40";
                  if (revealed) {
                    if (isCorrect) cls = "border-green-500/60 bg-green-500/5";
                    else if (isSelected) cls = "border-red-500/60 bg-red-500/5";
                    else cls = "border-border/40 opacity-70";
                  } else if (isSelected) cls = "border-primary/60 bg-primary/5";
                  return (
                    <button
                      key={i}
                      onClick={() => submit(i)}
                      disabled={revealed}
                      className={`flex w-full items-center justify-between rounded-lg border-2 p-3 text-left text-sm transition ${cls}`}
                    >
                      <span className="text-foreground">{opt}</span>
                      {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {revealed && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                    </button>
                  );
                })}
              </div>

              {revealed && current.explanation && (
                <div className="mt-4 rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-foreground/90">
                  <span className="font-semibold">Explanation: </span>{current.explanation}
                </div>
              )}

              {revealed && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={advance}>
                    {idx + 1 === questions.length ? "Finish" : "Next"} →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </PartnerLayout>
  );
};

export default AcademyQuiz;
