import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import ShareButtons from "@/components/share/ShareButtons";
import SEO from "@/components/seo/SEO";

interface Question {
  question: string;
  helper?: string;
  options: { label: string; score: number }[];
}

// SEBI-aligned 10-question profiler covering: capacity (income, dependents, horizon, liquidity)
// + tolerance (drawdown reaction, volatility comfort, experience, knowledge) + objective.
const questions: Question[] = [
  {
    question: "What is your age group?",
    helper: "Younger investors typically have a longer horizon and can take more risk.",
    options: [
      { label: "Under 30", score: 4 },
      { label: "30 to 45", score: 3 },
      { label: "45 to 60", score: 2 },
      { label: "60 and above", score: 1 },
    ],
  },
  {
    question: "How stable and recurring is your income?",
    options: [
      { label: "Irregular / variable income", score: 1 },
      { label: "Mostly stable with some uncertainty", score: 2 },
      { label: "Stable salary or business", score: 3 },
      { label: "Multiple stable income sources", score: 4 },
    ],
  },
  {
    question: "How many financial dependents do you have?",
    options: [
      { label: "More than 3", score: 1 },
      { label: "2 to 3", score: 2 },
      { label: "1", score: 3 },
      { label: "None", score: 4 },
    ],
  },
  {
    question: "For how long can you stay invested without needing this money?",
    helper: "Equity needs at least a 5-7 year horizon to smooth out volatility.",
    options: [
      { label: "Less than 1 year", score: 1 },
      { label: "1 to 3 years", score: 2 },
      { label: "3 to 7 years", score: 3 },
      { label: "More than 7 years", score: 4 },
    ],
  },
  {
    question: "Do you maintain an emergency fund of 6+ months of expenses?",
    options: [
      { label: "No emergency fund", score: 1 },
      { label: "Less than 3 months", score: 2 },
      { label: "3 to 6 months", score: 3 },
      { label: "More than 6 months", score: 4 },
    ],
  },
  {
    question: "What is your primary investment objective?",
    options: [
      { label: "Protect my capital — stable returns", score: 1 },
      { label: "Steady income with limited risk", score: 2 },
      { label: "Balanced growth with moderate risk", score: 3 },
      { label: "Maximum long-term growth", score: 4 },
    ],
  },
  {
    question: "How would you react if your portfolio fell 20% in a month?",
    options: [
      { label: "Sell everything immediately", score: 1 },
      { label: "Sell some to reduce loss", score: 2 },
      { label: "Hold and wait it out", score: 3 },
      { label: "Buy more at lower prices", score: 4 },
    ],
  },
  {
    question: "How would you describe your investment knowledge?",
    options: [
      { label: "No knowledge — complete beginner", score: 1 },
      { label: "Basic (FDs, savings)", score: 2 },
      { label: "Working knowledge (MFs, SIPs)", score: 3 },
      { label: "Advanced (stocks, derivatives, asset allocation)", score: 4 },
    ],
  },
  {
    question: "What share of your monthly savings can you commit to long-term investing?",
    options: [
      { label: "Less than 10%", score: 1 },
      { label: "10% to 25%", score: 2 },
      { label: "25% to 50%", score: 3 },
      { label: "More than 50%", score: 4 },
    ],
  },
  {
    question: "Which statement best describes your view on market ups and downs?",
    options: [
      { label: "Volatility worries me — I want stable returns", score: 1 },
      { label: "I can handle small fluctuations", score: 2 },
      { label: "I accept volatility as part of investing", score: 3 },
      { label: "Volatility is opportunity to invest more", score: 4 },
    ],
  },
];

type Profile = "Conservative" | "Moderately Conservative" | "Moderate" | "Moderately Aggressive" | "Aggressive";

const getProfile = (avgScore: number): Profile => {
  if (avgScore < 1.8) return "Conservative";
  if (avgScore < 2.4) return "Moderately Conservative";
  if (avgScore < 3.0) return "Moderate";
  if (avgScore < 3.5) return "Moderately Aggressive";
  return "Aggressive";
};

interface ProfileDetail {
  description: string;
  allocation: { name: string; value: number; color: string }[];
  guidance: string[];
}

const profileDetails: Record<Profile, ProfileDetail> = {
  Conservative: {
    description: "Capital safety is your top priority. You are uncomfortable with market falls and prefer predictable, low-volatility returns.",
    allocation: [
      { name: "Debt / Fixed Income", value: 65, color: "hsl(214, 58%, 55%)" },
      { name: "Equity",              value: 15, color: "hsl(27, 91%, 54%)" },
      { name: "Gold / Others",       value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid",       value: 10, color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Core portfolio in debt mutual funds, FDs, and government bonds",
      "Small (10-15%) equity allocation to large-cap funds for inflation protection",
      "Liquid funds work better than savings accounts for emergency money",
      "Avoid mid/small-cap funds and direct equity until comfort grows",
    ],
  },
  "Moderately Conservative": {
    description: "You want safety but understand some equity is needed to beat inflation. Small market falls are acceptable.",
    allocation: [
      { name: "Debt / Fixed Income", value: 55, color: "hsl(214, 58%, 55%)" },
      { name: "Equity",              value: 30, color: "hsl(27, 91%, 54%)" },
      { name: "Gold / Others",       value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid",       value: 5,  color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Debt-heavy mix with steady equity exposure via large-cap & flexi-cap SIPs",
      "Use hybrid/conservative-balanced funds for built-in asset allocation",
      "SIP route to enter equity gradually and average out market timing",
      "Review allocation once a year, rebalance if equity exceeds 35%",
    ],
  },
  Moderate: {
    description: "You seek a balance between growth and protection and can tolerate moderate ups and downs for better long-term returns.",
    allocation: [
      { name: "Equity",              value: 50, color: "hsl(27, 91%, 54%)" },
      { name: "Debt / Fixed Income", value: 35, color: "hsl(214, 58%, 55%)" },
      { name: "Gold / Others",       value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid",       value: 5,  color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Balanced equity (large + flexi-cap) and debt (short/medium duration) mix",
      "Add a small (5-10%) gold allocation for diversification",
      "Use goal-based SIPs — separate buckets for short, medium, long-term goals",
      "Stay invested through cycles; avoid timing the market",
    ],
  },
  "Moderately Aggressive": {
    description: "You are comfortable with market volatility and prioritize growth. You understand short-term losses are part of long-term gains.",
    allocation: [
      { name: "Equity",              value: 65, color: "hsl(27, 91%, 54%)" },
      { name: "Debt / Fixed Income", value: 20, color: "hsl(214, 58%, 55%)" },
      { name: "Gold / Others",       value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid",       value: 5,  color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Equity-led mix: flexi-cap, large-and-mid-cap, and select mid-cap funds",
      "Keep ~20% debt allocation for stability and rebalancing opportunities",
      "Use step-up SIP to grow contribution as income increases",
      "Annual rebalancing critical — equity can drift well above 70% in bull phases",
    ],
  },
  Aggressive: {
    description: "Long-horizon, high-risk-tolerance investor. Maximum equity for maximum compounding — you will not panic-sell in drawdowns.",
    allocation: [
      { name: "Equity",              value: 80, color: "hsl(27, 91%, 54%)" },
      { name: "Debt / Fixed Income", value: 10, color: "hsl(214, 58%, 55%)" },
      { name: "Gold / Others",       value: 5,  color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid",       value: 5,  color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Equity dominates: flexi-cap, mid-cap, and a measured small-cap allocation",
      "Maintain a small debt sleeve to fund opportunistic buying in corrections",
      "Time horizon must remain 7+ years — do not access for short-term needs",
      "Discipline matters more than fund picks — keep SIPs running through downturns",
    ],
  },
};

const RiskProfiler = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const progress = (currentQ / questions.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const avgScore = answers.length > 0 ? answers.reduce((s, v) => s + v, 0) / answers.length : 0;
  const profile = getProfile(avgScore);
  const details = profileDetails[profile];

  return (
    <div>
      <SEO
        title="Investor Risk Profiler — 10-Question SEBI-aligned Tool | Balaji Nivesh"
        description="Discover your risk appetite in under 2 minutes. SEBI-aligned 10-question profiler with personalized asset allocation guidance."
      />

      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> Tools</Link>
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-green" />
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-green">SEBI-aligned 10-question profile</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Investor Risk Profile
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Understand both your <strong>capacity</strong> to take risk and your <strong>tolerance</strong> for it. Get personalized asset allocation guidance.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {!showResult ? (
              <>
                <Progress value={progress} className="mb-8 h-2" />
                <p className="mb-2 text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</p>
                <AnimatePresence mode="wait">
                  <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                      {questions[currentQ].question}
                    </h2>
                    {questions[currentQ].helper && (
                      <p className="mt-2 text-sm text-muted-foreground">{questions[currentQ].helper}</p>
                    )}
                    <div className="mt-6 space-y-3">
                      {questions[currentQ].options.map((opt) => (
                        <button key={opt.label} onClick={() => handleAnswer(opt.score)} className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-brand-orange-light">
                          {opt.label}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-primary/30 bg-gradient-to-br from-brand-orange-light to-brand-blue-light">
                  <CardContent className="p-8 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Your Risk Profile</p>
                    <p className="mt-3 font-display text-3xl font-extrabold text-primary sm:text-4xl">{profile}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{details.description}</p>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-border/60">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground">Suggested Asset Allocation</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Educational illustration based on your profile, not personalized advice.</p>
                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={details.allocation} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                            {details.allocation.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: number) => `${v}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-border/60">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground">Educational Guidance</h3>
                    <ul className="mt-4 space-y-3">
                      {details.guidance.map((g, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:items-center">
                  <Button asChild><Link to="/contact">Get Personalized Guidance <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="mr-1 h-4 w-4" /> Retake Quiz</Button>
                </div>

                <div className="mt-6 flex justify-center">
                  <ShareButtons
                    title={`I'm a "${profile}" investor according to the Balaji Nivesh risk profiler. What's yours?`}
                    campaign="risk_profiler"
                    content={profile.toLowerCase().replace(/\s+/g, "_")}
                    compact
                  />
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  This risk profiling tool is for educational purposes only. Asset allocation suggestions are general guidelines, not personalized investment advice. Balaji Nivesh is an AMFI-registered Mutual Fund Distributor, not a SEBI-registered Investment Advisor.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RiskProfiler;
