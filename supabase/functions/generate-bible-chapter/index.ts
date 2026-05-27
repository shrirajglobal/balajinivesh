import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a senior NISM-certified mentor authoring the official Partner Academy chapter for an AMFI-registered Mutual Fund Distributor (Balaji Nivesh, West Bengal). You write to the NISM V-A Content Bible v1.0 (FY 2024-25) standard.

ABSOLUTE RULES (non-negotiable):
1. Frame as Mutual Fund DISTRIBUTOR, never Adviser. Never use "investment advice", "guaranteed returns", "risk-free", "best fund", "buy now", "sell now", "capital protection".
2. Use FY 2024-25 tax rules (post-July 2024 Budget). Equity STCG = 20%, Equity LTCG = 12.5% above ₹1.25 lakh, Debt funds = slab rate (no indexation post 1 Apr 2023). STT 0.1% on equity MF redemption.
3. Cite generic categories only — never specific AMC or scheme names.
4. INR amounts in Indian numbering: ₹1,00,000 not ₹100,000.
5. Tone: knowledgeable senior colleague to a motivated NISM candidate. Class 12 reading level. Short sentences. Concrete examples.
6. Reference SEBI MF Regulations / AMFI guidelines where relevant.

OUTPUT — use the create_chapter tool with EXACTLY this structure:

- plain_english: 100–180 words. ≤3 sentences per paragraph. Explain the concept like a teacher.
- real_world: 80–150 words. ONE concrete example with INR figures showing how this applies to a real Indian investor/distributor.
- exam_traps: array of 3–5 items, each 20–60 words. Each MUST start with "Trap:", "Watch:", or "Common error:" and state BOTH the wrong belief AND the correct fact. At least one must reference a number (date, %, threshold).
- quick_recap: array of 4–6 bullets, each ≤15 words, starting with action verb or key noun.
- mcqs: EXACTLY 5 items in ratio 1 easy + 3 medium + 1 hard. Each NISM-style:
    * question ends with "?", ≤200 chars
    * options: exactly 4, each 5–80 chars, plausible distractors (no "all/none of the above" unless unavoidable)
    * correct_index: 0–3
    * explanation: 60–150 words. Must explain WHY correct is right AND why the most attractive wrong option is wrong. Cite NISM/SEBI concept.
    * difficulty: "easy" | "medium" | "hard"
- bengali_glossary: array of 5–8 entries. Format { term: "English Term", definition: "বাংলা definition 30–80 words" }. REQUIRED for chapters 1–10, optional for 11–42.

Never include markdown headings in any field. Plain prose only.`;

interface Body {
  slug: string;
  chapter_number: number;
  title: string;
  module_key: string;
  display_order: number;
  publish?: boolean;
}

const chapterSchema = {
  type: "object",
  properties: {
    plain_english: { type: "string" },
    real_world: { type: "string" },
    exam_traps: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    quick_recap: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 6 },
    mcqs: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
          correct_index: { type: "integer", minimum: 0, maximum: 3 },
          explanation: { type: "string" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
        },
        required: ["question", "options", "correct_index", "explanation", "difficulty"],
        additionalProperties: false,
      },
    },
    bengali_glossary: {
      type: "array",
      items: {
        type: "object",
        properties: { term: { type: "string" }, definition: { type: "string" } },
        required: ["term", "definition"],
        additionalProperties: false,
      },
    },
  },
  required: ["plain_english", "real_world", "exam_traps", "quick_recap", "mcqs"],
  additionalProperties: false,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = (await req.json()) as Body;
    if (!body.slug || !body.title || !body.module_key || !body.chapter_number) {
      return new Response(JSON.stringify({ success: false, error: "slug, title, module_key, chapter_number required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const needsBengali = body.chapter_number <= 10;
    const userPrompt = `Write Chapter ${body.chapter_number} of the NISM V-A Partner Academy.

slug: ${body.slug}
title: ${body.title}
module_key: ${body.module_key}
chapter_number: ${body.chapter_number}
bengali_glossary required: ${needsBengali ? "YES (5–8 entries)" : "OPTIONAL — include 3–5 entries if natural"}

Generate the chapter now using the create_chapter tool. Follow ALL rules in the system prompt exactly.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_chapter",
            description: "Return one complete NISM V-A chapter conforming to the Bible schema.",
            parameters: chapterSchema,
          },
        }],
        tool_choice: { type: "function", function: { name: "create_chapter" } },
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      if (r.status === 429) throw new Error("AI rate limited — try again in a moment");
      if (r.status === 402) throw new Error("AI credits exhausted — top up in Settings → Workspace → Usage");
      throw new Error(`AI error ${r.status}: ${txt.slice(0, 300)}`);
    }
    const aiJson = await r.json();
    const tc = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) throw new Error("AI returned no tool call");
    const ch = JSON.parse(tc.function.arguments);

    // Lookup module
    const { data: mod, error: modErr } = await supabase
      .from("learning_modules").select("id").eq("module_key", body.module_key).maybeSingle();
    if (modErr || !mod) throw new Error(`Module not found for key '${body.module_key}'`);

    const exam_traps_list: string[] = ch.exam_traps ?? [];
    const quick_recap: string[] = ch.quick_recap ?? [];
    const glossaryArr: { term: string; definition: string }[] = ch.bengali_glossary ?? [];
    const bengali_glossary: Record<string, string> = {};
    glossaryArr.forEach((e) => { if (e?.term) bengali_glossary[e.term] = e.definition ?? ""; });

    const content_markdown = [
      `## Plain English\n\n${ch.plain_english}`,
      `## Real-World Application\n\n${ch.real_world}`,
      `## Exam Traps\n\n${exam_traps_list.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
      `## Quick Recap\n\n${quick_recap.map((r) => `- ${r}`).join("\n")}`,
    ].join("\n\n");

    const summary = ch.plain_english.split(/[.!?]/)[0]?.slice(0, 180) ?? null;

    const chapterPayload: any = {
      module_id: mod.id,
      slug: body.slug,
      title: body.title,
      summary,
      chapter_number: body.chapter_number,
      module_key: body.module_key,
      display_order: body.display_order - 1,
      plain_english: ch.plain_english,
      real_world: ch.real_world,
      quick_recap,
      exam_traps_list,
      exam_traps: exam_traps_list.map((t, i) => `${i + 1}. ${t}`).join("\n"),
      content_markdown,
      bengali_glossary,
      last_updated: new Date().toISOString().slice(0, 10),
      estimated_minutes: 10,
      is_published: body.publish ?? false,
    };

    const { data: existing } = await supabase
      .from("learning_chapters").select("id").eq("slug", body.slug).maybeSingle();

    let chapterId: string;
    if (existing) {
      const { error } = await supabase.from("learning_chapters").update(chapterPayload).eq("id", existing.id);
      if (error) throw error;
      chapterId = existing.id;
    } else {
      const { data: ins, error } = await supabase.from("learning_chapters").insert(chapterPayload).select("id").single();
      if (error) throw error;
      chapterId = ins.id;
    }

    await supabase.from("quiz_questions").delete().eq("chapter_id", chapterId);
    const mcqRows = (ch.mcqs ?? []).map((q: any) => ({
      module_id: mod.id,
      chapter_id: chapterId,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
      is_active: body.publish ?? false,
    }));
    if (mcqRows.length > 0) {
      const { error: mErr } = await supabase.from("quiz_questions").insert(mcqRows);
      if (mErr) throw mErr;
    }

    return new Response(JSON.stringify({
      success: true,
      chapter_id: chapterId,
      slug: body.slug,
      mcqs: mcqRows.length,
      bengali_terms: glossaryArr.length,
      exam_traps: exam_traps_list.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-bible-chapter error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
