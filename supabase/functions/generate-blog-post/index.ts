import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  topic: string;
  category_id?: string | null;
  audience?: "investor" | "partner";
  scheduled_for?: string | null;
  cron?: boolean; // when invoked by cron job
}

const SYSTEM_PROMPT = `You are a senior content strategist for an AMFI-registered Mutual Fund Distributor in West Bengal, India. Your job is to write SEO-optimised, compliance-safe educational articles for everyday Indian investors and aspiring distributors.

STRICT RULES:
1. NEVER use the words: "guaranteed", "assured returns", "best fund", "top mutual fund", "risk-free", "double your money".
2. NEVER name specific mutual fund schemes, AMCs by recommendation, or stock tickers.
3. NEVER give investment advice. You may explain concepts, processes, taxation, and frameworks.
4. Always frame the firm as a Distributor (not Adviser).
5. Use simple Class-10 reading level. Hindi/Bengali analogies welcome where natural.
6. End with a "What to do next" section that points the reader to a calculator, education module, or to "consult a SEBI-registered investment adviser for personal advice".
7. Embed a SEBI risk disclaimer paragraph naturally before the conclusion.

OUTPUT FORMAT (call the create_blog_post tool):
- title: 50-65 chars, includes the primary keyword
- slug: kebab-case, max 60 chars
- excerpt: 140-160 chars, plain summary
- content: 900-1500 word Markdown article. Use H2/H3, short paragraphs, bullet lists, and at least one numbered example. Include a "Quick Recap" bulleted list near the end.
- meta_title: 50-60 chars
- meta_description: 140-160 chars
- meta_keywords: 6-10 SEO keywords (long-tail preferred)
- subtitle: optional one-line deck under the title`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let jobId: string | null = null;
  try {
    const body = (await req.json()) as Body;
    if (!body.topic?.trim()) {
      return new Response(JSON.stringify({ success: false, error: "topic required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const audience = body.audience ?? "investor";

    // Identify caller (admin) — best effort
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader && !body.cron) {
      const token = authHeader.replace("Bearer ", "");
      const { data: u } = await supabase.auth.getUser(token);
      userId = u?.user?.id ?? null;
    }

    // Create job row
    const { data: job, error: jobErr } = await supabase
      .from("blog_generation_jobs")
      .insert({
        topic: body.topic,
        category_id: body.category_id ?? null,
        audience,
        ai_provider: "lovable_ai",
        ai_model: "google/gemini-3-flash-preview",
        status: "processing",
        scheduled_publish_at: body.scheduled_for ?? null,
        created_by: userId,
      })
      .select()
      .single();
    if (jobErr) throw jobErr;
    jobId = job.id;

    // Resolve category context
    let categoryName = "";
    if (body.category_id) {
      const { data: c } = await supabase.from("blog_categories").select("name").eq("id", body.category_id).single();
      categoryName = c?.name ?? "";
    }

    const userPrompt = `Write a Markdown article for the "${audience}" audience.
Content pillar: ${categoryName || "General"}
Topic / Working title: ${body.topic}

Use the create_blog_post tool to return the structured result.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_blog_post",
            description: "Return a complete SEO-optimised blog post.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                subtitle: { type: "string" },
                excerpt: { type: "string" },
                content: { type: "string", description: "Full markdown content, 900-1500 words" },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
                meta_keywords: { type: "array", items: { type: "string" } },
              },
              required: ["title", "slug", "excerpt", "content", "meta_title", "meta_description", "meta_keywords"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_blog_post" } },
      }),
    });

    if (!aiResponse.ok) {
      const txt = await aiResponse.text();
      if (aiResponse.status === 429) throw new Error("AI rate limited — try again in a minute");
      if (aiResponse.status === 402) throw new Error("AI credits exhausted — top up Lovable AI usage");
      throw new Error(`AI gateway error ${aiResponse.status}: ${txt.slice(0, 300)}`);
    }

    const aiJson = await aiResponse.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return a structured post");
    const post = JSON.parse(toolCall.function.arguments);

    // Ensure slug uniqueness (append -2, -3 if collision)
    let slug = post.slug;
    let n = 1;
    while (true) {
      const { data: existing } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      n += 1;
      slug = `${post.slug}-${n}`;
    }

    const wordCount = (post.content as string).trim().split(/\s+/).length;
    const readingTimeMin = Math.max(1, Math.round(wordCount / 225));

    const { data: created, error: insErr } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: post.title,
        subtitle: post.subtitle ?? null,
        excerpt: post.excerpt,
        content: post.content,
        category_id: body.category_id ?? null,
        audience,
        status: body.cron ? "draft" : "draft", // always draft, admin reviews
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        meta_keywords: post.meta_keywords,
        reading_time_minutes: readingTimeMin,
        ai_generated: true,
        scheduled_for: body.scheduled_for ?? null,
        created_by: userId,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    await supabase
      .from("blog_generation_jobs")
      .update({
        status: "ready_for_review",
        generated_post_id: created.id,
        raw_output: post,
      })
      .eq("id", jobId);

    return new Response(JSON.stringify({ success: true, post_id: created.id, slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-blog-post error:", msg);
    if (jobId) {
      await supabase.from("blog_generation_jobs").update({ status: "failed", error_message: msg }).eq("id", jobId);
    }
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
