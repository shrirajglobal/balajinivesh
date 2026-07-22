import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const StepUpSIPCalculator = () => {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [stepUp, setStepUp] = useState(10);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;
    let currentSIP = monthly;
    const data = [{ year: "Yr 0", invested: 0, value: 0, normalSIP: 0 }];

    // Also calculate normal SIP for comparison
    let normalValue = 0;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        totalInvested += currentSIP;
        totalValue = (totalValue + currentSIP) * (1 + r);

        // Normal SIP
        normalValue = (normalValue + monthly) * (1 + r);
      }
      data.push({
        year: `Yr ${y}`,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue),
        normalSIP: Math.round(normalValue),
      });
      currentSIP = Math.round(currentSIP * (1 + stepUp / 100));
    }

    return {
      invested: Math.round(totalInvested),
      wealth: Math.round(totalValue),
      gains: Math.round(totalValue - totalInvested),
      normalWealth: Math.round(normalValue),
      data,
    };
  }, [monthly, years, rate, stepUp]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Step-Up SIP Calculator
          </motion.h1>
          <p className="mt-2 text-muted-foreground">See the power of increasing your SIP annually.</p>
        </div>
      </section>
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>Starting Monthly SIP</Label>
                <Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} min={500} step={500} />
                <Slider value={[monthly]} onValueChange={([v]) => setMonthly(v)} min={500} max={200000} step={500} />
                <p className="text-xs text-muted-foreground">{fmt(monthly)} / month</p>
              </div>
              <div className="space-y-3">
                <Label>Annual Step-Up (%)</Label>
                <Input type="number" value={stepUp} onChange={(e) => setStepUp(Number(e.target.value))} min={0} max={50} step={1} />
                <Slider value={[stepUp]} onValueChange={([v]) => setStepUp(v)} min={0} max={50} step={1} />
                <p className="text-xs text-muted-foreground">Increase SIP by {stepUp}% every year</p>
              </div>
              <div className="space-y-3">
                <Label>Period (Years)</Label>
                <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={40} />
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={40} step={1} />
              </div>
              <div className="space-y-3">
                <Label>Expected Annual Return (%)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} min={1} max={30} step={0.5} />
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={1} max={30} step={0.5} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border/60"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Invested</p><p className="mt-1 font-display text-sm font-bold text-foreground">{fmt(result.invested)}</p></CardContent></Card>
                <Card className="border-primary/30 bg-brand-orange-light"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Step-Up SIP Value</p><p className="mt-1 font-display text-sm font-bold text-primary">{fmt(result.wealth)}</p></CardContent></Card>
              </div>
              <Card className="border-border/60"><CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Normal SIP would give you</p>
                <p className="mt-1 font-display text-sm font-bold text-secondary">{fmt(result.normalWealth)}</p>
                <p className="mt-1 text-xs text-brand-green font-medium">Step-Up earns {fmt(result.wealth - result.normalWealth)} more!</p>
              </CardContent></Card>
            </div>
            <div className="lg:col-span-3">
              <Card className="border-border/60"><CardContent className="p-4 sm:p-6">
                <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Step-Up SIP vs Normal SIP</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Area type="monotone" dataKey="invested" stroke="hsl(var(--border))" fill="hsl(var(--muted) / 0.5)" name="Invested" />
                    <Area type="monotone" dataKey="normalSIP" stroke="hsl(var(--brand-blue))" fill="hsl(var(--brand-blue) / 0.15)" name="Normal SIP" />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--brand-orange))" fill="hsl(var(--brand-orange) / 0.15)" name="Step-Up SIP" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent></Card>
              <div className="mt-4 text-center">
                <Button asChild><Link to="/contact">Get Personalized Plan <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-3xl"><SebiDisclaimer variant="compact" /></div>
        </div>
      </section>
    </div>
  );
};

export default StepUpSIPCalculator;
