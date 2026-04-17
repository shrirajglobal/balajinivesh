import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Award, BookOpen, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Module {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_emoji: string | null;
  total_chapters: number;
  pass_percentage: number;
  issues_certificate: boolean;
  display_order: number;
}

interface Progress {
  module_id: string;
  chapters_completed: number;
  best_quiz_score_pct: number | null;
  completed_at: string | null;
}

const Academy = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [certs, setCerts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: mods }, { data: prog }, { data: certRows }] = await Promise.all([
        supabase.from("learning_modules").select("*").eq("is_published", true).order("display_order"),
        user ? supabase.from("partner_module_progress").select("module_id, chapters_completed, best_quiz_score_pct, completed_at").eq("user_id", user.id) : Promise.resolve({ data: [] as any[] }),
        user ? supabase.from("learning_certificates").select("module_id").eq("user_id", user.id) : Promise.resolve({ data: [] as any[] }),
      ]);
      setModules((mods as any) ?? []);
      const map: Record<string, Progress> = {};
      ((prog as any) ?? []).forEach((p: Progress) => { map[p.module_id] = p; });
      setProgress(map);
      setCerts(new Set(((certRows as any) ?? []).map((c: any) => c.module_id)));
      setLoading(false);
    })();
  }, [user]);

  const overall = modules.length === 0 ? 0 :
    Math.round(
      modules.reduce((acc, m) => {
        const p = progress[m.id];
        if (!p || m.total_chapters === 0) return acc;
        return acc + Math.min(100, (p.chapters_completed / m.total_chapters) * 100);
      }, 0) / modules.length,
    );

  return (
    <PartnerLayout>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-light text-secondary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Partner University</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Mentor-style training to help you ace NISM, master products, and grow your practice.</p>
        </div>
        <Card className="min-w-[220px] border-primary/20">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall Progress</p>
            <p className="mt-1 font-display text-3xl font-bold text-foreground">{overall}%</p>
            <Progress value={overall} className="mt-2 h-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">{certs.size} certificate{certs.size === 1 ? "" : "s"} earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        {!loading && modules.map((m, i) => {
          const p = progress[m.id];
          const completed = p?.chapters_completed ?? 0;
          const pct = m.total_chapters > 0 ? Math.min(100, Math.round((completed / m.total_chapters) * 100)) : 0;
          const hasCert = certs.has(m.id);
          const noChapters = m.total_chapters === 0;

          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group relative h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{m.cover_emoji ?? "📘"}</span>
                    <div className="flex flex-col items-end gap-1">
                      {hasCert && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">
                          <Award className="h-3 w-3 mr-1" /> Certified
                        </Badge>
                      )}
                      {m.issues_certificate && !hasCert && (
                        <Badge variant="secondary" className="text-xs"><Award className="h-3 w-3 mr-1" />Certificate</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">{m.title}</h3>
                    {m.subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{m.subtitle}</p>}
                  </div>
                  <p className="text-sm text-foreground/80 line-clamp-2">{m.description}</p>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{m.total_chapters} chapter{m.total_chapters === 1 ? "" : "s"}</span>
                      <span>{pct}% complete</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                    {noChapters ? (
                      <button disabled className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" /> Coming soon
                      </button>
                    ) : (
                      <Link
                        to={`/partner/academy/${m.slug}`}
                        className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                      >
                        {pct === 0 ? "Start" : pct === 100 ? "Review" : "Continue"} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PartnerLayout>
  );
};

export default Academy;
