// supabase/functions/embed-content/index.ts
// Embeds blog_posts, market_updates, and learning_chapters into content_embeddings (pgvector).
// Admin-only. Idempotent: re-running re-embeds anything updated since last run.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EMBED_MODEL = "google/text-embedding-004"; // 768-dim, matches schema

// ---- helpers --------------------------------------------------------------
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
    const t = await resp.text();
    throw new Error(`Embedding failed: ${resp.status} ${t}`);
  }
  const json = await resp.json();
  return json.data?.[0]?.embedding ?? [];
}

// ---- main -----------------------------------------------------------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify admin caller
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const sourceTypes: string[] = body.source_types ?? [
      "blog_post",
      "market_update",
      "academy_chapter",
    ];
    const limit: number = Math.min(body.limit ?? 50, 200);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    let totalEmbedded = 0;
    const log: any[] = [];

    // ---- BLOG POSTS ------------------------------------------------------
    if (sourceTypes.includes("blog_post")) {
      const { data: posts } = await admin
        .from("blog_posts")
        .select("id, slug, title, excerpt, content, updated_at")
        .eq("status", "published")
        .order("updated_at", { ascending: false })
        .limit(limit);

      for (const p of posts ?? []) {
        await admin
          .from("content_embeddings")
          .delete()
          .eq("source_type", "blog_post")
          .eq("source_id", p.id);

        const chunks = chunkText(`${p.title}. ${p.excerpt}. ${p.content}`);
        for (let i = 0; i < chunks.length; i++) {
          const emb = await embedOne(chunks[i]);
          await admin.from("content_embeddings").insert({
            source_type: "blog_post",
            source_id: p.id,
            chunk_index: i,
            title: p.title,
            url: `/blog/${p.slug}`,
            content: chunks[i],
            embedding: emb,
            token_count: Math.ceil(chunks[i].length / 4),
          });
          totalEmbedded++;
        }
      }
      log.push({ source: "blog_post", count: posts?.length ?? 0 });
    }

    // ---- MARKET UPDATES --------------------------------------------------
    if (sourceTypes.includes("market_update")) {
      const { data: ups } = await admin
        .from("market_updates")
        .select("id, update_date, headline, summary, what_it_means, updated_at")
        .eq("status", "published")
        .order("update_date", { ascending: false })
        .limit(limit);

      for (const u of ups ?? []) {
        await admin
          .from("content_embeddings")
          .delete()
          .eq("source_type", "market_update")
          .eq("source_id", u.id);

        const text = `${u.headline}. ${u.summary}. ${u.what_it_means ?? ""}`;
        const chunks = chunkText(text);
        for (let i = 0; i < chunks.length; i++) {
          const emb = await embedOne(chunks[i]);
          await admin.from("content_embeddings").insert({
            source_type: "market_update",
            source_id: u.id,
            chunk_index: i,
            title: u.headline,
            url: `/market-updates/${u.update_date}`,
            content: chunks[i],
            embedding: emb,
            token_count: Math.ceil(chunks[i].length / 4),
          });
          totalEmbedded++;
        }
      }
      log.push({ source: "market_update", count: ups?.length ?? 0 });
    }

    // ---- ACADEMY CHAPTERS ------------------------------------------------
    if (sourceTypes.includes("academy_chapter")) {
      const { data: chapters } = await admin
        .from("learning_chapters")
        .select("id, slug, title, summary, content_markdown, module_id, updated_at, learning_modules:module_id(slug)")
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(limit);

      for (const c of chapters ?? []) {
        await admin
          .from("content_embeddings")
          .delete()
          .eq("source_type", "academy_chapter")
          .eq("source_id", c.id);

        const moduleSlug = (c as any).learning_modules?.slug ?? "";
        const text = `${c.title}. ${c.summary ?? ""}. ${c.content_markdown}`;
        const chunks = chunkText(text);
        for (let i = 0; i < chunks.length; i++) {
          const emb = await embedOne(chunks[i]);
          await admin.from("content_embeddings").insert({
            source_type: "academy_chapter",
            source_id: c.id,
            chunk_index: i,
            title: c.title,
            url: moduleSlug ? `/partner/academy/${moduleSlug}/${c.slug}` : null,
            content: chunks[i],
            embedding: emb,
            token_count: Math.ceil(chunks[i].length / 4),
          });
          totalEmbedded++;
        }
      }
      log.push({ source: "academy_chapter", count: chapters?.length ?? 0 });
    }

    return new Response(
      JSON.stringify({ ok: true, total_embedded: totalEmbedded, breakdown: log }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("embed-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
