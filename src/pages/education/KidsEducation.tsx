import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Star, CheckCircle2, Lock, ArrowLeft, Brain, Zap, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import ProgressTracker from "@/components/education/ProgressTracker";
import CertificateModal from "@/components/education/CertificateModal";
import GiftClaimForm from "@/components/education/GiftClaimForm";

const missions = [
  {
    id: "piggy-bank",
    number: 1,
    emoji: "🐷",
    title: "The Piggy Bank Secret",
    story: "Imagine you get ₹100 every month as pocket money. If you save just ₹30 from it, in one year you'll have ₹360! That's almost enough for a cool video game.",
    lesson: "Saving means keeping some money aside instead of spending it all. Even small amounts add up over time. The secret? Start early and be consistent!",
    thinkAboutIt: "If you save ₹10 every day, how much will you have in 30 days? In 365 days?",
    funFact: "The world's oldest piggy bank was found in Indonesia and is over 600 years old! 🏺",
  },
  {
    id: "compounding-magic",
    number: 2,
    emoji: "🌱",
    title: "The Magic of Multiplying Money",
    story: "Imagine you plant a mango seed today. In 5 years, you get mangoes. Those mangoes have seeds too! Plant them and you get even MORE mango trees. That's compound interest!",
    lesson: "When you save money in a bank, the bank pays you extra money called 'interest.' Next time, you earn interest on your original money PLUS the interest — your money makes babies! 👶",
    thinkAboutIt: "If you put ₹1,000 in a bank at 10% interest, you get ₹100 in Year 1. In Year 2, you earn interest on ₹1,100. How much is that?",
    funFact: "If you invested ₹100 at age 10 with 15% returns, by age 60 it would become ₹1,08,366! 🤯",
  },
  {
    id: "needs-vs-wants",
    number: 3,
    emoji: "🛒",
    title: "Needs vs Wants — The Supermarket Challenge",
    story: "You're at a supermarket with ₹500. You NEED notebooks for school (₹200) and WANT a fancy pen (₹300). What do you pick? The notebook, right? Because needs come first!",
    lesson: "Needs are things you must have — food, clothes, books. Wants are nice-to-have — games, toys, fancy gadgets. Smart money people always take care of needs first, then use leftover money for wants.",
    thinkAboutIt: "Make a list: Write 5 things you spent money on this week. Mark each as NEED or WANT. Surprised?",
    funFact: "Warren Buffett (the world's best investor) still lives in the same house he bought in 1958 for $31,500! He knows the difference between needs and wants. 🏠",
  },
  {
    id: "mini-investor",
    number: 4,
    emoji: "📈",
    title: "Be a Mini Investor",
    story: "When you buy a share of a company, you own a tiny piece of it! If the company does well, your share becomes more valuable. It's like owning a slice of pizza — if the pizza gets bigger, your slice does too! 🍕",
    lesson: "Stocks = tiny ownership in a company. Mutual funds = a basket of many stocks managed by experts. You don't need to be an adult to understand this — start learning now and you'll be ahead of 99% of adults!",
    thinkAboutIt: "Name 3 companies you use every day (hint: your phone brand, your favorite snack, your school bag). What if you owned a piece of them?",
    funFact: "If your parents invested ₹500/month in a mutual fund when you were born, you'd have over ₹5 lakhs by the time you're 18! 🎂",
  },
  {
    id: "inflation-monster",
    number: 5,
    emoji: "👹",
    title: "The Inflation Monster",
    story: "In 2010, a plate of momos cost ₹30. Today the same plate costs ₹80! The momos didn't change — the value of money did. That's the Inflation Monster eating your money's power! 🍜",
    lesson: "Inflation means prices go up over time. If your money just sits in a piggy bank, it loses value every year. That's why investing is important — your money needs to grow FASTER than inflation to stay powerful.",
    thinkAboutIt: "Ask your parents: How much did a movie ticket cost when they were kids? Compare it to today's price!",
    funFact: "In 1947, you could buy 1 kg of gold for ₹88.62. Today it costs over ₹7,00,000! That's inflation over 77 years. 🏅",
  },
  {
    id: "first-investment",
    number: 6,
    emoji: "🚀",
    title: "Your First ₹100 Investment Plan",
    story: "You have ₹100. Instead of spending it on chips and cold drinks, what if you invested it? Here's a simple plan any kid can follow!",
    lesson: "Step 1: Save ₹100 (from pocket money, gifts, or doing chores). Step 2: Ask your parents to help open a minor's savings account or start a Sukanya Samriddhi (for girls) or PPF account. Step 3: Watch your money grow every month. Step 4: Add more whenever you can. You've just become a mini investor! 🎉",
    thinkAboutIt: "Challenge: Can you save ₹100 this month without your parents adding extra? Where will you cut back?",
    funFact: "The youngest known stock investor was just 10 years old! You're never too young to start. 🌟",
  },
];

const quizQuestions = [
  { question: "Saving money means keeping it for later instead of spending now.", answer: true, emoji: "🐷" },
  { question: "₹100 today will buy the same things 10 years from now.", answer: false, emoji: "👹" },
  { question: "Mutual funds are managed by professional investors.", answer: true, emoji: "📈" },
  { question: "You need to be 18 to learn about investing.", answer: false, emoji: "🚀" },
];

const missionIds = missions.map((m) => m.id);

const KidsEducation = () => {
  const { user } = useAuth();
  const { completedTopics, certificate, markComplete, allCompleted } = useEducationProgress("kids", missionIds);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showGiftClaim, setShowGiftClaim] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean | null>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  const handleQuiz = (index: number, answer: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [index]: answer }));
    setQuizRevealed((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(270,60%,97%)] via-[hsl(200,70%,96%)] to-[hsl(45,90%,95%)] py-16 lg:py-24">
        <div className="container">
          <Link to="/education" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Education Hub
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <Rocket className="h-8 w-8" />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              Money Adventures for Young Minds 🚀
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Complete all 6 missions to become a certified Junior Money Master! Each mission is a fun step toward understanding money. 🌟
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="container max-w-4xl">
          {/* Progress */}
          {user && (
            <div className="mb-8">
              <ProgressTracker completed={completedTopics} total={missionIds.length} segment="kids" />
              {allCompleted && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => setShowCertificate(true)} className="bg-secondary hover:bg-secondary/90">
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
            <div className="mb-8 rounded-xl border border-secondary/20 bg-accent p-4 text-center">
              <p className="text-sm text-foreground">
                <Lock className="mr-1 inline h-4 w-4" />
                <Link to="/auth" className="font-medium text-secondary underline">Sign in</Link> to track your missions, earn a certificate & win a gift!
              </p>
            </div>
          )}

          {/* Missions */}
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            <Star className="mr-2 inline h-6 w-6 text-primary" />
            Your Money Missions
          </h2>
          <div className="space-y-6">
            {missions.map((mission, i) => {
              const done = completedTopics.includes(mission.id);
              return (
                <motion.div key={mission.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className={`border-border/60 transition-all ${done ? "border-brand-green/40 bg-brand-green-light/30" : "hover:border-secondary/30 hover:shadow-md"}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold ${done ? "bg-brand-green text-primary-foreground" : "bg-secondary/10 text-secondary"}`}>
                            {done ? "✅" : mission.number}
                          </div>
                          <span className="text-2xl">{mission.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">Mission {mission.number}</Badge>
                            <h3 className="font-display text-lg font-bold text-foreground">{mission.title}</h3>
                          </div>

                          {/* Story */}
                          <div className="rounded-lg bg-accent/50 p-3 mb-3">
                            <p className="text-sm text-foreground leading-relaxed">📖 {mission.story}</p>
                          </div>

                          {/* Lesson */}
                          <p className="text-sm leading-relaxed text-foreground mb-3">{mission.lesson}</p>

                          {/* Think About It */}
                          <div className="rounded-lg border-2 border-dashed border-secondary/30 bg-secondary/5 p-3 mb-3">
                            <p className="text-sm font-medium text-foreground">
                              <Brain className="mr-1 inline h-3.5 w-3.5 text-secondary" />
                              Think About It: {mission.thinkAboutIt}
                            </p>
                          </div>

                          {/* Fun Fact */}
                          <div className="rounded-lg bg-brand-orange-light p-3 mb-3">
                            <p className="text-sm text-foreground">
                              <Zap className="mr-1 inline h-3.5 w-3.5 text-primary" />
                              Fun Fact: {mission.funFact}
                            </p>
                          </div>

                          {user && !done && (
                            <Button size="sm" onClick={() => markComplete(mission.id)} className="bg-secondary hover:bg-secondary/90">
                              <CheckCircle2 className="mr-1 h-4 w-4" /> Mission Complete! 🎯
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

          {/* Quiz */}
          <h2 className="mt-16 mb-6 font-display text-2xl font-bold text-foreground">
            <HelpCircle className="mr-2 inline h-6 w-6 text-primary" />
            Quick Money Quiz 🧠
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quizQuestions.map((q, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-foreground mb-3">{q.emoji} {q.question}</p>
                  {!quizRevealed[i] ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleQuiz(i, true)} className="flex-1 border-brand-green text-brand-green">True</Button>
                      <Button size="sm" variant="outline" onClick={() => handleQuiz(i, false)} className="flex-1 border-destructive text-destructive">False</Button>
                    </div>
                  ) : (
                    <div className={`rounded-lg p-3 text-sm font-medium ${quizAnswers[i] === q.answer ? "bg-brand-green-light text-brand-green" : "bg-destructive/10 text-destructive"}`}>
                      {quizAnswers[i] === q.answer ? "✅ Correct!" : `❌ The answer is ${q.answer ? "True" : "False"}`}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-10">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            All content is for educational purposes only. Kids, always discuss financial decisions with your parents! 👨‍👩‍👧
          </p>
        </div>
      </section>

      {certificate && (
        <>
          <CertificateModal
            open={showCertificate}
            onOpenChange={setShowCertificate}
            userName={user?.user_metadata?.full_name || ""}
            segment="kids"
            certificateNumber={certificate.certificate_number}
            onClaimGift={() => { setShowCertificate(false); setShowGiftClaim(true); }}
          />
          <GiftClaimForm open={showGiftClaim} onOpenChange={setShowGiftClaim} segment="kids" />
        </>
      )}
    </div>
  );
};

export default KidsEducation;
