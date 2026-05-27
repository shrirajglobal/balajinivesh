import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Sparkles, Trash2, Loader2, Brain, Pencil, Save, X, Upload, FileJson } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Mod { id: string; slug: string; title: string; subtitle: string | null; description: string | null; total_chapters: number; pass_percentage: number; issues_certificate: boolean; cover_emoji: string | null; is_published: boolean; }
interface Chap { id: string; module_id: string; slug: string; title: string; summary: string | null; content_markdown: string; estimated_minutes: number; display_order: number; is_published: boolean; exam_traps: string | null; }
interface Q { id: string; module_id: string; chapter_id: string | null; question: string; options: string[]; correct_index: number; explanation: string | null; difficulty: string; is_active: boolean; }

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const AdminAcademy = () => {
  const [modules, setModules] = useState<Mod[]>([]);
  const [activeMod, setActiveMod] = useState<Mod | null>(null);
  const [chapters, setChapters] = useState<Chap[]>([]);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChap, setEditingChap] = useState<Chap | null>(null);
  const [editingQ, setEditingQ] = useState<Q | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiKind, setAiKind] = useState<"chapter" | "questions">("chapter");
  const [aiCount, setAiCount] = useState(5);
  const [aiBusy, setAiBusy] = useState(false);

  const loadModules = async () => {
    const { data } = await supabase.from("learning_modules").select("*").order("display_order");
    setModules((data as any) ?? []);
    if (!activeMod && data?.length) setActiveMod(data[0] as any);
    setLoading(false);
  };

  const loadModuleContent = async (m: Mod) => {
    const [{ data: c }, { data: q }] = await Promise.all([
      supabase.from("learning_chapters").select("*").eq("module_id", m.id).order("display_order"),
      supabase.from("quiz_questions").select("*").eq("module_id", m.id).order("created_at"),
    ]);
    setChapters((c as any) ?? []);
    setQuestions(((q as any) ?? []).map((x: any) => ({ ...x, options: Array.isArray(x.options) ? x.options : (x.options?.options ?? []) })));
  };

  useEffect(() => { loadModules(); }, []);
  useEffect(() => { if (activeMod) loadModuleContent(activeMod); }, [activeMod?.id]);

  // ----- Chapter CRUD -----
  const newChapter = () => {
    if (!activeMod) return;
    setEditingChap({
      id: "", module_id: activeMod.id, slug: "", title: "", summary: "",
      content_markdown: "", estimated_minutes: 8,
      display_order: chapters.length, is_published: true, exam_traps: "",
    });
  };

  const saveChapter = async () => {
    if (!editingChap || !activeMod) return;
    const payload: any = {
      module_id: activeMod.id,
      slug: editingChap.slug || slugify(editingChap.title),
      title: editingChap.title,
      summary: editingChap.summary,
      content_markdown: editingChap.content_markdown,
      estimated_minutes: editingChap.estimated_minutes,
      display_order: editingChap.display_order,
      is_published: editingChap.is_published,
      exam_traps: editingChap.exam_traps,
    };
    if (!payload.title) return toast.error("Title required");
    let error;
    if (editingChap.id) {
      ({ error } = await supabase.from("learning_chapters").update(payload).eq("id", editingChap.id));
    } else {
      ({ error } = await supabase.from("learning_chapters").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success("Chapter saved");
    setEditingChap(null);
    loadModuleContent(activeMod);
    loadModules();
  };

  const deleteChapter = async (c: Chap) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    const { error } = await supabase.from("learning_chapters").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    if (activeMod) { loadModuleContent(activeMod); loadModules(); }
  };

  // ----- Question CRUD -----
  const newQuestion = () => {
    if (!activeMod) return;
    setEditingQ({
      id: "", module_id: activeMod.id, chapter_id: null,
      question: "", options: ["", "", "", ""], correct_index: 0,
      explanation: "", difficulty: "medium", is_active: true,
    });
  };

  const saveQuestion = async () => {
    if (!editingQ || !activeMod) return;
    if (!editingQ.question.trim()) return toast.error("Question text required");
    if (editingQ.options.some((o) => !o.trim())) return toast.error("All four options required");
    const payload: any = {
      module_id: activeMod.id,
      chapter_id: editingQ.chapter_id,
      question: editingQ.question,
      options: editingQ.options,
      correct_index: editingQ.correct_index,
      explanation: editingQ.explanation,
      difficulty: editingQ.difficulty,
      is_active: editingQ.is_active,
    };
    let error;
    if (editingQ.id) {
      ({ error } = await supabase.from("quiz_questions").update(payload).eq("id", editingQ.id));
    } else {
      ({ error } = await supabase.from("quiz_questions").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success("Question saved");
    setEditingQ(null);
    loadModuleContent(activeMod);
  };

  const deleteQuestion = async (q: Q) => {
    if (!confirm("Delete this question?")) return;
    const { error } = await supabase.from("quiz_questions").delete().eq("id", q.id);
    if (error) return toast.error(error.message);
    if (activeMod) loadModuleContent(activeMod);
  };

  // ----- AI generation -----
  const runAi = async () => {
    if (!activeMod || !aiTopic.trim()) return;
    setAiBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-academy-content", {
        body: {
          module_id: activeMod.id,
          module_title: activeMod.title,
          topic: aiTopic.trim(),
          kind: aiKind,
          count: aiCount,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "AI generation failed");
      toast.success(aiKind === "chapter" ? "Chapter draft created" : `${data.created ?? 0} questions created`);
      setAiOpen(false); setAiTopic("");
      loadModuleContent(activeMod);
      loadModules();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6" /> Partner Academy
          </h1>
          <p className="text-sm text-muted-foreground">Modules, chapters and quizzes for the learning university.</p>
        </div>
      </div>

      {/* Module picker */}
      <div className="flex flex-wrap gap-2">
        {modules.map((m) => (
          <Button
            key={m.id}
            variant={activeMod?.id === m.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMod(m)}
          >
            <span className="mr-1.5">{m.cover_emoji}</span>{m.title}
            <Badge variant="secondary" className="ml-2">{m.total_chapters}c</Badge>
          </Button>
        ))}
      </div>

      {activeMod && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-semibold">{activeMod.title}</p>
                <p className="text-xs text-muted-foreground">Pass mark {activeMod.pass_percentage}% · {activeMod.issues_certificate ? "Issues certificate" : "No certificate"}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setAiOpen(true)}>
                  <Sparkles className="h-4 w-4" /> AI Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeMod && (
        <Tabs defaultValue="chapters">
          <TabsList>
            <TabsTrigger value="chapters">Chapters ({chapters.length})</TabsTrigger>
            <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="mt-4 space-y-2">
            <div className="flex justify-end">
              <Button size="sm" onClick={newChapter}><Plus className="h-4 w-4" /> Add Chapter</Button>
            </div>
            {chapters.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No chapters yet.</p>}
            {chapters.map((c) => (
              <Card key={c.id} className="border-border/60">
                <CardContent className="flex items-center gap-3 p-3">
                  <Badge variant="secondary" className="w-8 justify-center">{c.display_order + 1}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{c.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.summary}</p>
                  </div>
                  {!c.is_published && <Badge variant="outline">Hidden</Badge>}
                  <Button size="sm" variant="outline" onClick={() => setEditingChap(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" onClick={() => deleteChapter(c)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="questions" className="mt-4 space-y-2">
            <div className="flex justify-end">
              <Button size="sm" onClick={newQuestion}><Plus className="h-4 w-4" /> Add Question</Button>
            </div>
            {questions.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No questions yet.</p>}
            {questions.map((q) => (
              <Card key={q.id} className="border-border/60">
                <CardContent className="flex items-start gap-3 p-3">
                  <Brain className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{q.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-1 text-xs">{q.difficulty}</Badge>
                      Correct: {String.fromCharCode(65 + q.correct_index)} · {q.options[q.correct_index]?.slice(0, 60)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setEditingQ(q)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" onClick={() => deleteQuestion(q)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      {/* AI generate dialog */}
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>AI Generate</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>What to generate</Label>
              <Select value={aiKind} onValueChange={(v: any) => setAiKind(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="chapter">A chapter</SelectItem>
                  <SelectItem value="questions">Quiz questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Topic / syllabus area</Label>
              <Input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Open-ended vs close-ended schemes" />
            </div>
            {aiKind === "questions" && (
              <div>
                <Label>How many questions</Label>
                <Input type="number" min={1} max={20} value={aiCount} onChange={(e) => setAiCount(parseInt(e.target.value || "5", 10))} />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Generated content is saved as a draft for your review and can be edited before publishing.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiOpen(false)}>Cancel</Button>
            <Button onClick={runAi} disabled={aiBusy || !aiTopic.trim()}>
              {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chapter editor */}
      <Dialog open={!!editingChap} onOpenChange={(o) => !o && setEditingChap(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingChap?.id ? "Edit Chapter" : "New Chapter"}</DialogTitle></DialogHeader>
          {editingChap && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={editingChap.title} onChange={(e) => setEditingChap({ ...editingChap, title: e.target.value, slug: editingChap.slug || slugify(e.target.value) })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editingChap.slug} onChange={(e) => setEditingChap({ ...editingChap, slug: slugify(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label>Summary (1 line)</Label>
                <Input value={editingChap.summary ?? ""} onChange={(e) => setEditingChap({ ...editingChap, summary: e.target.value })} />
              </div>
              <div>
                <Label>Content (Markdown)</Label>
                <Textarea rows={12} value={editingChap.content_markdown} onChange={(e) => setEditingChap({ ...editingChap, content_markdown: e.target.value })} />
              </div>
              <div>
                <Label>Common Exam Traps</Label>
                <Textarea rows={3} value={editingChap.exam_traps ?? ""} onChange={(e) => setEditingChap({ ...editingChap, exam_traps: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Reading minutes</Label>
                  <Input type="number" value={editingChap.estimated_minutes} onChange={(e) => setEditingChap({ ...editingChap, estimated_minutes: parseInt(e.target.value || "8", 10) })} />
                </div>
                <div>
                  <Label>Order</Label>
                  <Input type="number" value={editingChap.display_order} onChange={(e) => setEditingChap({ ...editingChap, display_order: parseInt(e.target.value || "0", 10) })} />
                </div>
                <div>
                  <Label>Published</Label>
                  <Select value={editingChap.is_published ? "yes" : "no"} onValueChange={(v) => setEditingChap({ ...editingChap, is_published: v === "yes" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No (hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingChap(null)}><X className="h-4 w-4" /> Cancel</Button>
            <Button onClick={saveChapter}><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question editor */}
      <Dialog open={!!editingQ} onOpenChange={(o) => !o && setEditingQ(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingQ?.id ? "Edit Question" : "New Question"}</DialogTitle></DialogHeader>
          {editingQ && (
            <div className="space-y-3">
              <div>
                <Label>Question</Label>
                <Textarea rows={2} value={editingQ.question} onChange={(e) => setEditingQ({ ...editingQ, question: e.target.value })} />
              </div>
              {editingQ.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={editingQ.correct_index === i}
                    onChange={() => setEditingQ({ ...editingQ, correct_index: i })}
                    className="h-4 w-4"
                  />
                  <span className="w-5 text-sm font-medium text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const opts = [...editingQ.options];
                      opts[i] = e.target.value;
                      setEditingQ({ ...editingQ, options: opts });
                    }}
                  />
                </div>
              ))}
              <div>
                <Label>Explanation (shown after answer)</Label>
                <Textarea rows={3} value={editingQ.explanation ?? ""} onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Difficulty</Label>
                  <Select value={editingQ.difficulty} onValueChange={(v) => setEditingQ({ ...editingQ, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["easy", "medium", "hard"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Linked chapter (optional)</Label>
                  <Select value={editingQ.chapter_id ?? "none"} onValueChange={(v) => setEditingQ({ ...editingQ, chapter_id: v === "none" ? null : v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No chapter</SelectItem>
                      {chapters.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQ(null)}><X className="h-4 w-4" /> Cancel</Button>
            <Button onClick={saveQuestion}><Save className="h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAcademy;
