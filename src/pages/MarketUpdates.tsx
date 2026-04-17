import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import HeroBanner from "@/components/layout/HeroBanner";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import SEO from "@/components/seo/SEO";
import ShareButtons from "@/components/share/ShareButtons";
import { toast } from "sonner";

interface MarketUpdate {
  id: string;
  update_date: string;
  sensex_close: number | null;
  sensex_change_pct: number | null;
  nifty_close: number | null;
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
  headline: string;
  summary: string;
  what_it_means: string | null;
  key_movers: string[];
  market_sentiment: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
}

const fmtNum = (n: number | null) =>
  n === null || n === undefined ? "—" : n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtPct = (n: number | null) => {
  if (n === null || n === undefined) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
};

const sentimentColor = (s: string | null) => {
  switch (s) {
    case "bullish": return "bg-green-500/10 text-green-700 border-green-500/30";
    case "bearish": return "bg-red-500/10 text-red-700 border-red-500/30";
    case "cautious": return "bg-amber-500/10 text-amber-700 border-amber-500/30";
    case "mixed": return "bg-purple-500/10 text-purple-700 border-purple-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};

function MetricCard({ label, value, change }: { label: string; value: string; change: number | null }) {
  const Icon = change === null ? Minus : change >= 0 ? TrendingUp : TrendingDown;
  const color = change === null ? "text-muted-foreground" : change >= 0 ? "text-green-600" : "text-red-600";
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-xl font-bold text-foreground">{value}</p>
        <p className={`mt-1 flex items-center gap-1 text-sm ${color}`}>
          <Icon className="h-3.5 w-3.5" />
          {fmtPct(change)}
        </p>
      </CardContent>
    </Card>
  );
}

const MarketUpdates = () => {
  const { date } = useParams();
  const [latest, setLatest] = useState<MarketUpdate | null>(null);
  const [archive, setArchive] = useState<Pick<MarketUpdate, "id" | "update_date" | "headline" | "market_sentiment">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase
        .from("market_updates")
        .select("*")
        .eq("status", "published")
        .order("update_date", { ascending: false })
        .limit(1);
      if (date) {
        q = supabase.from("market_updates").select("*").eq("status", "published").eq("update_date", date).limit(1);
      }
      const { data: latestRows } = await q;
      const row = (latestRows?.[0] as any) ?? null;
      setLatest(
        row
          ? { ...row, key_movers: Array.isArray(row.key_movers) ? row.key_movers : [] }
          : null,
      );

      const { data: archRows } = await supabase
        .from("market_updates")
        .select("id, update_date, headline, market_sentiment")
        .eq("status", "published")
        .order("update_date", { ascending: false })
        .limit(30);
      setArchive((archRows as any) ?? []);
      setLoading(false);
    })();
  }, [date]);

  // Native share replaced by <ShareButtons /> with UTM tracking.

  return (
    <div>
      <SEO
        title={latest?.meta_title || "Daily Market Updates — Samajhne Wali Khabar"}
        description={latest?.meta_description || "Daily Indian market summary in simple language. Sensex, Nifty, gold, USD/INR explained for everyday investors."}
        canonical="/market-updates"
      />

      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-light text-secondary">
            <TrendingUp className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
            Samajhne Wali Khabar
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Today&apos;s Indian markets in plain language — what happened and what it means for you.
          </p>
        </motion.div>
      </HeroBanner>

      <section className="py-10 lg:py-12">
        <div className="container max-w-5xl">
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : !latest ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>No market updates published yet. Check back soon.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Headline card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-primary/20 shadow-sm">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className={sentimentColor(latest.market_sentiment)}>
                        {latest.market_sentiment ?? "neutral"}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(latest.update_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <div className="ml-auto">
                        <ShareButtons
                          title={`${latest.headline} — Samajhne Wali Khabar by Balaji Nivesh`}
                          campaign="market_update"
                          content={latest.update_date}
                          compact
                        />
                      </div>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">{latest.headline}</h2>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Metrics grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <MetricCard label="Sensex" value={fmtNum(latest.sensex_close)} change={latest.sensex_change_pct} />
                <MetricCard label="Nifty 50" value={fmtNum(latest.nifty_close)} change={latest.nifty_change_pct} />
                <MetricCard label="Bank Nifty" value={fmtNum(latest.bank_nifty_close)} change={latest.bank_nifty_change_pct} />
                <MetricCard label="USD/INR" value={fmtNum(latest.usd_inr)} change={latest.usd_inr_change_pct} />
                <MetricCard label="Gold (USD/oz)" value={fmtNum(latest.gold_price)} change={latest.gold_change_pct} />
                <MetricCard label="Silver (USD/oz)" value={fmtNum(latest.silver_price)} change={latest.silver_change_pct} />
                <MetricCard label="Crude (USD/bbl)" value={fmtNum(latest.crude_price)} change={latest.crude_change_pct} />
              </div>

              {/* Summary */}
              <Card className="mt-6">
                <CardContent className="prose prose-sm max-w-none p-6 lg:p-8">
                  <h3 className="font-display text-xl font-semibold">Today&apos;s Summary</h3>
                  <div className="mt-2 whitespace-pre-line text-foreground/90">{latest.summary}</div>

                  {latest.key_movers?.length > 0 && (
                    <>
                      <h3 className="mt-6 font-display text-xl font-semibold">Key Movers</h3>
                      <ul className="mt-2 space-y-1">
                        {latest.key_movers.map((m, i) => (
                          <li key={i} className="text-foreground/90">• {m}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {latest.what_it_means && (
                    <>
                      <h3 className="mt-6 font-display text-xl font-semibold">What This Means For You</h3>
                      <div className="mt-2 whitespace-pre-line text-foreground/90">{latest.what_it_means}</div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6">
                <SebiDisclaimer variant="compact" />
              </div>
            </>
          )}

          {/* Archive */}
          {archive.length > 1 && (
            <div className="mt-12">
              <h3 className="font-display text-xl font-semibold text-foreground">Recent Updates</h3>
              <div className="mt-4 space-y-2">
                {archive.slice(date ? 0 : 1).map((a) => (
                  <Link
                    key={a.id}
                    to={`/market-updates/${a.update_date}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.update_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">{a.headline}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.market_sentiment && (
                        <Badge variant="outline" className={sentimentColor(a.market_sentiment)}>
                          {a.market_sentiment}
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MarketUpdates;
