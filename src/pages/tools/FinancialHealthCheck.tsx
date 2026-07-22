import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";

interface Question {
  id: string;
  category: string;
  question: string;
  options: { label: string; score: number }[];
}

const questions: Question[] = [
  {
    id: "savings",
    category: "Savings",
    question: "What percentage of your monthly income do you save?",
    options: [
      { label: "Less than 10%", score: 5 },
      { label: "10% - 20%", score: 10 },
      { label: "20% - 30%", score: 15 },
      { label: "More than 30%", score: 20 },
    ],
  },
  {
    id: "emergency",
    category: "Emergency Fund",
    question: "How many months of expenses do you have in an emergency fund?",
    options: [
      { label: "No emergency fund", score: 0 },
      { label: "Less than 3 months", score: 5 },
      { label: "3 to 6 months", score: 12 },
      { label: "More than 6 months", score: 20 },
    ],
  },
  {
    id: "insurance_life",
    category: "Insurance",
    question: "Do you have adequate life insurance coverage (10x annual income)?",
    options: [
      { label: "No life insurance", score: 0 },
      { label: "Have some, but not enough", score: 5 },
      { label: "Adequate term insurance", score: 15 },
    ],
  },
  {
    id: "insurance_health",
    category: "Insurance",
    question: "Do you have health insurance for yourself and family?",
    options: [
      { label: "No health insurance", score: 0 },
      { label: "Only employer-provided", score: 5 },
      { label: "Personal health insurance (₹5L+)", score: 15 },
    ],
  },
  {
    id: "investments",
    category: "Investments",
    question: "How do you primarily invest your savings?",
    options: [
      { label: "Only in savings account or FDs", score: 3 },
      { label: "Mix of FDs and some mutual funds", score: 8 },
      { label: "Diversified — equity, debt, gold, etc.", score: 15 },
    ],
  },
  {
    id: "goals",
    category: "Goal Planning",
    question: "Do you have clearly defined financial goals with timelines?",
    options: [
      { label: "No specific goals", score: 0 },
      { label: "Vague goals, no timeline", score: 5 },
      { label: "Clear goals with investment plan", score: 15 },
    ],
  },
];

const maxScore = 100;

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-brand-green";
  if (score >= 50) return "text-primary";
  if (score >= 25) return "text-yellow-600";
  return "text-destructive";
};

const getScoreLabel = (score: number) => {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Needs Improvement";
  return "Requires Attention";
};

const getRecommendations = (answers: Record<string, number>) => {
  const recs: string[] = [];
  if ((answers.savings ?? 0) < 10) recs.push("Try to save at least 20% of your monthly income. Start by tracking expenses and cutting non-essentials.");
  if ((answers.emergency ?? 0) < 12) recs.push("Build an emergency fund covering 6 months of expenses. Start a dedicated SIP into a liquid fund.");
  if ((answers.insurance_life ?? 0) < 15) recs.push("Consider a term insurance plan with coverage of at least 10x your annual income for your family's financial security.");
  if ((answers.insurance_health ?? 0) < 15) recs.push("Get a personal health insurance policy of at least ₹5-10 lakh. Don't rely solely on employer coverage.");
  if ((answers.investments ?? 0) < 8) recs.push("Diversify your investments beyond FDs. Consider starting a SIP in mutual funds for long-term wealth creation.");
  if ((answers.goals ?? 0) < 15) recs.push("Define clear financial goals (retirement, children's education, etc.) with specific timelines and required amounts.");
  if (recs.length === 0) recs.push("You're on a strong financial path! Keep reviewing your plan annually and stay disciplined.");
  return recs;
};

const FinancialHealthCheck = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
  const progress = ((currentQ) / questions.length) * 100;

  const handleAnswer = (score: number) => {
    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.id]: score };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-12 lg:py-16">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/calculators"><ArrowLeft className="mr-1 h-4 w-4" /> Tools</Link>
          </Button>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Financial Health Check
          </motion.h1>
          <p className="mt-2 text-muted-foreground">Answer a few questions to get your Financial Health Score.</p>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {!showResult ? (
              <>
                <Progress value={progress} className="mb-8 h-2" />
                <p className="mb-2 text-xs text-muted-foreground">
                  Question {currentQ + 1} of {questions.length} — {questions[currentQ].category}
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                      {questions[currentQ].question}
                    </h2>
                    <div className="mt-6 space-y-3">
                      {questions[currentQ].options.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleAnswer(opt.score)}
                          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-brand-orange-light"
                        >
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
                {/* Score */}
                <Card className="border-primary/30 bg-gradient-to-br from-brand-orange-light to-brand-blue-light">
                  <CardContent className="p-8 text-center sm:p-12">
                    <p className="text-sm font-medium text-muted-foreground">Your Financial Health Score</p>
                    <p className={`mt-3 font-display text-6xl font-extrabold ${getScoreColor(totalScore)}`}>
                      {totalScore}
                    </p>
                    <p className="text-sm text-muted-foreground">out of {maxScore}</p>
                    <p className={`mt-2 font-display text-lg font-bold ${getScoreColor(totalScore)}`}>
                      {getScoreLabel(totalScore)}
                    </p>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="mt-6 border-border/60">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground">Improvement Areas</h3>
                    <ul className="mt-4 space-y-3">
                      {getRecommendations(answers).map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild>
                    <Link to="/contact">Get Personalized Guidance <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="mr-1 h-4 w-4" /> Retake Assessment
                  </Button>
                </div>

                <div className="mt-6"><SebiDisclaimer variant="compact" /></div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialHealthCheck;
