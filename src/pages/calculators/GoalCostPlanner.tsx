import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import CalculatorLeadCapture from "@/components/leads/CalculatorLeadCapture";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart,
} from "recharts";

const formatCurrency = (val: number) =>
  "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });

interface GoalPlannerProps {
  pageTitle: string;
  pageSubtitle: string;
  goalLabel: string;
  goalHint: string;
  defaultCost: number;
  leadSource: string;
  leadTitle: string;
  leadSubtitle: string;
}

export const GoalCostPlanner = ({
  pageTitle, pageSubtitle, goalLabel, goalHint, defaultCost, leadSource, leadTitle, leadSubtitle,
}: GoalPlannerProps) => {
  const [costToday, setCostToday] = useState(defaultCost);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const futureCost = Math.round(costToday * Math.pow(1 + Math.max(inflation, 0) / 100, years));
    const safeRate = Math.max(rate, 0.01);
    const r = safeRate / 100 / 12;
    const n = years * 12;
    const sipNeeded = n > 0 ? Math.ceil((futureCost / (((Math.pow(1 + r, n) - 1) / r) * (1 + r))) / 100) * 100 : futureCost;
    const invested = sipNeeded * n;

    const data = [];
    let fv = 0;
    for (let y = 0; y <= years; y++) {
      const goalAtY = Math.round(costToday * Math.pow(1 + Math.max(inflation, 0) / 100, y));
      data.push({ year: `Yr ${y}`, value: Math.round(fv), goal: goalAtY });
      for (let m = 0; m < 12; m++) fv = (fv + sipNeeded) * (1 + r);
    }

    return { futureCost, sipNeeded, invested, data };
  }, [costToday, years, inflation, rate]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            {pageTitle}
          </motion.h1>
          <p className="mt-2 text-muted-foreground">{pageSubtitle}</p>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>{goalLabel}</Label>
                <Input type="number" value={costToday} onChange={(e) => setCostToday(Number(e.target.value))} min={50000} step={50000} />
                <Slider value={[costToday]} onValueChange={([v]) => setCostToday(v)} min={100000} max={20000000} step={50000} />
                <p className="text-xs text-muted-foreground">{goalHint}</p>
              </div>
              <div className="space-y-3">
                <Label>Years Until You Need It</Label>
                <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={30} />
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={30} step={1} />
              </div>
              <div className="space-y-3">
                <Label>Cost Inflation (% per year)</Label>
                <Input type="number" value={inflation} onChange={(e) => setInflation(Math.max(0, Number(e.target.value) || 0))} min={0} max={15} step={0.5} />
                <Slider value={[inflation]} onValueChange={([v]) => setInflation(v)} min={0} max={15} step={0.5} />
                <p className="text-xs text-muted-foreground">Education costs in India have historically risen 6–10% a year.</p>
              </div>
              <div className="space-y-3">
                <Label>Expected Annual Return (%)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(Math.max(1, Number(e.target.value) || 1))} min={1} max={30} step={0.5} />
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={1} max={30} step={0.5} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Card className="border-border/60"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Future Cost</p>
                  <p className="mt-1 font-display text-sm font-bold text-foreground">{formatCurrency(result.futureCost)}</p>
                </CardContent></Card>
                <Card className="border-border/60"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="mt-1 font-display text-sm font-bold text-foreground">{formatCurrency(result.invested)}</p>
                </CardContent></Card>
                <Card className="border-primary/30 bg-brand-orange-light"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">SIP Needed</p>
                  <p className="mt-1 font-display text-sm font-bold text-primary">{formatCurrency(result.sipNeeded)}/mo</p>
                </CardContent></Card>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card className="border-border/60">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Your SIP vs The Rising Goal Cost</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={result.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--brand-orange))" fill="hsl(var(--brand-orange) / 0.15)" name="Your Corpus" />
                      <Line type="monotone" dataKey="goal" stroke="hsl(var(--brand-blue))" strokeDasharray="5 5" dot={false} name="Goal Cost (inflation-adjusted)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="mt-6">
                <CalculatorLeadCapture
                  source={leadSource}
                  context={`${pageTitle}: ${formatCurrency(costToday)} today, ${years} yrs @ ${inflation}% inflation → ${formatCurrency(result.futureCost)}; SIP needed ${formatCurrency(result.sipNeeded)}/month @ ${rate}%`}
                  title={leadTitle}
                  subtitle={leadSubtitle}
                />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <SebiDisclaimer variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
};
