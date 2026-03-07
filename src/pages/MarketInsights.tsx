import { motion } from "framer-motion";
import { TrendingUp, Calendar, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Insight {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  icon: typeof TrendingUp;
}

const insights: Insight[] = [
  { id: "weekly-mar-1", title: "Weekly Market Wrap: Nifty 50 Holds Steady Amid Global Uncertainty", summary: "Indian equity markets showed resilience this week as the Nifty 50 consolidated near 22,800 levels despite mixed global cues. FII outflows continued but DII buying provided support. Banking and IT sectors were the top performers.", category: "Weekly Summary", date: "Mar 7, 2026", icon: BarChart3 },
  { id: "rbi-rate", title: "RBI Keeps Repo Rate Unchanged at 6.5% — What It Means for Your Investments", summary: "The Reserve Bank of India maintained the repo rate at 6.5% in its latest policy meeting. This decision impacts fixed deposit rates, bond yields, and borrowing costs. Here's what it means for your portfolio.", category: "Interest Rates", date: "Mar 5, 2026", icon: TrendingUp },
  { id: "fd-rates-update", title: "FD Rates Comparison: Which Banks Are Offering the Best Returns in 2026?", summary: "Fixed deposit rates have seen a correction after RBI's stance shift. We compare the latest FD rates across major banks and NBFCs to help you make an informed decision for your fixed-income allocations.", category: "Fixed Income", date: "Mar 3, 2026", icon: Calendar },
  { id: "equity-outlook", title: "Equity Market Outlook: Key Factors Shaping Markets in Q1 2026", summary: "From global rate cuts to domestic GDP growth, multiple factors are influencing Indian equity markets. Understand the key macroeconomic trends and what they could mean for long-term investors.", category: "Market Outlook", date: "Feb 28, 2026", icon: BarChart3 },
  { id: "sip-flows", title: "SIP Investments Hit Record ₹23,000 Crore in February 2026", summary: "Monthly SIP contributions continue their upward trend, crossing ₹23,000 crore in February. This reflects growing investor awareness about disciplined, long-term investing through mutual funds.", category: "Industry Update", date: "Feb 25, 2026", icon: TrendingUp },
  { id: "gold-trend", title: "Gold Prices Cross ₹72,000/10g — Should You Add Gold to Your Portfolio?", summary: "Gold has delivered strong returns over the past year, driven by global uncertainty and central bank buying. We explore the role of gold in portfolio diversification and the different ways to invest in gold.", category: "Commodities", date: "Feb 20, 2026", icon: Calendar },
];

const MarketInsights = () => {
  const { t } = useLanguage();

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-16 lg:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-light text-secondary">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">{t("insights.title")}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("insights.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6">
            {insights.map((insight, i) => (
              <motion.div key={insight.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <Card className="group border-border/60 transition-all hover:border-primary/30 hover:shadow-md">
                  <CardContent className="flex gap-4 p-6">
                    <div className="hidden shrink-0 sm:block">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-light text-secondary"><insight.icon className="h-5 w-5" /></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{insight.category}</Badge>
                        <span className="text-xs text-muted-foreground">{insight.date}</span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">{insight.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{insight.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link to="/contact">{t("insights.subscribe")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-10">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">{t("insights.disclaimer")}</p>
        </div>
      </section>
    </div>
  );
};

export default MarketInsights;
