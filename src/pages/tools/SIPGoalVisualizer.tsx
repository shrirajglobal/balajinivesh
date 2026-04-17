import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Target, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ShareButtons from "@/components/share/ShareButtons";
import SEO from "@/components/seo/SEO";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GoalPreset {
  id: string;
  emoji: string;
  label: string;
  defaultAmount: number; // in ₹
  defaultYears: number;
  defaultRate: number; // assumed equity MF return
}

const GOAL_PRESETS: GoalPreset[] = [
  { id: "child-edu",   emoji: "🎓", label: "Child's Higher Education", defaultAmount: 4000000, defaultYears: 15, defaultRate: 12 },
  { id: "retirement",  emoji: "🏖️", label: "Retirement Corpus",        defaultAmount: 20000000, defaultYears: 25, defaultRate: 12 },
  { id: "home",        emoji: "🏠", label: "Down Payment for Home",    defaultAmount: 2500000,  defaultYears: 7,  defaultRate: 11 },
  { id: "car",         emoji: "🚗", label: "Buy a Car",                defaultAmount: 1000000,  defaultYears: 4,  defaultRate: 10 },
  { id: "wedding",     emoji: "💍", label: "Wedding",                  defaultAmount: 1500000,  defaultYears: 6,  defaultRate: 11 },
  { id: "vacation",    emoji: "✈️", label: "Dream Vacation",           defaultAmount: 500000,   defaultYears: 3,  defaultRate: 9  },
  { id: "emergency",   emoji: "🛟", label: "Emergency Fund",           defaultAmount: 600000,   defaultYears: 2,  defaultRate: 7  },
  { id: "wealth",      emoji: "💎", label: "Long-term Wealth",         defaultAmount: 10000000, defaultYears: 20, defaultRate: 12 },
];

const FD_RATE = 6.5; // typical post-tax-ish FD assumption for comparison
const INFLATION = 6;

const formatINR = (val: number) =>
  "₹" + Math.round(val).toLocaleString("en-IN");

const formatINRShort = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
};

/** PMT for SIP: required monthly investment to reach FV at rate r/m over n months, contribution at month-end. */
const requiredSIP = (futureValue: number, annualRate: number, years: number) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return futureValue / n;
  return futureValue / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

const SIPGoalVisualizer = () => {
  const [presetId, setPresetId] = useState<string>(GOAL_PRESETS[0].id);
  const [goalAmount, setGoalAmount] = useState(GOAL_PRESETS[0].defaultAmount);
  const [years, setYears] = useState(GOAL_PRESETS[0].defaultYears);
  const [rate, setRate] = useState(GOAL_PRESETS[0].defaultRate);
  const [adjustInflation, setAdjustInflation] = useState(true);

  const applyPreset = (p: GoalPreset) => {
    setPresetId(p.id);
    setGoalAmount(p.defaultAmount);
    setYears(p.defaultYears);
    setRate(p.defaultRate);
  };

  const result = useMemo(() => {
    const targetToday = goalAmount;
    const inflatedTarget = adjustInflation
      ? targetToday * Math.pow(1 + INFLATION / 100, years)
      : targetToday;

    const monthlySIP = requiredSIP(inflatedTarget, rate, years);
    const monthlyFD  = requiredSIP(inflatedTarget, FD_RATE, years);

    const sipInvested = monthlySIP * years * 12;
    const fdInvested  = monthlyFD  * years * 12;

    // Build year-by-year growth chart
    const data: { year: string; sip: number; fd: number; target: number }[] = [];
    for (let y = 0; y <= years; y++) {
      const months = y * 12;
      const rSip = rate / 100 / 12;
      const rFd  = FD_RATE / 100 / 12;
      const sipFV = months === 0 ? 0 : monthlySIP * ((Math.pow(1 + rSip, months) - 1) / rSip) * (1 + rSip);
      const fdFV  = months === 0 ? 0 : monthlyFD  * ((Math.pow(1 + rFd,  months) - 1) / rFd)  * (1 + rFd);
      data.push({
        year: `Yr ${y}`,
        sip: Math.round(sipFV),
        fd: Math.round(fdFV),
        target: Math.round(inflatedTarget),
      });
    }

    return {
      inflatedTarget,
      monthlySIP,
      monthlyFD,
      sipInvested,
      fdInvested,
      sipExtraReturns: inflatedTarget - sipInvested,
      sipSavingVsFd: monthlyFD - monthlySIP,
      data,
    };
  }, [goalAmount, years, rate, adjustInflation]);

  return (
    <div>
      <SEO
        title="SIP Goal Visualizer — Plan Any Life Goal | Balaji Nivesh"
        description="See exactly how much SIP you need to reach your goal — child's education, retirement, home, car. Compare with FD and visualize the gap."
      />

      <section className="bg-gradient-to-br from-brand-orange-light via-background to-brand-blue-light py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Tools</Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="border-brand-green/40 bg-brand-green/10 text-brand-green">
              <Sparkles className="mr-1 h-3 w-3" /> Goal-based Planning
            </Badge>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            SIP Goal Visualizer
          </motion.h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pick a goal, see the exact monthly SIP needed, and compare equity MF SIP vs Fixed Deposit. Inflation-adjusted by default — your future cost of the same goal.
          </p>
        </div>
      </section>

      {/* Goal presets */}
      <section className="border-b border-border/60 bg-card py-6">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choose a goal preset</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  presetId === p.id
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span className="text-base">{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator body */}
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
            {/* Inputs */}
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>Goal Amount (today's value)</Label>
                <Input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} min={50000} step={50000} />
                <Slider value={[goalAmount]} onValueChange={([v]) => setGoalAmount(v)} min={100000} max={50000000} step={100000} />
                <p className="text-xs text-muted-foreground">{formatINRShort(goalAmount)}</p>
              </div>

              <div className="space-y-3">
                <Label>Years to Goal</Label>
                <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={40} />
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={40} step={1} />
              </div>

              <div className="space-y-3">
                <Label>Expected SIP Return (% p.a.)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} min={1} max={25} step={0.5} />
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={6} max={18} step={0.5} />
                <p className="text-xs text-muted-foreground">Compared against {FD_RATE}% FD</p>
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm">
                <input
                  type="checkbox"
                  checked={adjustInflation}
                  onChange={(e) => setAdjustInflation(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium text-foreground">Adjust for inflation</span>
                <span className="ml-auto text-xs text-muted-foreground">@ {INFLATION}% p.a.</span>
              </label>
            </div>

            {/* Results + chart */}
            <div className="space-y-6 lg:col-span-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="border-primary/40 bg-gradient-to-br from-brand-orange-light to-background">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Monthly SIP Required</p>
                    <p className="mt-2 font-display text-2xl font-extrabold text-primary sm:text-3xl">{formatINR(result.monthlySIP)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">via Equity Mutual Fund @ {rate}%</p>
                  </CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Same goal via FD</p>
                    <p className="mt-2 font-display text-2xl font-extrabold text-brand-blue sm:text-3xl">{formatINR(result.monthlyFD)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Fixed Deposit @ {FD_RATE}%</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-brand-green/30 bg-brand-green/5">
                <CardContent className="flex items-start gap-3 p-4">
                  <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">
                      You save {formatINR(result.sipSavingVsFd)} every month with SIP vs FD
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Future value of goal: <strong>{formatINRShort(result.inflatedTarget)}</strong>
                      {adjustInflation && ` (today ${formatINRShort(goalAmount)} × ${INFLATION}% inflation × ${years}y)`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-4 font-display text-sm font-semibold text-foreground">SIP vs FD growth journey</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={result.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => formatINRShort(v)} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={70} />
                      <Tooltip formatter={(v: number) => formatINR(v)} />
                      <Legend />
                      <Area type="monotone" dataKey="fd"  stroke="hsl(var(--brand-blue))"   fill="hsl(var(--brand-blue) / 0.2)"   name="FD" />
                      <Area type="monotone" dataKey="sip" stroke="hsl(var(--brand-orange))" fill="hsl(var(--brand-orange) / 0.25)" name="SIP" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <ShareButtons
                  title={`I'm planning my ${GOAL_PRESETS.find(p => p.id === presetId)?.label || "goal"} of ${formatINRShort(result.inflatedTarget)} with just ${formatINR(result.monthlySIP)}/month SIP. Try the goal planner:`}
                  campaign="sip_goal_visualizer"
                  content={presetId}
                />
                <Button asChild>
                  <Link to="/contact">Start this SIP <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-xs text-muted-foreground">
            For illustrative & educational purposes only. Equity returns are not guaranteed and depend on market conditions. FD rates vary by bank and tenure. Mutual fund investments are subject to market risks — read all scheme-related documents carefully. Balaji Nivesh is an AMFI-registered Mutual Fund Distributor, not a SEBI-registered Investment Advisor.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SIPGoalVisualizer;
