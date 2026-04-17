import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a financial educator writing the daily "Samajhne Wali Khabar" (News You Can Understand) for Indian retail investors in West Bengal. Your audience is everyday savers — homemakers, salaried professionals, small business owners — many reading financial news for the first time.

STRICT RULES:
1. Class-10 reading level. Short sentences. Simple words. Hindi/Bengali analogies welcome (e.g., "rupee strengthening is like getting more sweets for the same money").
2. NEVER use: "guaranteed", "best fund", "buy now", "sell now", "risk-free", "double your money", specific scheme names, AMC recommendations, or stock tickers.
3. NEVER give investment advice. Only EXPLAIN what happened and what concepts it illustrates.
4. Frame as a Distributor, NOT an Adviser. End "what_it_means" with a gentle note like "consult your distributor or a SEBI-registered investment adviser for personal decisions".
5. Always note the SEBI mandatory disclaimer is automatically appended — do not include it yourself.

OUTPUT (use create_market_update tool):
- headline: 50-80 chars, plain language, no jargon. Example: "Sensex climbs 350 points as banking stocks lead the rally"
- summary: 80-120 words. 3 short paragraphs explaining what happened today and why, in simple terms.
- what_it_means: 60-100 words. Educational takeaway: what concept does today illustrate (e.g., "this shows why diversification matters", "this is how interest rates affect FDs"). End with the consultation note.
- key_movers: array of 3-5 short bullet strings about top movers (sectors/themes, NOT individual stocks). Example: ["IT sector gained 1.2% on strong US dollar", "Banking stocks rallied on RBI commentary"]
- market_sentiment: one word — "bullish", "bearish", "neutral", "cautious", or "mixed"
- meta_title: 50-60 chars
- meta_description: 140-160 chars`;

interface MarketSnapshot {
  sensex_close: number | null;
  sensex_change: number | null;
  sensex_change_pct: number | null;
  nifty_close: number | null;
  nifty_change: number | null;
  nifty_change_pct: number | null;
  bank_nifty_close: number | null;
  bank_nifty_change_pct: number | null;
  gold_price: number | null;
  gold_change_pct: number | null;
  silver_price: number | null;
  silver_change_pct: number | null;
  crude_price: number | null;
  crude_change_pct: number | null;
  usd_inr: number | null;
  usd_inr_change_pct: number | null;
  data_source: string;
}

// Fetch market data — tries configured Market Data integrations, falls back to free Yahoo Finance
async function fetchMarketData(supabase: any): Promise<MarketSnapshot> {
  // Try Yahoo Finance (no API key needed) for primary instruments
  const symbols = {
    sensex: "^BSESN",
    nifty: "^NSEI",
    bank_nifty: "^NSEBANK",
    gold: "GC=F",
    silver: "SI=F",
    crude: "CL=F",
    usd_inr: "INR=X",
  };

  const snap: MarketSnapshot = {
    sensex_close: null, sensex_change: null, sensex_change_pct: null,
    nifty_close: null, nifty_change: null, nifty_change_pct: null,
    bank_nifty_close: null, bank_nifty_change_pct: null,
    gold_price: null, gold_change_pct: null,
    silver_price: null, silver_change_pct: null,
    crude_price: null, crude_change_pct: null,
    usd_inr: null, usd_inr_change_pct: null,
    data_source: "yahoo_finance",
  };

  try {
    const symbolList = Object.values(symbols).join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolList}`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (r.ok) {
      const data = await r.json();
      const results = data?.quoteResponse?.result ?? [];
      const map: Record<string, any> = {};
      for (const q of results) map[q.symbol] = q;

      const sx = map[symbols.sensex];
      if (sx) {
        snap.sensex_close = sx.regularMarketPrice ?? null;
        snap.sensex_change = sx.regularMarketChange ?? null;
        snap.sensex_change_pct = sx.regularMarketChangePercent ?? null;
      }
      const nf = map[symbols.nifty];
      if (nf) {
        snap.nifty_close = nf.regularMarketPrice ?? null;
        snap.nifty_change = nf.regularMarketChange ?? null;
        snap.nifty_change_pct = nf.regularMarketChangePercent ?? null;
      }
      const bn = map[symbols.bank_nifty];
      if (bn) {
        snap.bank_nifty_close = bn.regularMarketPrice ?? null;
        snap.bank_nifty_change_pct = bn.regularMarketChangePercent ?? null;
      }
      const gd = map[symbols.gold];
      if (gd) {
        snap.gold_price = gd.regularMarketPrice ?? null;
        snap.gold_change_pct = gd.regularMarketChangePercent ?? null;
      }
      const sv = map[symbols.silver];
      if (sv) {
        snap.silver_price = sv.regularMarketPrice ?? null;
        snap.silver_change_pct = sv.regularMarketChangePercent ?? null;
      }
      const cr = map[symbols.crude];
      if (cr) {
        snap.crude_price = cr.regularMarketPrice ?? null;
        snap.crude_change_pct = cr.regularMarketChangePercent ?? null;
      }
      const fx = map[symbols.usd_inr];
      if (fx) {
        snap.usd_inr = fx.regularMarketPrice ?? null;
        snap.usd_inr_change_pct = fx.regularMarketChangePercent ?? null;
      }
    }
  } catch (e) {
    console.error("Yahoo Finance fetch error:", e);
  }

  return snap;
}

function fmtPct(n: number | null): string {
  if (n === null || n === undefined || isNaN(n)) return "N/A";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}
function fmtNum(n: number | null): string {
  if (n === null || n === undefined || isNaN(n)) return "N/A";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json().catch(() => ({}));
    const cron = body?.cron === true;
    const targetDate = (body?.date as string) || new Date().toISOString().slice(0, 10);

    // Skip if today already exists
    const { data: existing } = await supabase
      .from("market_updates")
      .select("id, status")
      .eq("update_date", targetDate)
      .maybeSingle();
    if (existing && cron) {
      return new Response(JSON.stringify({ success: true, skipped: true, message: "Update for today already exists", id: existing.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Identify caller
    let userId: string | null = null;
    if (!cron) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: u } = await supabase.auth.getUser(token);
        userId = u?.user?.id ?? null;
      }
    }

    // 1) Fetch market data
    const snap = await fetchMarketData(supabase);

    // 2) Build AI prompt with the data
    const dataSummary = `Today's Indian market snapshot (${targetDate}):
- Sensex: ${fmtNum(snap.sensex_close)} (${fmtPct(snap.sensex_change_pct)})
- Nifty 50: ${fmtNum(snap.nifty_close)} (${fmtPct(snap.nifty_change_pct)})
- Bank Nifty: ${fmtNum(snap.bank_nifty_close)} (${fmtPct(snap.bank_nifty_change_pct)})
- Gold (USD/oz): ${fmtNum(snap.gold_price)} (${fmtPct(snap.gold_change_pct)})
- Silver (USD/oz): ${fmtNum(snap.silver_price)} (${fmtPct(snap.silver_change_pct)})
- Crude Oil (USD/bbl): ${fmtNum(snap.crude_price)} (${fmtPct(snap.crude_change_pct)})
- USD/INR: ${fmtNum(snap.usd_inr)} (${fmtPct(snap.usd_inr_change_pct)})

Write today's "Samajhne Wali Khabar" using the create_market_update tool. Make it educational, simple, and useful for first-time investors. Focus on WHAT and WHY, not what to buy or sell.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: dataSummary },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_market_update",
            description: "Return a complete daily market update.",
            parameters: {
              type: "object",
              properties: {
                headline: { type: "string" },
                summary: { type: "string" },
                what_it_means: { type: "string" },
                key_movers: { type: "array", items: { type: "string" } },
                market_sentiment: { type: "string", enum: ["bullish", "bearish", "neutral", "cautious", "mixed"] },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
              },
              required: ["headline", "summary", "what_it_means", "key_movers", "market_sentiment", "meta_title", "meta_description"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_market_update" } },
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
    if (!toolCall) throw new Error("AI did not return a structured update");
    const post = JSON.parse(toolCall.function.arguments);

    // 3) Determine automation mode → controls draft vs published
    const { data: modeRow } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "market_updates_automation_mode")
      .maybeSingle();
    const mode = (modeRow?.setting_value as string) || "semi_auto";
    const autoPublish = mode === "full_auto" && cron;

    // 4) Insert / upsert
    const payload = {
      update_date: targetDate,
      ...snap,
      headline: post.headline,
      summary: post.summary,
      what_it_means: post.what_it_means,
      key_movers: post.key_movers,
      market_sentiment: post.market_sentiment,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      status: autoPublish ? "published" : "draft",
      ai_generated: true,
      ai_provider: "lovable_ai",
      ai_model: "google/gemini-3-flash-preview",
      raw_ai_output: post,
      published_at: autoPublish ? new Date().toISOString() : null,
      created_by: userId,
    };

    let saved;
    if (existing) {
      const { data, error } = await supabase
        .from("market_updates")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      saved = data;
    } else {
      const { data, error } = await supabase
        .from("market_updates")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      saved = data;
    }

    return new Response(JSON.stringify({ success: true, id: saved.id, status: saved.status, headline: saved.headline }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-market-update error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
