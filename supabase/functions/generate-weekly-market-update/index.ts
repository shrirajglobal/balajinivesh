import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_MODEL = "google/gemini-3-flash-preview";

const SYSTEM_PROMPT = `You are a financial educator writing the WEEKLY "Samajhne Wali Khabar" (News You Can Understand) roundup for Indian retail investors in West Bengal. Your audience is everyday savers — homemakers, salaried professionals, small business owners — many reading financial news for the first time.

STRICT RULES:
1. Class-10 reading level. Short sentences. Simple words. Hindi/Bengali analogies welcome (e.g., "rupee strengthening is like getting more sweets for the same money").
2. NEVER use: "guaranteed", "best fund", "buy now", "sell now", "risk-free", "double your money", specific scheme names, AMC recommendations, or stock tickers.
3. NEVER give investment advice. Only EXPLAIN what happened and what concepts it illustrates.
4. Frame as a Distributor, NOT an Adviser. End "what_it_means" with a gentle note like "consult your distributor or a SEBI-registered investment adviser for personal decisions".
5. The SEBI mandatory disclaimer is automatically appended — do not include it yourself.
6. This is a WEEKLY roundup: describe the week's overall direction and themes, NOT single-day noise.
7. You are given real fetched data only: market numbers and official headlines from PIB, RBI, SEBI and AMFI feeds. Use ONLY that material. Never add facts from your own memory, never invent news, and if a section has no fetched material, say plainly that there was no major official news that week.
8. Write every item in your own simple words. NEVER quote or copy source text. For each section return a "sources" array of the source names/links you actually used from the supplied material.

OUTPUT (use create_weekly_market_update tool):
- headline: 50-80 chars about the week, plain language, no jargon
- market_overview: 100-140 words on how the week went overall and why, in simple terms
- market_sources: array of source labels used for the market section (e.g. "Yahoo Finance market data")
- geopolitical: 90-130 words on major geopolitical/policy actions that affected markets this week, drawn only from the supplied headlines
- geopolitical_sources: array of source names/links actually used
- industry_news: 90-130 words on major mutual fund industry news in India this week, drawn only from the supplied headlines
- industry_sources: array of source names/links actually used
- what_it_means: 60-100 words. Educational takeaway from the week. End with the consultation note.
- key_movers: array of 3-5 short bullet strings about sectors/themes (NOT individual stocks)
- market_sentiment: one word — "bullish", "bearish", "neutral", "cautious", or "mixed"
- meta_title: 50-60 chars
- meta_description: 140-160 chars`;

interface WeeklySnapshot {
  sensex_close: number | null; sensex_change: number | null; sensex_change_pct: number | null;
  nifty_close: number | null; nifty_change: number | null; nifty_change_pct: number | null;
  bank_nifty_close: number | null; bank_nifty_change_pct: number | null;
  gold_price: number | null; gold_change_pct: number | null;
  silver_price: number | null; silver_change_pct: number | null;
  crude_price: number | null; crude_change_pct: number | null;
  usd_inr: number | null; usd_inr_change_pct: number | null;
  data_source: string;
}

const SYMBOLS = {
  sensex: "^BSESN",
  nifty: "^NSEI",
  bank_nifty: "^NSEBANK",
  gold: "GC=F",
  silver: "SI=F",
  crude: "CL=F",
  usd_inr: "INR=X",
};

// Weekly move for one symbol via Yahoo Finance chart API (last close vs close ~7 days earlier)
async function fetchWeekly(symbol: string): Promise<{ close: number | null; change: number | null; pct: number | null }> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return { close: null, change: null, pct: null };
    const j = await r.json();
    const result = j?.chart?.result?.[0];
    const stamps: number[] = result?.timestamp ?? [];
    const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
    const points = stamps
      .map((t, i) => ({ t, c: closes[i] }))
      .filter((p) => typeof p.c === "number" && !isNaN(p.c as number)) as { t: number; c: number }[];
    if (points.length === 0) return { close: null, change: null, pct: null };

    const last = points[points.length - 1];
    const weekAgoTs = last.t - 7 * 24 * 60 * 60;
    // earliest point at or after (last - 7 days), else the first available point
    const base = points.find((p) => p.t >= weekAgoTs && p.t < last.t) ?? points[0];
    const change = last.c - base.c;
    const pct = base.c !== 0 ? (change / base.c) * 100 : null;
    return { close: last.c, change, pct };
  } catch (e) {
    console.error("Yahoo weekly fetch error", symbol, e);
    return { close: null, change: null, pct: null };
  }
}

async function fetchWeeklyMarketData(): Promise<WeeklySnapshot> {
  const [sx, nf, bn, gd, sv, cr, fx] = await Promise.all([
    fetchWeekly(SYMBOLS.sensex),
    fetchWeekly(SYMBOLS.nifty),
    fetchWeekly(SYMBOLS.bank_nifty),
    fetchWeekly(SYMBOLS.gold),
    fetchWeekly(SYMBOLS.silver),
    fetchWeekly(SYMBOLS.crude),
    fetchWeekly(SYMBOLS.usd_inr),
  ]);

  return {
    sensex_close: sx.close, sensex_change: sx.change, sensex_change_pct: sx.pct,
    nifty_close: nf.close, nifty_change: nf.change, nifty_change_pct: nf.pct,
    bank_nifty_close: bn.close, bank_nifty_change_pct: bn.pct,
    gold_price: gd.close, gold_change_pct: gd.pct,
    silver_price: sv.close, silver_change_pct: sv.pct,
    crude_price: cr.close, crude_change_pct: cr.pct,
    usd_inr: fx.close, usd_inr_change_pct: fx.pct,
    data_source: "yahoo_finance_weekly",
  };
}

// ---------- Official RSS feeds (real fetched data only) ----------
interface FeedItem { source: string; title: string; link: string; date: string | null }

const FEEDS: { source: string; url: string; bucket: "geo" | "industry" }[] = [
  { source: "PIB India", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", bucket: "geo" },
  { source: "RBI Press Releases", url: "https://www.rbi.org.in/pressreleases_rss.xml", bucket: "geo" },
  { source: "SEBI Press Releases", url: "https://www.sebi.gov.in/sebirss.xml", bucket: "industry" },
  { source: "AMFI Press Releases", url: "https://www.amfiindia.com/rss/press-release", bucket: "industry" },
];

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickTag(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

function parseFeed(xml: string, source: string): FeedItem[] {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  const items: FeedItem[] = [];
  for (const b of blocks) {
    const title = pickTag(b, "title");
    if (!title) continue;
    let link = pickTag(b, "link");
    if (!link) {
      const href = b.match(/<link[^>]*href="([^"]+)"/i);
      link = href ? href[1] : "";
    }
    const date = pickTag(b, "pubDate") ?? pickTag(b, "updated") ?? pickTag(b, "published");
    items.push({ source, title, link: link ?? "", date });
  }
  return items;
}

async function fetchFeeds(): Promise<{ geo: FeedItem[]; industry: FeedItem[]; failed: string[] }> {
  const cutoff = Date.now() - 8 * 24 * 60 * 60 * 1000;
  const geo: FeedItem[] = [];
  const industry: FeedItem[] = [];
  const failed: string[] = [];

  await Promise.all(FEEDS.map(async (f) => {
    try {
      const r = await fetch(f.url, {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/rss+xml, application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) { failed.push(`${f.source} (${r.status})`); return; }
      const xml = await r.text();
      const items = parseFeed(xml, f.source)
        .filter((it) => {
          if (!it.date) return true;
          const t = Date.parse(it.date);
          return isNaN(t) ? true : t >= cutoff;
        })
        .slice(0, 15);
      if (items.length === 0) { failed.push(`${f.source} (no recent items)`); return; }
      (f.bucket === "geo" ? geo : industry).push(...items);
    } catch (e) {
      console.error("Feed error", f.source, e);
      failed.push(`${f.source} (fetch failed)`);
    }
  }));

  return { geo, industry, failed };
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
function renderItems(items: FeedItem[]): string {
  if (items.length === 0) return "(no headlines were fetched for this section this week)";
  return items.map((i) => `- [${i.source}] ${i.title}${i.link ? ` (${i.link})` : ""}`).join("\n");
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

    const { data: existing } = await supabase
      .from("market_updates")
      .select("id, status")
      .eq("update_date", targetDate)
      .maybeSingle();
    if (existing && cron) {
      return new Response(JSON.stringify({ success: true, skipped: true, message: "An update for this date already exists", id: existing.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weekStart = new Date(new Date(targetDate).getTime() - 6 * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10);

    // 1) Real data first
    const [snap, feeds] = await Promise.all([fetchWeeklyMarketData(), fetchFeeds()]);

    const dataSummary = `WEEKLY Indian market roundup for ${weekStart} to ${targetDate}.

Market moves over the past 7 days (latest level and change over the week):
- Sensex: ${fmtNum(snap.sensex_close)} (${fmtPct(snap.sensex_change_pct)})
- Nifty 50: ${fmtNum(snap.nifty_close)} (${fmtPct(snap.nifty_change_pct)})
- Bank Nifty: ${fmtNum(snap.bank_nifty_close)} (${fmtPct(snap.bank_nifty_change_pct)})
- Gold (USD/oz): ${fmtNum(snap.gold_price)} (${fmtPct(snap.gold_change_pct)})
- Silver (USD/oz): ${fmtNum(snap.silver_price)} (${fmtPct(snap.silver_change_pct)})
- Crude Oil (USD/bbl): ${fmtNum(snap.crude_price)} (${fmtPct(snap.crude_change_pct)})
- USD/INR: ${fmtNum(snap.usd_inr)} (${fmtPct(snap.usd_inr_change_pct)})
Source: Yahoo Finance market data.

Official headlines fetched this week — GEOPOLITICAL / POLICY (PIB India, RBI):
${renderItems(feeds.geo)}

Official headlines fetched this week — MUTUAL FUND INDUSTRY (SEBI, AMFI):
${renderItems(feeds.industry)}

Use ONLY the material above. Do not add any other news from memory. Write the weekly "Samajhne Wali Khabar" using the create_weekly_market_update tool.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: dataSummary },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_weekly_market_update",
            description: "Return a complete weekly market roundup with three sections.",
            parameters: {
              type: "object",
              properties: {
                headline: { type: "string" },
                market_overview: { type: "string" },
                market_sources: { type: "array", items: { type: "string" } },
                geopolitical: { type: "string" },
                geopolitical_sources: { type: "array", items: { type: "string" } },
                industry_news: { type: "string" },
                industry_sources: { type: "array", items: { type: "string" } },
                what_it_means: { type: "string" },
                key_movers: { type: "array", items: { type: "string" } },
                market_sentiment: { type: "string", enum: ["bullish", "bearish", "neutral", "cautious", "mixed"] },
                meta_title: { type: "string" },
                meta_description: { type: "string" },
              },
              required: [
                "headline", "market_overview", "market_sources", "geopolitical", "geopolitical_sources",
                "industry_news", "industry_sources", "what_it_means", "key_movers",
                "market_sentiment", "meta_title", "meta_description",
              ],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_weekly_market_update" } },
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
    if (!toolCall) throw new Error("AI did not return a structured weekly update");
    const post = JSON.parse(toolCall.function.arguments);

    const srcLine = (label: string, arr: unknown) =>
      Array.isArray(arr) && arr.length ? `\nSources: ${(arr as string[]).join(" • ")}` : "";

    const summary = [
      `Market Overview\n${post.market_overview}${srcLine("m", post.market_sources)}`,
      `Major Geopolitical Actions Affecting Markets\n${post.geopolitical}${srcLine("g", post.geopolitical_sources)}`,
      `Major Mutual Fund Industry News in India\n${post.industry_news}${srcLine("i", post.industry_sources)}`,
    ].join("\n\n");

    const payload = {
      update_date: targetDate,
      ...snap,
      headline: post.headline,
      summary,
      what_it_means: post.what_it_means,
      key_movers: post.key_movers,
      market_sentiment: post.market_sentiment,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      status: "published",
      is_weekly_roundup: true,
      ai_generated: true,
      ai_provider: "lovable_ai",
      ai_model: AI_MODEL,
      raw_ai_output: { ...post, week_start: weekStart, week_end: targetDate, failed_feeds: feeds.failed },
      published_at: new Date().toISOString(),
    };

    let saved;
    if (existing) {
      const { data, error } = await supabase
        .from("market_updates").update(payload).eq("id", existing.id).select().single();
      if (error) throw error;
      saved = data;
    } else {
      const { data, error } = await supabase
        .from("market_updates").insert(payload).select().single();
      if (error) throw error;
      saved = data;
    }

    return new Response(JSON.stringify({
      success: true, id: saved.id, status: saved.status, headline: saved.headline, failed_feeds: feeds.failed,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-weekly-market-update error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
