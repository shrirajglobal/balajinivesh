import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, Languages,
  Brain, BookOpen, Lightbulb, ListChecks, Clock, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Markdown from "@/components/blog/Markdown";
import { toast } from "sonner";
import GlossaryText from "@/components/academy/GlossaryText";
import RecapChecklist from "@/components/academy/RecapChecklist";
import MiniCheck from "@/components/academy/MiniCheck";
import ChapterOutline from "@/components/academy/ChapterOutline";

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
interface Sib { id: string; slug: string; title: string; summary: string | null; display_order: number; }
interface QQ { id: string; question: string; options: string[]; correct_index: number; explanation: string | null; }

const AcademyChapter = () => {
  const { moduleSlug, chapterSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const articleRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const [mod, setMod] = useState<Mod | null>(null);
  const [chap, setChap] = useState<Chap | null>(null);
  const [siblings, setSiblings] = useState<Sib[]>([]);
  const [questions, setQuestions] = useState<QQ[]>([]);
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
      const { data: sibs } = await supabase.from("learning_chapters")
        .select("id, slug, title, summary, display_order")
        .eq("module_id", m.id).eq("is_published", true).order("display_order");
      setSiblings((sibs as any) ?? []);
      if (c) {
        const { data: qs } = await supabase.from("quiz_questions")
          .select("id, question, options, correct_index, explanation")
          .eq("chapter_id", (c as any).id).eq("is_active", true);
        setQuestions(((qs as any) ?? []).map((q: any) => ({ ...q, options: Array.isArray(q.options) ? q.options : [] })));
      }
      if (user && c) {
        const { data: prog } = await supabase.from("partner_chapter_progress")
          .select("id").eq("user_id", user.id).eq("chapter_id", (c as any).id).maybeSingle();
        setDone(!!prog);
      }
      setLoading(false);
      // Restore scroll
      try {
        const saved = localStorage.getItem(`chap-scroll-${chapterSlug}`);
        if (saved) setTimeout(() => window.scrollTo({ top: parseInt(saved, 10), behavior: "smooth" }), 200);
      } catch {}
    })();
  }, [moduleSlug, chapterSlug, user]);

  // Persist scroll position
  useEffect(() => {
    if (!chapterSlug) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try { localStorage.setItem(`chap-scroll-${chapterSlug}`, String(window.scrollY)); } catch {}
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapterSlug]);

  const idx = siblings.findIndex((s) => s.slug === chapterSlug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const outline = useMemo(() => {
    if (!chap) return [];
    const items: { id: string; label: string }[] = [];
    if (chap.plain_english) items.push({ id: "block-plain", label: "Plain English" });
    if (chap.real_world) items.push({ id: "block-real", label: "Real-World" });
    if ((chap.exam_traps_list && chap.exam_traps_list.length) || chap.exam_traps) items.push({ id: "block-traps", label: "Exam Traps" });
    if (chap.quick_recap && chap.quick_recap.length) items.push({ id: "block-recap", label: "Quick Recap" });
    if (questions.length) items.push({ id: "block-check", label: "Self-Check" });
    if (chap.bengali_glossary && Object.keys(chap.bengali_glossary).length) items.push({ id: "block-glossary", label: "Glossary" });
    return items;
  }, [chap, questions]);

  const fireConfetti = () => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ["#f97316", "#3b82f6", "#10b981"] });
    setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } }), 150);
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } }), 250);
  };

  const markDone = async () => {
    if (!user || !chap || !mod) return;
    if (done) { if (next) navigate(`/partner/academy/${moduleSlug}/${next.slug}`); return; }
    setMarking(true);
    try {
      const { error } = await supabase.from("partner_chapter_progress").insert({
        user_id: user.id, module_id: mod.id, chapter_id: chap.id,
      });
      if (error && !error.message.includes("duplicate")) throw error;
      setDone(true);
      fireConfetti();
      const { count } = await supabase.from("partner_chapter_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id).eq("module_id", mod.id);
      await supabase.from("partner_module_progress").upsert({
        user_id: user.id, module_id: mod.id,
        chapters_completed: count ?? 0,
        last_activity_at: new Date().toISOString(),
      }, { onConflict: "user_id,module_id" });
      toast.success("Chapter completed!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <PartnerLayout><Skeleton className="h-96 w-full" /></PartnerLayout>;
  if (!chap || !mod) return <PartnerLayout><p className="text-muted-foreground">Chapter not found.</p></PartnerLayout>;

  const glossary = chap.bengali_glossary || {};
  const bengaliEntries = Object.entries(glossary);
  const hasGlossary = bengaliEntries.length > 0;

  return (
    <PartnerLayout>
      {/* Sticky reading shell */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link to={`/partner/academy/${moduleSlug}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> {mod.title}
            </Link>
            <div className="mt-0.5 flex items-center gap-2">
              {chap.chapter_number && <span className="text-xs font-semibold text-primary">Ch. {chap.chapter_number}</span>}
              <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">{chap.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <Clock className="h-3 w-3" /> {chap.estimated_minutes || 5} min
            </div>
            {hasGlossary && (
              <Button variant="outline" size="sm" onClick={() => setShowBengali((v) => !v)} className="h-8">
                <Languages className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{showBengali ? "Hide" : "Show"}</span> Aa
              </Button>
            )}
            <Button size="sm" onClick={markDone} disabled={marking} className="h-8">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {done ? (next ? "Next" : "Done") : "Mark complete"}
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <motion.div style={{ scaleX: progress, transformOrigin: "0%" }} className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:order-first">
          <ChapterOutline items={outline} />
        </aside>

        <article ref={articleRef} className="max-w-3xl">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {chap.chapter_number && (
              <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">Chapter {chap.chapter_number}</Badge>
            )}
            <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">{chap.title}</h1>
            {chap.summary && <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{chap.summary}</p>}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {chap.estimated_minutes || 5} min read</span>
              {idx >= 0 && <span>{idx + 1} of {siblings.length}</span>}
            </div>
          </motion.div>

          {/* Bengali glossary card (toggle) */}
          {showBengali && hasGlossary && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 overflow-hidden">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Bengali key terms</p>
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
            </motion.div>
          )}

          {/* Block 1: Plain English */}
          {chap.plain_english ? (
            <motion.section id="block-plain" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mt-10 scroll-mt-32">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><BookOpen className="h-4 w-4" /></span>
                <h2 className="font-display text-xl font-semibold text-foreground">Plain English</h2>
              </div>
              <GlossaryText text={chap.plain_english} glossary={glossary} className="chapter-prose" />
            </motion.section>
          ) : (
            <div className="mt-8 prose prose-sm max-w-none dark:prose-invert">
              <Markdown content={chap.content_markdown || "_Chapter content coming soon._"} />
            </div>
          )}

          {/* Block 2: Real-World */}
          {chap.real_world && (
            <motion.section id="block-real" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mt-10 scroll-mt-32">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600"><Lightbulb className="h-4 w-4" /></span>
                <h2 className="font-display text-xl font-semibold text-foreground">Real-World Story</h2>
              </div>
              <Card className="overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
                <CardContent className="p-5">
                  <GlossaryText text={chap.real_world} glossary={glossary} className="text-sm leading-relaxed text-foreground/90 space-y-3" />
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Block 3: Exam Traps */}
          {((chap.exam_traps_list && chap.exam_traps_list.length > 0) || chap.exam_traps) && (
            <motion.section id="block-traps" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mt-10 scroll-mt-32">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive"><AlertTriangle className="h-4 w-4" /></span>
                <h2 className="font-display text-xl font-semibold text-foreground">Watch Out: Exam Traps</h2>
              </div>
              {chap.exam_traps_list && chap.exam_traps_list.length > 0 ? (
                <div className="grid gap-3">
                  {chap.exam_traps_list.map((t, i) => (
                    <div key={i} className="flex gap-3 rounded-xl border-l-4 border-destructive/60 bg-destructive/5 p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">{i + 1}</span>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2 border-destructive/40 text-destructive">⚠ Trap</Badge>
                        <p className="text-sm leading-relaxed text-foreground/90">{t}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-4 text-sm whitespace-pre-line text-foreground/90">{chap.exam_traps}</CardContent>
                </Card>
              )}
            </motion.section>
          )}

          {/* Block 4: Quick Recap */}
          {chap.quick_recap && chap.quick_recap.length > 0 && (
            <motion.section id="block-recap" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mt-10 scroll-mt-32">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"><ListChecks className="h-4 w-4" /></span>
                  <h2 className="font-display text-xl font-semibold text-foreground">Quick Recap</h2>
                </div>
                <span className="text-xs text-muted-foreground">Tap to tick off</span>
              </div>
              <RecapChecklist items={chap.quick_recap} storageKey={`recap-${chap.id}`} />
            </motion.section>
          )}

          {/* Mini Self-Check */}
          {questions.length > 0 && (
            <motion.section id="block-check" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mt-10 scroll-mt-32">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary"><Brain className="h-4 w-4" /></span>
                <h2 className="font-display text-xl font-semibold text-foreground">Test Yourself</h2>
              </div>
              <MiniCheck questions={questions} />
            </motion.section>
          )}

          {/* Glossary bottom */}
          {hasGlossary && (
            <section id="block-glossary" className="mt-10 scroll-mt-32">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Languages className="h-4 w-4" /></span>
                <h2 className="font-display text-xl font-semibold text-foreground">Glossary</h2>
              </div>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {bengaliEntries.map(([en, bn]) => (
                      <div key={en} className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                        <dt className="font-semibold text-foreground">{en}</dt>
                        <dd className="text-muted-foreground">{bn}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Completion / Next chapter */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
            {done ? (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">Chapter complete</p>
                    <p className="text-sm text-muted-foreground">{next ? "Keep the momentum going" : "You've finished the module"}</p>
                  </div>
                </div>
                {next ? (
                  <Button asChild>
                    <Link to={`/partner/academy/${moduleSlug}/${next.slug}`}>
                      Next: {next.title} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to={`/partner/academy/${moduleSlug}/quiz`}><Brain className="h-4 w-4" /> Take module quiz</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">Done reading?</p>
                  <p className="text-sm text-muted-foreground">Mark complete to track progress{next && ` and move to "${next.title}"`}</p>
                </div>
                <Button onClick={markDone} disabled={marking} size="lg">
                  <CheckCircle2 className="h-4 w-4" /> Mark complete
                </Button>
              </div>
            )}
          </motion.div>

          {/* Prev/Next nav */}
          <nav className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
            {prev ? (
              <Link to={`/partner/academy/${moduleSlug}/${prev.slug}`} className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" /> Previous</div>
                <p className="mt-1 font-medium text-foreground group-hover:text-primary">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link to={`/partner/academy/${moduleSlug}/${next.slug}`} className="group rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-primary/50 hover:shadow-sm">
                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next <ArrowRight className="h-3 w-3" /></div>
                <p className="mt-1 font-medium text-foreground group-hover:text-primary">{next.title}</p>
              </Link>
            ) : (
              <Link to={`/partner/academy/${moduleSlug}/quiz`} className="group rounded-xl border border-primary/30 bg-primary/5 p-4 text-right transition-all hover:border-primary hover:shadow-sm">
                <div className="flex items-center justify-end gap-1 text-xs text-primary">Module quiz <Brain className="h-3 w-3" /></div>
                <p className="mt-1 font-medium text-foreground">Take the module quiz</p>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </PartnerLayout>
  );
};

export default AcademyChapter;
