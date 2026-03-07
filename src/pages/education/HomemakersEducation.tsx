import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Heart, CheckCircle2, Lock, ArrowLeft, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import ProgressTracker from "@/components/education/ProgressTracker";
import CertificateModal from "@/components/education/CertificateModal";
import GiftClaimForm from "@/components/education/GiftClaimForm";

const topics = [
  {
    id: "emergency-fund",
    emoji: "🏪",
    title: "Stocking the Kitchen = Emergency Fund",
    scenario: "You always keep extra rice, dal and oil at home — just in case. That's exactly what an emergency fund does for your finances!",
    lesson: "An emergency fund is 3-6 months of expenses saved in a liquid account. Just like your pantry saves you from a last-minute grocery run, this fund protects you from unexpected expenses like medical bills or repairs.",
    action: "Start with saving ₹500/month in a separate savings account. Think of it as your financial pantry.",
  },
  {
    id: "budgeting-sip",
    emoji: "📊",
    title: "Monthly Budget Juggling = SIP Investing",
    scenario: "Every month you manage groceries, bills, school fees, and still save something. You're already a financial planner!",
    lesson: "A Systematic Investment Plan (SIP) works just like your monthly budgeting — a fixed amount goes to mutual funds every month, automatically. No timing the market, no stress.",
    action: "Try starting a SIP with as little as ₹500/month. It's like your monthly grocery budget — set it and it runs on autopilot.",
  },
  {
    id: "gold-diversification",
    emoji: "✨",
    title: "Gold in the Locker = Asset Diversification",
    scenario: "You have gold for safety, FD for stability, and maybe some savings. Without knowing it, you're already diversifying!",
    lesson: "Diversification means not putting all your money in one place. Gold, fixed deposits, mutual funds, and savings — each serves a purpose, just like different ingredients make a complete meal.",
    action: "Review where your family's money is. Is it all in one place? Spread it across 2-3 types of investments.",
  },
  {
    id: "chit-funds",
    emoji: "👯‍♀️",
    title: "Chit Funds & Kitty Parties vs Mutual Funds",
    scenario: "Kitty parties pool money and take turns. Sounds like teamwork? Mutual funds do the same — but with professional management!",
    lesson: "In a mutual fund, thousands of investors pool their money. A professional fund manager invests it wisely. Unlike chit funds, mutual funds are regulated by SEBI, making them safer and more transparent.",
    action: "Compare: Your ₹1,000/month in a chit fund vs the same in an ELSS mutual fund. The difference over 10 years will surprise you!",
  },
  {
    id: "goal-investing",
    emoji: "💒",
    title: "Planning a Wedding = Goal-Based Investing",
    scenario: "When you plan a wedding, you start saving years in advance, estimating costs and setting aside money. That's goal-based investing!",
    lesson: "Every financial goal — child's education, home renovation, retirement — needs its own plan. Identify the goal, the timeline, and the monthly amount needed, then pick the right investment.",
    action: "Write down your top 3 financial goals. Assign a timeline and monthly savings target to each one.",
  },
  {
    id: "financial-legacy",
    emoji: "👨‍👩‍👧‍👦",
    title: "Teaching Kids About Money = Financial Legacy",
    scenario: "When you give your child ₹100 and teach them to save ₹20, spend ₹60, and share ₹20 — you're building a financial legacy!",
    lesson: "Financial literacy is the greatest gift you can give your children. Starting early teaches them discipline, the value of money, and the habit of saving. It compounds over their entire lifetime.",
    action: "Open a joint savings account with your child. Let them see their money grow — it's the best money lesson.",
  },
];

const myths = [
  { myth: "Investing is only for earning members", truth: "Anyone can invest! Homemakers manage household finances expertly — the same skills apply to investing." },
  { myth: "You need lakhs to start investing", truth: "You can start a SIP with just ₹500/month. Small amounts grow big with time and compounding." },
  { myth: "Stock market is gambling", truth: "Investing in diversified mutual funds is backed by research and professional management — not luck." },
  { myth: "Gold is the safest investment", truth: "Gold is good for diversification but doesn't generate regular income. A balanced portfolio is safer." },
];

const topicIds = topics.map((t) => t.id);

const HomemakersEducation = () => {
  const { user } = useAuth();
  const { completedTopics, certificate, markComplete, allCompleted } = useEducationProgress("homemakers", topicIds);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showGiftClaim, setShowGiftClaim] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(30,30%,98%)] to-[hsl(27,91%,96%)] py-16 lg:py-24">
        <div className="container">
          <Link to="/education" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Education Hub
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Home className="h-8 w-8" />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              Smart Money Starts at Home
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              You already manage the hardest fund — your family. Now learn to grow your wealth with the same skills you use every day. 💪
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container max-w-4xl">
          {/* Progress */}
          {user && (
            <div className="mb-8">
              <ProgressTracker completed={completedTopics} total={topicIds.length} segment="homemakers" />
              {allCompleted && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => setShowCertificate(true)} className="bg-primary">
                    🎓 View Certificate
                  </Button>
                  <Button onClick={() => setShowGiftClaim(true)} variant="outline" className="border-brand-green text-brand-green">
                    🎁 Claim Gift
                  </Button>
                </div>
              )}
            </div>
          )}
          {!user && (
            <div className="mb-8 rounded-xl border border-primary/20 bg-brand-orange-light p-4 text-center">
              <p className="text-sm text-foreground">
                <Lock className="mr-1 inline h-4 w-4" />
                <Link to="/auth" className="font-medium text-primary underline">Sign in</Link> to track your progress, earn a certificate & claim a gift!
              </p>
            </div>
          )}

          {/* Life Lessons */}
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            <Heart className="mr-2 inline h-6 w-6 text-primary" />
            Life Lessons — From Home to Wealth
          </h2>
          <div className="space-y-6">
            {topics.map((topic, i) => {
              const done = completedTopics.includes(topic.id);
              return (
                <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className={`border-border/60 transition-all ${done ? "border-brand-green/40 bg-brand-green-light/30" : "hover:border-primary/30 hover:shadow-md"}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{topic.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-display text-lg font-bold text-foreground">{topic.title}</h3>
                            {done && <CheckCircle2 className="h-5 w-5 text-brand-green flex-shrink-0" />}
                          </div>
                          <div className="rounded-lg bg-accent/50 p-3 mb-3">
                            <p className="text-sm italic text-muted-foreground">
                              <Sparkles className="mr-1 inline h-3.5 w-3.5 text-primary" />
                              {topic.scenario}
                            </p>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground mb-3">{topic.lesson}</p>
                          <div className="rounded-lg border border-primary/20 bg-brand-orange-light p-3 mb-3">
                            <p className="text-sm font-medium text-foreground">
                              <Lightbulb className="mr-1 inline h-3.5 w-3.5 text-primary" />
                              Quick Action: {topic.action}
                            </p>
                          </div>
                          {user && !done && (
                            <Button size="sm" onClick={() => markComplete(topic.id)} variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green-light">
                              <CheckCircle2 className="mr-1 h-4 w-4" /> Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Myth Busters */}
          <h2 className="mt-16 mb-6 font-display text-2xl font-bold text-foreground">
            <ShieldCheck className="mr-2 inline h-6 w-6 text-secondary" />
            Myth Busters
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {myths.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full border-border/60">
                  <CardContent className="p-5">
                    <Badge variant="destructive" className="mb-2 text-xs">❌ Myth</Badge>
                    <p className="text-sm font-medium text-foreground mb-2">&ldquo;{m.myth}&rdquo;</p>
                    <Badge className="mb-2 text-xs bg-brand-green text-primary-foreground">✅ Truth</Badge>
                    <p className="text-sm text-muted-foreground">{m.truth}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-10">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            All content is for educational purposes only and does not constitute investment advice.
          </p>
        </div>
      </section>

      {certificate && (
        <>
          <CertificateModal
            open={showCertificate}
            onOpenChange={setShowCertificate}
            userName={user?.user_metadata?.full_name || ""}
            segment="homemakers"
            certificateNumber={certificate.certificate_number}
            onClaimGift={() => { setShowCertificate(false); setShowGiftClaim(true); }}
          />
          <GiftClaimForm open={showGiftClaim} onOpenChange={setShowGiftClaim} segment="homemakers" />
        </>
      )}
    </div>
  );
};

export default HomemakersEducation;
