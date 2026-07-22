import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const EmergencyFundCalculator = () => {
  const [monthlyExpense, setMonthlyExpense] = useState(40000);
  const [emis, setEmis] = useState(10000);
  const [dependents, setDependents] = useState(2);
  const [jobStability, setJobStability] = useState<"stable" | "moderate" | "uncertain">("moderate");

  const result = useMemo(() => {
    const totalMonthly = monthlyExpense + emis;
    const monthsMap = { stable: 3, moderate: 6, uncertain: 9 };
    const baseMonths = monthsMap[jobStability];
    const extraMonths = dependents > 2 ? Math.min(dependents - 2, 3) : 0;
    const months = baseMonths + extraMonths;
    const fundNeeded = totalMonthly * months;

    return { totalMonthly, months, fundNeeded };
  }, [monthlyExpense, emis, dependents, jobStability]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Emergency Fund Calculator
          </motion.h1>
          <p className="mt-2 text-muted-foreground">Find out how much you should keep aside for emergencies.</p>
        </div>
      </section>
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Monthly Living Expenses</Label>
                <Input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} min={5000} step={5000} />
                <Slider value={[monthlyExpense]} onValueChange={([v]) => setMonthlyExpense(v)} min={5000} max={300000} step={5000} />
              </div>
              <div className="space-y-3">
                <Label>Monthly EMIs / Loan Payments</Label>
                <Input type="number" value={emis} onChange={(e) => setEmis(Number(e.target.value))} min={0} step={1000} />
                <Slider value={[emis]} onValueChange={([v]) => setEmis(v)} min={0} max={200000} step={1000} />
              </div>
              <div className="space-y-3">
                <Label>Number of Dependents</Label>
                <Input type="number" value={dependents} onChange={(e) => setDependents(Number(e.target.value))} min={0} max={10} />
                <Slider value={[dependents]} onValueChange={([v]) => setDependents(v)} min={0} max={10} step={1} />
              </div>
              <div className="space-y-3">
                <Label>Job / Income Stability</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["stable", "moderate", "uncertain"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setJobStability(opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        jobStability === opt
                          ? "border-primary bg-brand-orange-light text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-primary/30 bg-gradient-to-br from-brand-orange-light to-brand-blue-light">
                <CardContent className="p-8 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Your Emergency Fund Should Be</p>
                  <p className="mt-3 font-display text-4xl font-extrabold text-primary">{fmt(result.fundNeeded)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.months} months × {fmt(result.totalMonthly)}/month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardContent className="p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground">Where to Keep Your Emergency Fund</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Savings account with high interest rate",
                      "Liquid mutual funds for easy redemption",
                      "Short-term FDs with premature withdrawal facility",
                      "Avoid locking emergency funds in long-term investments",
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button asChild>
                  <Link to="/contact">Get Financial Planning Help <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-3xl"><SebiDisclaimer variant="compact" /></div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyFundCalculator;
