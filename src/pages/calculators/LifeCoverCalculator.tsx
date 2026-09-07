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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const formatCurrency = (val: number) =>
  "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const LifeCoverCalculator = () => {
  const [income, setIncome] = useState(1200000); // annual
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [liabilities, setLiabilities] = useState(3000000);
  const [existingCover, setExistingCover] = useState(0);

  const result = useMemo(() => {
    const yearsLeft = Math.max(retireAge - age, 1);
    // Income replacement method (HLV simplified): present value of future income
    // discounted at 6% with 5% income growth
    const disc = 0.06, growth = 0.05;
    let pv = 0;
    let inc = income;
    for (let y = 0; y < yearsLeft; y++) {
      pv += inc / Math.pow(1 + disc, y);
      inc *= 1 + growth;
    }
    const incomeReplacement = Math.round(pv);
    const grossNeed = incomeReplacement + liabilities;
    const recommended = Math.max(grossNeed - existingCover, 0);

    const data = [
      { name: "Income Replacement", value: incomeReplacement, fill: "hsl(var(--brand-orange))" },
      { name: "Loans & Liabilities", value: liabilities, fill: "hsl(var(--brand-blue))" },
      { name: "Existing Cover", value: -existingCover, fill: "hsl(var(--brand-green))" },
      { name: "Cover You Need", value: recommended, fill: "hsl(var(--primary))" },
    ];

    return { incomeReplacement, grossNeed, recommended, data, yearsLeft };
  }, [income, age, retireAge, liabilities, existingCover]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Life Cover Calculator
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Estimate how much term life cover your family would need if your income stopped tomorrow (Human Life Value method).
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>Annual Income (₹)</Label>
                <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} min={100000} step={50000} />
                <Slider value={[income]} onValueChange={([v]) => setIncome(v)} min={300000} max={10000000} step={50000} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Your Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={18} max={65} />
                  <Slider value={[age]} onValueChange={([v]) => setAge(v)} min={18} max={65} step={1} />
                </div>
                <div className="space-y-3">
                  <Label>Retirement Age</Label>
                  <Input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} min={40} max={70} />
                  <Slider value={[retireAge]} onValueChange={([v]) => setRetireAge(v)} min={40} max={70} step={1} />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Outstanding Loans & Liabilities (₹)</Label>
                <Input type="number" value={liabilities} onChange={(e) => setLiabilities(Number(e.target.value))} min={0} step={100000} />
                <Slider value={[liabilities]} onValueChange={([v]) => setLiabilities(v)} min={0} max={20000000} step={100000} />
                <p className="text-xs text-muted-foreground">Home loan, car loan, personal loans, etc.</p>
              </div>
              <div className="space-y-3">
                <Label>Existing Life Cover (₹)</Label>
                <Input type="number" value={existingCover} onChange={(e) => setExistingCover(Number(e.target.value))} min={0} step={100000} />
                <Slider value={[existingCover]} onValueChange={([v]) => setExistingCover(v)} min={0} max={50000000} step={500000} />
              </div>

              <Card className="border-primary/30 bg-brand-orange-light">
                <CardContent className="p-5 text-center">
                  <p className="text-xs text-muted-foreground">Recommended Additional Cover</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-primary">{formatCurrency(result.recommended)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Covers ~{result.yearsLeft} earning years + liabilities − existing cover
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="border-border/60">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-4 font-display text-sm font-semibold text-foreground">How Your Cover Need Adds Up</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={result.data} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => `₹${(Math.abs(v) / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => formatCurrency(Math.abs(v))} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {result.data.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mt-4 border-border/60 bg-muted/40">
                <CardContent className="p-4 text-xs leading-relaxed text-muted-foreground">
                  This is an educational illustration using the income-replacement (Human Life Value) method — actual cover needs depend on dependents' expenses, goals and existing assets.
                  Balaji Nivesh is an AMFI-registered mutual fund distributor and does not sell insurance. For a term plan, consult a licensed insurance advisor — we're happy to connect you with one.
                </CardContent>
              </Card>

              <div className="mt-6">
                <CalculatorLeadCapture
                  source="life_cover"
                  context={`Life cover need: income ${formatCurrency(income)}, age ${age}, liabilities ${formatCurrency(liabilities)}, existing ${formatCurrency(existingCover)} → recommended ${formatCurrency(result.recommended)}`}
                  title="Want help securing your family's future?"
                  subtitle="We'll review your cover gap and your investment plan together — free, no obligation."
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

export default LifeCoverCalculator;
