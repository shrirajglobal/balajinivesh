import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertTriangle, FileJson } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ChapterJSON {
  slug: string;
  chapter_number: number;
  title: string;
  module_key: string;
  display_order: number;
  plain_english: string;
  real_world: string;
  exam_traps: string[];
  quick_recap: string[];
  mcqs: Array<{
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
  }>;
  bengali_glossary?: Array<{ term: string; definition: string }> | Record<string, string>;
  last_updated?: string;
  summary?: string;
  estimated_minutes?: number;
}

interface ValidationIssue { chapter: string; field: string; message: string; }

const REQUIRED_FIELDS: (keyof ChapterJSON)[] = [
  "slug", "chapter_number", "title", "module_key", "display_order",
  "plain_english", "real_world", "exam_traps", "quick_recap", "mcqs",
];

const validateChapter = (c: any, idx: number): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const label = c?.slug || `chapter[${idx}]`;
  for (const f of REQUIRED_FIELDS) {
    if (c[f] === undefined || c[f] === null) issues.push({ chapter: label, field: f as string, message: "missing" });
  }
  if (Array.isArray(c.mcqs) && c.mcqs.length !== 5) issues.push({ chapter: label, field: "mcqs", message: `expected exactly 5, got ${c.mcqs.length}` });
  if (Array.isArray(c.mcqs)) {
    c.mcqs.forEach((q: any, qi: number) => {
      if (!Array.isArray(q.options) || q.options.length !== 4) issues.push({ chapter: label, field: `mcqs[${qi}].options`, message: "must have exactly 4 options" });
      if (typeof q.correct_index !== "number" || q.correct_index < 0 || q.correct_index > 3) issues.push({ chapter: label, field: `mcqs[${qi}].correct_index`, message: "must be 0-3" });
      if (!["easy", "medium", "hard"].includes(q.difficulty)) issues.push({ chapter: label, field: `mcqs[${qi}].difficulty`, message: "must be easy/medium/hard" });
    });
  }
  if (Array.isArray(c.exam_traps) && (c.exam_traps.length < 3 || c.exam_traps.length > 5)) issues.push({ chapter: label, field: "exam_traps", message: `expected 3-5 items, got ${c.exam_traps.length}` });
  if (Array.isArray(c.quick_recap) && (c.quick_recap.length < 4 || c.quick_recap.length > 6)) issues.push({ chapter: label, field: "quick_recap", message: `expected 4-6 items, got ${c.quick_recap.length}` });
  return issues;
};

const normalizeGlossary = (g: ChapterJSON["bengali_glossary"]): Record<string, string> => {
  if (!g) return {};
  if (Array.isArray(g)) {
    const out: Record<string, string> = {};
    g.forEach((e) => { if (e?.term) out[e.term] = e.definition ?? ""; });
    return out;
  }
  return g;
};

const AdminAcademyImport = () => {
  const [json, setJson] = useState("");
  const [parsed, setParsed] = useState<ChapterJSON[] | null>(null);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [modules, setModules] = useState<{ id: string; module_key: string; title: string }[]>([]);
  const [publish, setPublish] = useState(true);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ inserted: number; updated: number; mcqs: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("learning_modules").select("id, module_key, title").not("module_key", "is", null);
      setModules((data as any) ?? []);
    })();
  }, []);

  const handleParse = () => {
    setResult(null);
    try {
      const data = JSON.parse(json);
      const arr: ChapterJSON[] = Array.isArray(data) ? data : data.chapters;
      if (!Array.isArray(arr)) throw new Error("Expected an array of chapters (or { chapters: [...] }).");
      const allIssues: ValidationIssue[] = [];
      arr.forEach((c, i) => allIssues.push(...validateChapter(c, i)));
      // Unknown module keys
      const known = new Set(modules.map((m) => m.module_key));
      arr.forEach((c) => {
        if (c.module_key && !known.has(c.module_key)) {
          allIssues.push({ chapter: c.slug, field: "module_key", message: `unknown module_key '${c.module_key}'` });
        }
      });
      setParsed(arr);
      setIssues(allIssues);
      if (allIssues.length === 0) toast.success(`${arr.length} chapters validated — ready to import`);
      else toast.warning(`${allIssues.length} validation issue(s) found`);
    } catch (e) {
      setParsed(null);
      setIssues([]);
      toast.error(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    setJson(text);
    setTimeout(handleParse, 0);
  };

  const runImport = async () => {
    if (!parsed || issues.length > 0) return;
    setImporting(true);
    let inserted = 0, updated = 0, mcqCount = 0;
    try {
      const modMap = new Map(modules.map((m) => [m.module_key, m.id]));
      for (const c of parsed) {
        const module_id = modMap.get(c.module_key);
        if (!module_id) continue;

        const summary = c.summary ?? c.plain_english.split(/[.!?]/)[0]?.slice(0, 180) ?? null;
        const content_markdown = [
          `## Core Concept\n\n${c.plain_english}`,
          `## Real-World Application\n\n${c.real_world}`,
          `## Exam Traps\n\n${c.exam_traps.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
          `## Quick Recap\n\n${c.quick_recap.map((r) => `- ${r}`).join("\n")}`,
        ].join("\n\n");

        const chapterPayload: any = {
          module_id,
          slug: c.slug,
          title: c.title,
          summary,
          chapter_number: c.chapter_number,
          module_key: c.module_key,
          display_order: c.display_order - 1, // bible is 1-based, table is 0-based
          plain_english: c.plain_english,
          real_world: c.real_world,
          quick_recap: c.quick_recap,
          exam_traps_list: c.exam_traps,
          exam_traps: c.exam_traps.map((t, i) => `${i + 1}. ${t}`).join("\n"),
          content_markdown,
          bengali_glossary: normalizeGlossary(c.bengali_glossary),
          last_updated: c.last_updated ?? null,
          estimated_minutes: c.estimated_minutes ?? 8,
          is_published: publish,
        };

        const { data: existing } = await supabase
          .from("learning_chapters").select("id").eq("slug", c.slug).maybeSingle();

        let chapterId: string;
        if (existing) {
          const { error } = await supabase.from("learning_chapters").update(chapterPayload).eq("id", existing.id);
          if (error) throw error;
          chapterId = existing.id;
          updated++;
        } else {
          const { data: ins, error } = await supabase.from("learning_chapters").insert(chapterPayload).select("id").single();
          if (error) throw error;
          chapterId = ins.id;
          inserted++;
        }

        // Replace MCQs for this chapter
        await supabase.from("quiz_questions").delete().eq("chapter_id", chapterId);
        const mcqRows = c.mcqs.map((q) => ({
          module_id,
          chapter_id: chapterId,
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          explanation: q.explanation,
          difficulty: q.difficulty,
          is_active: publish,
        }));
        const { error: mErr } = await supabase.from("quiz_questions").insert(mcqRows);
        if (mErr) throw mErr;
        mcqCount += mcqRows.length;
      }
      setResult({ inserted, updated, mcqs: mcqCount });
      toast.success(`Imported ${inserted + updated} chapters, ${mcqCount} questions`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/academy" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Academy
          </Link>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2 mt-2">
            <FileJson className="h-6 w-6" /> Bulk Import Chapters
          </h1>
          <p className="text-sm text-muted-foreground">Paste a <code>chapters.json</code> array conforming to the NISM V-A Content Bible schema.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">1. Paste or upload chapters.json</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            className="text-sm"
          />
          <Textarea
            rows={10}
            placeholder='[{ "slug": "investment-landscape-introduction", "chapter_number": 1, ... }]'
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="font-mono text-xs"
          />
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!json.trim()}>Validate</Button>
            <Button variant="outline" onClick={() => { setJson(""); setParsed(null); setIssues([]); setResult(null); }}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      {parsed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              2. Validation
              {issues.length === 0
                ? <Badge variant="default" className="bg-emerald-600"><CheckCircle2 className="h-3 w-3 mr-1" />{parsed.length} chapters OK</Badge>
                : <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{issues.length} issues</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">All chapters passed schema checks. Module mapping:</p>
                <ul className="text-xs space-y-0.5">
                  {Object.entries(parsed.reduce<Record<string, number>>((acc, c) => { acc[c.module_key] = (acc[c.module_key] || 0) + 1; return acc; }, {})).map(([k, n]) => (
                    <li key={k}><Badge variant="outline" className="mr-1.5">{n}</Badge>{k}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded border border-destructive/30 bg-destructive/5 p-3 text-xs">
                {issues.map((i, idx) => (
                  <div key={idx} className="py-0.5"><span className="font-mono text-destructive">{i.chapter}</span> · <span className="font-medium">{i.field}</span>: {i.message}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {parsed && issues.length === 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">3. Import</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch id="publish" checked={publish} onCheckedChange={setPublish} />
              <Label htmlFor="publish">Publish immediately (visible to partners)</Label>
            </div>
            <p className="text-xs text-muted-foreground">Existing chapters with the same slug will be updated. MCQs linked to each chapter are replaced.</p>
            <Button onClick={runImport} disabled={importing} size="lg">
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Import {parsed.length} chapters
            </Button>
            {result && (
              <div className="rounded border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 inline mr-1 text-emerald-600" />
                {result.inserted} inserted, {result.updated} updated, {result.mcqs} MCQs loaded.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAcademyImport;
