import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const RetirementPlanner = () => {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(12);
  const [postRetireReturn, setPostRetireReturn] = useState(8);

  const result = useMemo(() => {
    const yearsToRetire = retireAge - age;
    const retirementYears = 25; // plan for 25 years post retirement

    // Future monthly expense at retirement
    const futureMonthly = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire);
    const futureAnnual = futureMonthly * 12;

    // Corpus needed (present value of annuity at retirement)
    const realReturn = ((1 + postRetireReturn / 100) / (1 + inflation / 100)) - 1;
    const corpus = realReturn > 0
      ? futureAnnual * (1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn
      : futureAnnual * retirementYears;

    // Monthly SIP needed
    const r = returnRate / 100 / 12;
    const n = yearsToRetire * 12;
    const sipNeeded = n > 0 ? corpus / (((Math.pow(1 + r, n) - 1) / r) * (1 + r)) : corpus;

    const data = [];
    let accumulated = 0;
    for (let y = 0; y <= yearsToRetire; y++) {
      data.push({ year: `Age ${age + y}`, value: Math.round(accumulated), target: Math.round(corpus) });
      if (y < yearsToRetire) {
        for (let m = 0; m < 12; m++) {
          accumulated = (accumulated + sipNeeded) * (1 + r);
        }
      }
    }

    return {
      corpus: Math.round(corpus),
      sipNeeded: Math.round(sipNeeded),
      futureMonthly: Math.round(futureMonthly),
      yearsToRetire,
      data,
    };
  }, [age, retireAge, monthlyExpense, inflation, returnRate, postRetireReturn]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Retirement Planner
          </motion.h1>
          <p className="mt-2 text-muted-foreground">Estimate the corpus you need and the SIP required to retire comfortably.</p>
        </div>
      </section>
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-5 lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={18} max={60} />
                </div>
                <div className="space-y-2">
                  <Label>Retirement Age</Label>
                  <Input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} min={age + 1} max={75} />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Current Monthly Expenses</Label>
                <Input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} min={10000} step={5000} />
                <Slider value={[monthlyExpense]} onValueChange={([v]) => setMonthlyExpense(v)} min={10000} max={500000} step={5000} />
              </div>
              <div className="space-y-3">
                <Label>Expected Inflation (%)</Label>
                <Slider value={[inflation]} onValueChange={([v]) => setInflation(v)} min={3} max={10} step={0.5} />
                <p className="text-xs text-muted-foreground">{inflation}% per year</p>
              </div>
              <div className="space-y-3">
                <Label>Pre-Retirement Return (%)</Label>
                <Slider value={[returnRate]} onValueChange={([v]) => setReturnRate(v)} min={6} max={20} step={0.5} />
                <p className="text-xs text-muted-foreground">{returnRate}% per year</p>
              </div>
              <div className="space-y-3">
                <Label>Post-Retirement Return (%)</Label>
                <Slider value={[postRetireReturn]} onValueChange={([v]) => setPostRetireReturn(v)} min={4} max={15} step={0.5} />
                <p className="text-xs text-muted-foreground">{postRetireReturn}% per year</p>
              </div>

              <div className="space-y-3">
                <Card className="border-primary/30 bg-brand-orange-light"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Retirement Corpus Needed</p>
                  <p className="mt-1 font-display text-lg font-bold text-primary">{fmt(result.corpus)}</p>
                </CardContent></Card>
                <Card className="border-border/60"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Monthly SIP Needed</p>
                  <p className="mt-1 font-display text-lg font-bold text-secondary">{fmt(result.sipNeeded)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">for {result.yearsToRetire} years</p>
                </CardContent></Card>
                <Card className="border-border/60"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Monthly Expense at Retirement</p>
                  <p className="mt-1 font-display text-sm font-bold text-foreground">{fmt(result.futureMonthly)}</p>
                </CardContent></Card>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Card className="border-border/60"><CardContent className="p-4 sm:p-6">
                <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Path to Retirement Corpus</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={Math.max(1, Math.floor(result.yearsToRetire / 6))} />
                    <YAxis tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Area type="monotone" dataKey="target" stroke="hsl(var(--destructive))" fill="none" strokeDasharray="5 5" name="Target" />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--brand-orange))" fill="hsl(var(--brand-orange) / 0.15)" name="Accumulated" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent></Card>
              <div className="mt-4 text-center">
                <Button asChild><Link to="/contact">Plan Your Retirement <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">This planner is for illustrative purposes only. Actual inflation and returns will vary. Consult a financial professional for personalized planning.</p>
        </div>
      </section>
    </div>
  );
};

export default RetirementPlanner;
