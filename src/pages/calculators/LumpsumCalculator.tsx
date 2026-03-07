import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const LumpsumCalculator = () => {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const r = rate / 100;
    const wealth = Math.round(amount * Math.pow(1 + r, years));
    const gains = wealth - amount;
    const data = Array.from({ length: years + 1 }, (_, y) => ({
      year: `Yr ${y}`,
      invested: amount,
      value: Math.round(amount * Math.pow(1 + r, y)),
    }));
    return { wealth, gains, data };
  }, [amount, years, rate]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Lumpsum Calculator
          </motion.h1>
          <p className="mt-2 text-muted-foreground">See how a one-time investment grows over time.</p>
        </div>
      </section>
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>Investment Amount</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1000} step={10000} />
                <Slider value={[amount]} onValueChange={([v]) => setAmount(v)} min={1000} max={10000000} step={10000} />
                <p className="text-xs text-muted-foreground">{fmt(amount)}</p>
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
              <div className="grid grid-cols-3 gap-3">
                <Card className="border-border/60"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Invested</p><p className="mt-1 font-display text-sm font-bold text-foreground">{fmt(amount)}</p></CardContent></Card>
                <Card className="border-border/60"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Gains</p><p className="mt-1 font-display text-sm font-bold text-brand-green">{fmt(result.gains)}</p></CardContent></Card>
                <Card className="border-primary/30 bg-brand-orange-light"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Total Value</p><p className="mt-1 font-display text-sm font-bold text-primary">{fmt(result.wealth)}</p></CardContent></Card>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Card className="border-border/60"><CardContent className="p-4 sm:p-6">
                <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Investment Growth</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Area type="monotone" dataKey="invested" stroke="hsl(var(--brand-blue))" fill="hsl(var(--brand-blue) / 0.2)" name="Invested" />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--brand-orange))" fill="hsl(var(--brand-orange) / 0.15)" name="Total Value" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent></Card>
              <div className="mt-4 text-center">
                <Button asChild><Link to="/contact">Get Investment Guidance <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">This calculator is for illustrative purposes only. Actual returns may vary. Mutual fund investments are subject to market risks.</p>
        </div>
      </section>
    </div>
  );
};

export default LumpsumCalculator;
