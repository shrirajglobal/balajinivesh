// supabase/functions/embed-content-single/index.ts
// Re-embeds a single content item (blog_post | market_update | academy_chapter).
// Called automatically by DB triggers via pg_net when content is published/updated.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EMBED_MODEL = "google/text-embedding-004";

function chunkText(text: string, maxLen = 1200): string[] {
  if (!text) return [];
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return [clean];
  const chunks: string[] = [];
  const sentences = clean.split(/(?<=[.!?])\s+/);
  let buf = "";
  for (const s of sentences) {
    if ((buf + " " + s).length > maxLen && buf) {
      chunks.push(buf.trim());
      buf = s;
    } else {
      buf = buf ? `${buf} ${s}` : s;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

async function embedOne(text: string): Promise<number[]> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!resp.ok) {
    throw new Error(`Embedding failed: ${resp.status} ${await resp.text()}`);
  }
  const json = await resp.json();
  return json.data?.[0]?.embedding ?? [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { source_type, source_id } = await req.json();
    if (!source_type || !source_id) {
      return new Response(JSON.stringify({ error: "source_type and source_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    let title = "";
    let url: string | null = null;
    let textToEmbed = "";

    if (source_type === "blog_post") {
      const { data: p } = await admin
        .from("blog_posts")
        .select("title, slug, excerpt, content, status")
        .eq("id", source_id)
        .single();
      if (!p || p.status !== "published") {
        return new Response(JSON.stringify({ ok: true, skipped: "not published" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      title = p.title;
      url = `/blog/${p.slug}`;
      textToEmbed = `${p.title}. ${p.excerpt}. ${p.content}`;
    } else if (source_type === "market_update") {
      const { data: u } = await admin
        .from("market_updates")
        .select("headline, summary, what_it_means, update_date, status")
        .eq("id", source_id)
        .single();
      if (!u || u.status !== "published") {
        return new Response(JSON.stringify({ ok: true, skipped: "not published" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      title = u.headline;
      url = `/market-updates/${u.update_date}`;
      textToEmbed = `${u.headline}. ${u.summary}. ${u.what_it_means ?? ""}`;
    } else if (source_type === "academy_chapter") {
      const { data: c } = await admin
        .from("learning_chapters")
        .select("title, slug, summary, content_markdown, is_published, learning_modules:module_id(slug)")
        .eq("id", source_id)
        .single();
      if (!c || !c.is_published) {
        return new Response(JSON.stringify({ ok: true, skipped: "not published" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const modSlug = (c as any).learning_modules?.slug ?? "";
      title = c.title;
      url = modSlug ? `/partner/academy/${modSlug}/${c.slug}` : null;
      textToEmbed = `${c.title}. ${c.summary ?? ""}. ${c.content_markdown}`;
    } else {
      return new Response(JSON.stringify({ error: "Unsupported source_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete previous embeddings for this item
    await admin
      .from("content_embeddings")
      .delete()
      .eq("source_type", source_type)
      .eq("source_id", source_id);

    const chunks = chunkText(textToEmbed);
    let inserted = 0;
    for (let i = 0; i < chunks.length; i++) {
      const emb = await embedOne(chunks[i]);
      const { error } = await admin.from("content_embeddings").insert({
        source_type,
        source_id,
        chunk_index: i,
        title,
        url,
        content: chunks[i],
        embedding: emb,
        token_count: Math.ceil(chunks[i].length / 4),
      });
      if (!error) inserted++;
    }

    return new Response(
      JSON.stringify({ ok: true, source_type, source_id, chunks_embedded: inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("embed-content-single error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
