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
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const formatCurrency = (val: number) =>
  "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const CRORE = 10000000;

const CrorepatiCalculator = () => {
  const [targetCr, setTargetCr] = useState(1); // in crores
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [stepUp, setStepUp] = useState(0); // annual % increase

  const result = useMemo(() => {
    const target = targetCr * CRORE;
    const safeRate = Math.max(rate, 0.01);
    const r = safeRate / 100 / 12;
    const n = years * 12;

    // Future value of a SIP of P with annual step-up g
    const fvOf = (P: number) => {
      let fv = 0;
      let monthly = P;
      for (let m = 0; m < n; m++) {
        if (m > 0 && m % 12 === 0) monthly *= 1 + stepUp / 100;
        fv = (fv + monthly) * (1 + r);
      }
      return fv;
    };

    // Solve for P via binary search
    let lo = 100, hi = 10000000;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (fvOf(mid) >= target) hi = mid; else lo = mid;
    }
    const sipNeeded = Math.ceil(hi / 100) * 100;

    // Total invested with that SIP schedule
    let invested = 0;
    let monthly = sipNeeded;
    for (let m = 0; m < n; m++) {
      if (m > 0 && m % 12 === 0) monthly *= 1 + stepUp / 100;
      invested += monthly;
    }

    const data = [];
    let fv = 0;
    let inv = 0;
    monthly = sipNeeded;
    for (let y = 0; y <= years; y++) {
      data.push({ year: `Yr ${y}`, invested: Math.round(inv), value: Math.round(fv) });
      for (let m = 0; m < 12; m++) {
        if ((y * 12 + m) > 0 && (y * 12 + m) % 12 === 0) monthly *= 1 + stepUp / 100;
        inv += monthly;
        fv = (fv + monthly) * (1 + r);
      }
    }

    return { target, sipNeeded, invested: Math.round(invested), data };
  }, [targetCr, years, rate, stepUp]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Crorepati Calculator
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Find out the monthly SIP you need to reach ₹{targetCr} Crore — and how a yearly step-up gets you there faster.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>Target Corpus (₹ Crores)</Label>
                <Input type="number" value={targetCr} onChange={(e) => setTargetCr(Math.max(0.25, Number(e.target.value) || 1))} min={0.25} max={100} step={0.25} />
                <Slider value={[targetCr]} onValueChange={([v]) => setTargetCr(v)} min={0.25} max={10} step={0.25} />
                <p className="text-xs text-muted-foreground">{formatCurrency(targetCr * CRORE)}</p>
              </div>
              <div className="space-y-3">
                <Label>Time Horizon (Years)</Label>
                <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={40} />
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={40} step={1} />
              </div>
              <div className="space-y-3">
                <Label>Expected Annual Return (%)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(Math.max(1, Number(e.target.value) || 1))} min={1} max={30} step={0.5} />
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={1} max={30} step={0.5} />
              </div>
              <div className="space-y-3">
                <Label>Annual Step-Up in SIP (%)</Label>
                <Input type="number" value={stepUp} onChange={(e) => setStepUp(Math.max(0, Number(e.target.value) || 0))} min={0} max={25} step={1} />
                <Slider value={[stepUp]} onValueChange={([v]) => setStepUp(v)} min={0} max={25} step={1} />
                <p className="text-xs text-muted-foreground">Increase your SIP each year as your income grows — 10% is a common choice.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Card className="border-border/60"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="mt-1 font-display text-sm font-bold text-foreground">{formatCurrency(result.invested)}</p>
                </CardContent></Card>
                <Card className="border-border/60"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="mt-1 font-display text-sm font-bold text-foreground">{formatCurrency(result.target)}</p>
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
                  <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Your Journey to {formatCurrency(result.target)}</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={result.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => v >= CRORE ? `₹${(v / CRORE).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      <Area type="monotone" dataKey="invested" stackId="1" stroke="hsl(var(--brand-blue))" fill="hsl(var(--brand-blue) / 0.2)" name="Invested" />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--brand-orange))" fill="hsl(var(--brand-orange) / 0.15)" name="Projected Value" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="mt-6">
                <CalculatorLeadCapture
                  source="crorepati_goal"
                  context={`Crorepati goal: ${formatCurrency(result.target)} in ${years} years @ ${rate}%${stepUp > 0 ? ` with ${stepUp}% step-up` : ""} — SIP needed ${formatCurrency(result.sipNeeded)}/month`}
                  title="Ready to start your Crorepati journey?"
                  subtitle="We'll suggest 2–3 funds matching your risk profile and send a personalised plan PDF — free, no pressure."
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

export default CrorepatiCalculator;
