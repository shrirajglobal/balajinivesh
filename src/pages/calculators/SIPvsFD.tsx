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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const fmt = (v: number) => "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const SIPvsFD = () => {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);
  const [fdRate, setFdRate] = useState(7);

  const result = useMemo(() => {
    const invested = monthly * years * 12;

    // SIP
    const r = Math.max(sipReturn, 0.01) / 100 / 12;
    const n = years * 12;
    const sipValue = Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));

    // FD equivalent (monthly deposits compounded annually)
    const fdR = Math.max(fdRate, 0.01) / 100 / 12;
    const fdValue = Math.round(monthly * ((Math.pow(1 + fdR, n) - 1) / fdR) * (1 + fdR));

    const data = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const inv = monthly * m;
      const sip = Math.round(monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r));
      const fd = Math.round(monthly * ((Math.pow(1 + fdR, m) - 1) / fdR) * (1 + fdR));
      data.push({ year: `Yr ${y}`, invested: inv, SIP: sip, FD: fd });
    }

    return { invested, sipValue, fdValue, difference: sipValue - fdValue, data };
  }, [monthly, years, sipReturn, fdRate]);

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> All Calculators</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            SIP vs FD Comparison
          </motion.h1>
          <p className="mt-2 text-muted-foreground">Compare potential SIP returns against Fixed Deposit growth.</p>
        </div>
      </section>
      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-3">
                <Label>Monthly Investment</Label>
                <Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} min={500} step={500} />
                <Slider value={[monthly]} onValueChange={([v]) => setMonthly(v)} min={500} max={200000} step={500} />
              </div>
              <div className="space-y-3">
                <Label>Period (Years)</Label>
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={30} step={1} />
                <p className="text-xs text-muted-foreground">{years} years</p>
              </div>
              <div className="space-y-3">
                <Label>Expected SIP Return (%)</Label>
                <Slider value={[sipReturn]} onValueChange={([v]) => setSipReturn(v)} min={6} max={20} step={0.5} />
                <p className="text-xs text-muted-foreground">{sipReturn}% per year (equity MF)</p>
              </div>
              <div className="space-y-3">
                <Label>FD Interest Rate (%)</Label>
                <Slider value={[fdRate]} onValueChange={([v]) => setFdRate(v)} min={4} max={10} step={0.25} />
                <p className="text-xs text-muted-foreground">{fdRate}% per year</p>
              </div>
              <div className="space-y-3">
                <Card className="border-border/60"><CardContent className="grid grid-cols-3 gap-2 p-4">
                  <div className="text-center"><p className="text-xs text-muted-foreground">Invested</p><p className="mt-1 font-display text-xs font-bold text-foreground">{fmt(result.invested)}</p></div>
                  <div className="text-center"><p className="text-xs text-muted-foreground">SIP Value</p><p className="mt-1 font-display text-xs font-bold text-primary">{fmt(result.sipValue)}</p></div>
                  <div className="text-center"><p className="text-xs text-muted-foreground">FD Value</p><p className="mt-1 font-display text-xs font-bold text-secondary">{fmt(result.fdValue)}</p></div>
                </CardContent></Card>
                <Card className="border-primary/30 bg-brand-orange-light"><CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">SIP earns more by</p>
                  <p className="mt-1 font-display text-lg font-bold text-primary">{fmt(result.difference)}</p>
                </CardContent></Card>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Card className="border-border/60"><CardContent className="p-4 sm:p-6">
                <h3 className="mb-4 font-display text-sm font-semibold text-foreground">SIP vs FD Growth</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Legend />
                    <Bar dataKey="FD" fill="hsl(var(--brand-blue))" radius={[2, 2, 0, 0]} name="FD" />
                    <Bar dataKey="SIP" fill="hsl(var(--brand-orange))" radius={[2, 2, 0, 0]} name="SIP (MF)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent></Card>
              <div className="mt-4 text-center">
                <Button asChild><Link to="/contact">Start Your SIP Today <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-3xl"><SebiDisclaimer variant="compact" /></div>
        </div>
      </section>
    </div>
  );
};

export default SIPvsFD;
