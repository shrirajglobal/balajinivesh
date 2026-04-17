import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Cron-driven blog draft generator.
 * Strategy: alternating Day-1-Investor / Day-3-Partner cadence.
 * Picks a category that has the fewest posts and uses its seed topic ideas.
 *
 * This function is designed to be invoked daily by pg_cron. It will:
 * 1. Decide whether today's slot is investor or partner (by day-of-year parity)
 * 2. Pick a category in that audience with the fewest published posts
 * 3. Pick a topic seed (rotates) and call generate-blog-post
 * 4. The generated post is saved as draft for admin review
 */

const TOPIC_SEEDS: Record<string, string[]> = {
  "sip-basics": [
    "What is a SIP and why ₹500 a month can change your future",
    "SIP vs lump sum — which one should a first-time investor pick?",
    "How to start your first SIP step-by-step (with KYC explained)",
    "Common mistakes new SIP investors make in their first year",
    "Step-up SIP — how a small annual increase compounds your wealth",
  ],
  "mutual-fund-basics": [
    "Equity, debt, hybrid — understanding the three big mutual fund families",
    "What is NAV and why daily NAV movement is normal",
    "Direct vs Regular plan — what each means for an everyday investor",
    "ETFs vs index funds vs active funds — a plain-language comparison",
  ],
  "tax-planning": [
    "ELSS funds and Section 80C — the basics every taxpayer should know",
    "How long-term capital gains tax works on equity mutual funds",
    "Indexation explained for debt fund investors",
  ],
  "goal-planning": [
    "Planning your child's higher education — a 15-year roadmap",
    "How much do you need to retire comfortably in India?",
    "Building a down-payment fund for your first home",
    "Wedding goal planning without breaking your savings",
  ],
  "local-context": [
    "How a Kolkata homemaker built her own emergency fund",
    "Investing the Bengali way — durga puja bonus to long-term wealth",
    "Why MSME owners in Bengal should think about asset diversification",
  ],
  "market-literacy": [
    "Sensex and Nifty — what they actually represent",
    "Bull markets and bear markets explained without jargon",
    "Why daily market movements should not change your plan",
  ],
  "nism-prep": [
    "NISM V-A: understanding the regulatory environment of mutual funds",
    "NISM V-A: legal structure of mutual funds in India",
    "NISM V-A: scheme selection — risk and return basics",
    "NISM V-A: investment risk and risk profiling",
    "NISM V-A: common exam traps and how to avoid them",
  ],
  "partner-skills": [
    "First client conversation — a 5-step pitch framework",
    "Handling 'returns guarantee' objections the SEBI-compliant way",
    "Helping a client understand market volatility without losing trust",
  ],
  "compliance-ethics": [
    "AMFI code of conduct — the 10 things every distributor must know",
    "What you can and cannot say as an MFD",
    "Mis-selling — definition, examples, and how to avoid it",
  ],
  "product-knowledge": [
    "Hybrid funds explained for distributors",
    "Bond fund categories and their risk profile",
    "Understanding fund expense ratio and impact on long-term returns",
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // Day-of-year parity: even => investor, odd => partner (Day 1 / Day 3 cadence approximation)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const audience = dayOfYear % 3 === 0 ? "partner" : "investor";

    // Find the category with the fewest published posts in the chosen audience
    const { data: cats } = await supabase
      .from("blog_categories")
      .select("id, slug, name, audience")
      .in("audience", [audience, "both"]);
    if (!cats?.length) throw new Error("No categories available");

    // Count published posts per category
    const counts: Record<string, number> = {};
    for (const c of cats) {
      const { count } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .eq("category_id", c.id)
        .eq("status", "published");
      counts[c.id] = count ?? 0;
    }
    const sortedCats = [...cats].sort((a, b) => (counts[a.id] ?? 0) - (counts[b.id] ?? 0));
    const chosen = sortedCats[0];

    const seeds = TOPIC_SEEDS[chosen.slug] ?? [`Educational article about ${chosen.name}`];
    // Pick a seed not yet used as a draft/published title (best effort)
    const { data: existingTitles } = await supabase.from("blog_posts").select("title").eq("category_id", chosen.id);
    const usedTitles = new Set((existingTitles ?? []).map((r) => r.title.toLowerCase()));
    const topic = seeds.find((s) => !usedTitles.has(s.toLowerCase())) ?? seeds[Math.floor(Math.random() * seeds.length)];

    // Invoke generate-blog-post via internal HTTP (service-role auth)
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-blog-post`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ topic, category_id: chosen.id, audience, cron: true }),
    });
    const text = await r.text();
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    return new Response(JSON.stringify({
      success: r.ok,
      audience,
      category: chosen.slug,
      topic,
      result: parsed,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: r.ok ? 200 : 500,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("cron-blog-generator error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
