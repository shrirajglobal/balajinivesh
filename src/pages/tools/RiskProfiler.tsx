import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Question {
  question: string;
  options: { label: string; score: number }[];
}

const questions: Question[] = [
  {
    question: "How would you react if your investments dropped 20% in a month?",
    options: [
      { label: "Sell everything immediately", score: 1 },
      { label: "Feel anxious but hold on", score: 2 },
      { label: "Stay calm and wait for recovery", score: 3 },
      { label: "Invest more at lower prices", score: 4 },
    ],
  },
  {
    question: "What is your primary investment goal?",
    options: [
      { label: "Protect my capital at all costs", score: 1 },
      { label: "Steady income with low risk", score: 2 },
      { label: "Balanced growth and income", score: 3 },
      { label: "Maximum growth, risk is acceptable", score: 4 },
    ],
  },
  {
    question: "How long can you stay invested without needing the money?",
    options: [
      { label: "Less than 2 years", score: 1 },
      { label: "2 to 5 years", score: 2 },
      { label: "5 to 10 years", score: 3 },
      { label: "More than 10 years", score: 4 },
    ],
  },
  {
    question: "What percentage of your income are you comfortable investing in equities?",
    options: [
      { label: "0% — I prefer only fixed returns", score: 1 },
      { label: "Up to 25%", score: 2 },
      { label: "25% to 50%", score: 3 },
      { label: "More than 50%", score: 4 },
    ],
  },
  {
    question: "How experienced are you with investing?",
    options: [
      { label: "Complete beginner", score: 1 },
      { label: "Some basic knowledge of FDs and MFs", score: 2 },
      { label: "Comfortable with mutual funds and SIPs", score: 3 },
      { label: "Experienced with stocks, MFs, bonds", score: 4 },
    ],
  },
  {
    question: "How would you describe your financial situation?",
    options: [
      { label: "Living paycheck to paycheck", score: 1 },
      { label: "Stable income with some savings", score: 2 },
      { label: "Good savings with growing investments", score: 3 },
      { label: "Strong financial position, surplus income", score: 4 },
    ],
  },
  {
    question: "If you had ₹10 lakh to invest today, what would you do?",
    options: [
      { label: "Put it all in FDs", score: 1 },
      { label: "Mostly FDs, some mutual funds", score: 2 },
      { label: "Split between equity and debt funds", score: 3 },
      { label: "Mostly equity for maximum growth", score: 4 },
    ],
  },
  {
    question: "How do you feel about market volatility?",
    options: [
      { label: "Very uncomfortable — I avoid it", score: 1 },
      { label: "Slightly uncomfortable but can manage", score: 2 },
      { label: "Neutral — part of investing", score: 3 },
      { label: "Comfortable — volatility creates opportunities", score: 4 },
    ],
  },
];

type Profile = "Conservative" | "Moderate" | "Growth";

const getProfile = (avgScore: number): Profile => {
  if (avgScore < 2) return "Conservative";
  if (avgScore < 3) return "Moderate";
  return "Growth";
};

const profileDetails: Record<Profile, { description: string; allocation: { name: string; value: number; color: string }[]; guidance: string[] }> = {
  Conservative: {
    description: "You prefer safety and capital preservation. You are uncomfortable with market volatility and prioritize stable, predictable returns.",
    allocation: [
      { name: "Debt / Fixed Income", value: 60, color: "hsl(214, 58%, 55%)" },
      { name: "Equity", value: 20, color: "hsl(27, 91%, 54%)" },
      { name: "Gold / Others", value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid", value: 10, color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Focus on debt mutual funds, FDs, and government bonds for the core of your portfolio",
      "Consider a small allocation (15-20%) to large-cap equity funds via SIP for long-term goals",
      "Prioritize liquid funds over savings accounts for emergency fund",
      "Avoid direct stocks or high-risk investments until you build comfort",
    ],
  },
  Moderate: {
    description: "You seek a balance between growth and safety. You can tolerate some market ups and downs for better long-term returns.",
    allocation: [
      { name: "Equity", value: 45, color: "hsl(27, 91%, 54%)" },
      { name: "Debt / Fixed Income", value: 35, color: "hsl(214, 58%, 55%)" },
      { name: "Gold / Others", value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid", value: 10, color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "A balanced mix of equity and debt funds is ideal for your profile",
      "Consider large-cap and flexi-cap mutual funds for equity exposure",
      "Use debt funds or bonds for stability and regular income needs",
      "SIP is the best approach to handle market volatility gradually",
    ],
  },
  Growth: {
    description: "You are comfortable with risk and seek maximum long-term growth. You understand that short-term volatility is the price of higher returns.",
    allocation: [
      { name: "Equity", value: 70, color: "hsl(27, 91%, 54%)" },
      { name: "Debt / Fixed Income", value: 15, color: "hsl(214, 58%, 55%)" },
      { name: "Gold / Others", value: 10, color: "hsl(152, 60%, 42%)" },
      { name: "Cash / Liquid", value: 5, color: "hsl(220, 10%, 70%)" },
    ],
    guidance: [
      "Equity-heavy portfolio with large-cap, mid-cap, and flexi-cap funds",
      "Consider a small allocation to small-cap funds for aggressive growth",
      "Maintain some debt exposure (15-20%) for portfolio stability",
      "Stay invested through market cycles — time in market beats timing the market",
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
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> Tools</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Investor Risk Profile
          </motion.h1>
          <p className="mt-2 text-muted-foreground">Understand your risk appetite and learn about suitable asset allocation.</p>
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
                    <p className="mt-3 font-display text-4xl font-extrabold text-primary">{profile}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{details.description}</p>
                  </CardContent>
                </Card>

                {/* Allocation Chart */}
                <Card className="mt-6 border-border/60">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground">Suggested Asset Allocation</h3>
                    <p className="mt-1 text-xs text-muted-foreground">This is an educational illustration, not a recommendation.</p>
                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={250}>
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

                {/* Guidance */}
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

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild><Link to="/contact">Get Personalized Guidance <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="mr-1 h-4 w-4" /> Retake Quiz</Button>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  This risk profiling tool is for educational purposes only. Asset allocation suggestions are general guidelines, not personalized investment advice. Balaji Nivesh is a mutual fund distributor, not a SEBI registered investment advisor.
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
