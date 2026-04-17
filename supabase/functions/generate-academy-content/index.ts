import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHAPTER_PROMPT = `You are a senior NISM-certified mentor for an AMFI-registered Mutual Fund Distributor in West Bengal. You write training material for distributor candidates preparing for NISM Series V-A, learning product knowledge, sales conversations, or compliance.

STRICT RULES:
1. NEVER use: "guaranteed", "best fund", "buy now", "sell now", "risk-free", or any specific scheme/AMC names as recommendations.
2. Educational tone, Class-10 reading level. Use Hindi/Bengali analogies where they help understanding.
3. Always frame the firm as a Distributor, not an Adviser.
4. Include practical examples and a "Common Exam Traps" section.

Use the create_chapter tool to return:
- title: short, exam-aligned (40-70 chars)
- slug: kebab-case, max 60 chars
- summary: 1 line (80-120 chars)
- content_markdown: 600-1200 word Markdown chapter with H2/H3, short paragraphs, bullet lists, at least one worked numerical example, and a "Quick Recap" bullet list at the end. NEVER include the exam-traps section here — that goes in its own field.
- exam_traps: 60-150 words listing 3-5 commonly confused points, often phrased as "Candidates often mark X but the correct answer is Y because..."
- estimated_minutes: integer 5-15`;

const QUESTIONS_PROMPT = `You are a NISM Series V-A question writer. Generate practice MCQs that match the actual exam in style and difficulty.

STRICT RULES:
1. NEVER name specific schemes, AMCs, or stocks.
2. Each MCQ must have exactly 4 plausible options.
3. Avoid "all of the above" / "none of the above" unless absolutely necessary.
4. Mix difficulty (easy/medium/hard).
5. Provide a 1-2 sentence explanation for each answer.

Use the create_questions tool to return an array of MCQs.`;

interface Body {
  module_id: string;
  module_title: string;
  topic: string;
  kind: "chapter" | "questions";
  count?: number;
  chapter_id?: string;
}

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = (await req.json()) as Body;
    if (!body.module_id || !body.topic?.trim() || !body.kind) {
      return new Response(JSON.stringify({ success: false, error: "module_id, topic, kind required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (body.kind === "chapter") {
      const userPrompt = `Module: ${body.module_title}\nTopic: ${body.topic}\n\nWrite this chapter using the create_chapter tool.`;
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: CHAPTER_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "create_chapter",
              description: "Return a complete training chapter.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  slug: { type: "string" },
                  summary: { type: "string" },
                  content_markdown: { type: "string" },
                  exam_traps: { type: "string" },
                  estimated_minutes: { type: "integer" },
                },
                required: ["title", "slug", "summary", "content_markdown", "exam_traps", "estimated_minutes"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "create_chapter" } },
        }),
      });

      if (!r.ok) {
        const txt = await r.text();
        if (r.status === 429) throw new Error("AI rate limited");
        if (r.status === 402) throw new Error("AI credits exhausted");
        throw new Error(`AI error ${r.status}: ${txt.slice(0, 300)}`);
      }
      const aiJson = await r.json();
      const tc = aiJson.choices?.[0]?.message?.tool_calls?.[0];
      if (!tc) throw new Error("AI did not return a chapter");
      const ch = JSON.parse(tc.function.arguments);

      // Ensure unique slug within module
      let slug = ch.slug || slugify(ch.title);
      let n = 1;
      while (true) {
        const { data: ex } = await supabase.from("learning_chapters").select("id").eq("module_id", body.module_id).eq("slug", slug).maybeSingle();
        if (!ex) break;
        n += 1; slug = `${ch.slug}-${n}`;
      }

      // Determine display order
      const { count } = await supabase.from("learning_chapters").select("id", { count: "exact", head: true }).eq("module_id", body.module_id);

      const { data: inserted, error } = await supabase.from("learning_chapters").insert({
        module_id: body.module_id,
        slug,
        title: ch.title,
        summary: ch.summary,
        content_markdown: ch.content_markdown,
        exam_traps: ch.exam_traps,
        estimated_minutes: ch.estimated_minutes ?? 8,
        display_order: count ?? 0,
        is_published: false, // draft for admin review
      }).select().single();
      if (error) throw error;

      return new Response(JSON.stringify({ success: true, chapter_id: inserted.id, slug }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---------- questions ----------
    const count = Math.max(1, Math.min(20, body.count ?? 5));
    const userPrompt = `Module: ${body.module_title}\nTopic: ${body.topic}\nGenerate exactly ${count} MCQs using the create_questions tool.`;
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: QUESTIONS_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_questions",
            description: "Return an array of MCQs.",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
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
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_questions" } },
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      if (r.status === 429) throw new Error("AI rate limited");
      if (r.status === 402) throw new Error("AI credits exhausted");
      throw new Error(`AI error ${r.status}: ${txt.slice(0, 300)}`);
    }
    const aiJson = await r.json();
    const tc = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) throw new Error("AI did not return questions");
    const out = JSON.parse(tc.function.arguments);
    const qs: any[] = (out.questions ?? []).slice(0, count).map((q: any) => ({
      module_id: body.module_id,
      chapter_id: body.chapter_id ?? null,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
      is_active: true,
    }));
    if (qs.length === 0) throw new Error("No questions returned");

    const { error } = await supabase.from("quiz_questions").insert(qs);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, created: qs.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-academy-content error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
