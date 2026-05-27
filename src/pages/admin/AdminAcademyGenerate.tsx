import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertCircle, PlayCircle, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { BIBLE_CHAPTERS } from "@/data/bibleChapters";

type Status = "idle" | "queued" | "running" | "done" | "error";

interface Row {
  slug: string;
  status: Status;
  error?: string;
  mcqs?: number;
  bengali?: number;
  existing?: boolean;
}

const AdminAcademyGenerate = () => {
  const [rows, setRows] = useState<Row[]>(BIBLE_CHAPTERS.map((c) => ({ slug: c.slug, status: "idle" })));
  const [publish, setPublish] = useState(false);
  const [running, setRunning] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("learning_chapters").select("slug").in("slug", BIBLE_CHAPTERS.map((c) => c.slug));
      const existing = new Set((data ?? []).map((r: any) => r.slug));
      setRows((rs) => rs.map((r) => ({ ...r, existing: existing.has(r.slug), status: existing.has(r.slug) ? "done" : "idle" })));
    })();
  }, []);

  const counts = useMemo(() => ({
    total: rows.length,
    done: rows.filter((r) => r.status === "done").length,
    error: rows.filter((r) => r.status === "error").length,
    running: rows.filter((r) => r.status === "running").length,
    queued: rows.filter((r) => r.status === "queued").length,
  }), [rows]);

  const generateOne = async (n: number) => {
    const meta = BIBLE_CHAPTERS[n];
    setRows((rs) => rs.map((r, i) => i === n ? { ...r, status: "running", error: undefined } : r));
    try {
      const { data, error } = await supabase.functions.invoke("generate-bible-chapter", {
        body: {
          slug: meta.slug,
          chapter_number: meta.n,
          title: meta.title,
          module_key: meta.module_key,
          display_order: meta.n,
          publish,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Unknown error");
      setRows((rs) => rs.map((r, i) => i === n ? { ...r, status: "done", mcqs: data.mcqs, bengali: data.bengali_terms, existing: true } : r));
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      setRows((rs) => rs.map((r, i) => i === n ? { ...r, status: "error", error: msg } : r));
      return false;
    }
  };

  const runBatch = async (indices: number[]) => {
    setRunning(true);
    setStopRequested(false);
    setRows((rs) => rs.map((r, i) => indices.includes(i) ? { ...r, status: "queued" } : r));
    let ok = 0, fail = 0;
    for (const i of indices) {
      if (stopRequested) break;
      const success = await generateOne(i);
      success ? ok++ : fail++;
      // small delay to avoid rate limits
      await new Promise((res) => setTimeout(res, 1200));
    }
    setRunning(false);
    toast.success(`Batch finished — ${ok} succeeded, ${fail} failed`);
  };

  const handleGenerateAll = () => runBatch(rows.map((_, i) => i));
  const handleGenerateMissing = () => runBatch(rows.map((r, i) => (!r.existing || r.status === "error") ? i : -1).filter((i) => i >= 0));
  const handleRetryErrors = () => runBatch(rows.map((r, i) => r.status === "error" ? i : -1).filter((i) => i >= 0));

  const progress = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/academy" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Academy
        </Link>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2 mt-2">
          <Sparkles className="h-6 w-6 text-primary" /> AI Chapter Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate each of the 42 NISM V-A chapters using the Content Bible master prompt. Output is saved directly to the database.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Progress</span>
            <span className="text-sm text-muted-foreground">{counts.done} / {counts.total} chapters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch id="pub" checked={publish} onCheckedChange={setPublish} disabled={running} />
              <Label htmlFor="pub">Publish on generate (visible to partners)</Label>
            </div>
            <div className="flex-1" />
            {running ? (
              <Button variant="outline" onClick={() => setStopRequested(true)}>
                <Pause className="h-4 w-4 mr-1" /> Stop after current
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleRetryErrors} disabled={counts.error === 0}>
                  Retry {counts.error} errors
                </Button>
                <Button variant="outline" onClick={handleGenerateMissing}>
                  Generate missing
                </Button>
                <Button onClick={handleGenerateAll}>
                  <PlayCircle className="h-4 w-4 mr-1" /> Generate all 42
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Each chapter takes ~30–60s. Generating all 42 will take roughly 25–40 minutes and consume Lovable AI credits.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Chapters</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {BIBLE_CHAPTERS.map((c, i) => {
              const r = rows[i];
              return (
                <div key={c.slug} className="flex items-center gap-3 rounded border bg-card px-3 py-2 text-sm">
                  <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">{c.n}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      <code className="font-mono">{c.slug}</code> · {c.module_key}
                      {r.mcqs !== undefined && <> · {r.mcqs} MCQs</>}
                      {r.bengali !== undefined && r.bengali > 0 && <> · {r.bengali} Bengali terms</>}
                    </div>
                    {r.error && <div className="text-xs text-destructive mt-0.5">{r.error}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === "running" && <Badge variant="outline" className="gap-1"><Loader2 className="h-3 w-3 animate-spin" />Running</Badge>}
                    {r.status === "queued" && <Badge variant="outline">Queued</Badge>}
                    {r.status === "done" && <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600"><CheckCircle2 className="h-3 w-3" />Done</Badge>}
                    {r.status === "error" && <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Error</Badge>}
                    {r.status === "idle" && r.existing && <Badge variant="secondary">Imported</Badge>}
                    <Button size="sm" variant="outline" disabled={running || r.status === "running"} onClick={() => runBatch([i])}>
                      {r.existing ? "Regenerate" : "Generate"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAcademyGenerate;
