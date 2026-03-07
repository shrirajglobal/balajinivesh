import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator,
  BookOpen,
  Target,
  HeartPulse,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Calculator,
    title: "Financial Calculators",
    description: "SIP, lumpsum, retirement & more — visualize your investment growth with interactive tools.",
    path: "/calculators",
    color: "bg-brand-orange-light text-primary",
  },
  {
    icon: HeartPulse,
    title: "Financial Health Check",
    description: "Get your Financial Health Score and discover areas to improve your financial wellbeing.",
    path: "/contact",
    color: "bg-brand-green-light text-brand-green",
  },
  {
    icon: Target,
    title: "Goal Based Planning",
    description: "Plan for retirement, child education, or home purchase with personalized SIP estimates.",
    path: "/calculators",
    color: "bg-brand-blue-light text-secondary",
  },
  {
    icon: BookOpen,
    title: "Investor Education",
    description: "Learn the basics of mutual funds, asset allocation, tax planning and more.",
    path: "/education",
    color: "bg-brand-orange-light text-primary",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Stay updated with weekly market summaries and economic trends explained simply.",
    path: "/insights",
    color: "bg-brand-blue-light text-secondary",
  },
  {
    icon: Shield,
    title: "Risk Profiling",
    description: "Understand your risk appetite and learn about suitable asset allocation strategies.",
    path: "/calculators",
    color: "bg-brand-green-light text-brand-green",
  },
];

const solutions = [
  { label: "Mutual Funds", path: "/solutions/mutual-funds" },
  { label: "Bonds", path: "/solutions/bonds" },
  { label: "Insurance", path: "/solutions/insurance" },
  { label: "IPO", path: "/solutions/ipo" },
  { label: "Fixed Deposits", path: "/solutions/fixed-deposits" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--brand-orange)/0.06),transparent_50%),radial-gradient(circle_at_20%_80%,hsl(var(--brand-blue)/0.06),transparent_50%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
              <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                AMFI Registered Mutual Fund Distributor
              </span>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={1}
              className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Plan Your Financial Future{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                with Confidence
              </span>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={2}
              className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Free financial planning tools, calculators, and educational resources to help you make informed investment decisions.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={3}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Button size="lg" asChild>
                <Link to="/calculators">
                  Explore Calculators <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Get Free Financial Health Check</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Invest Wisely
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tools, education, and insights — all in one place, completely free.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                custom={i}
              >
                <Link to={feature.path}>
                  <Card className="group h-full border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Solutions */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Investment Solutions We Distribute
            </h2>
            <p className="mt-4 text-muted-foreground">
              Learn about different financial products and find what aligns with your goals.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {solutions.map((s, i) => (
              <motion.div
                key={s.path}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={i}
              >
                <Button variant="outline" size="lg" asChild className="rounded-full">
                  <Link to={s.path}>{s.label}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  Why Investors Trust{" "}
                  <span className="text-primary">Balaji</span>{" "}
                  <span className="text-secondary">Nivesh</span>
                </h2>
                <ul className="mt-8 space-y-4">
                  {[
                    "AMFI registered mutual fund distributor",
                    "Education-first approach to investing",
                    "Free financial planning tools & calculators",
                    "Personalized goal-based investment planning",
                    "Transparent, no hidden charges",
                    "Compliant with SEBI & AMFI regulations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange-light to-brand-blue-light p-8 text-center lg:p-12">
                <p className="font-display text-5xl font-extrabold text-primary">10+</p>
                <p className="mt-2 text-sm text-muted-foreground">Years of Experience</p>
                <div className="my-6 h-px bg-border" />
                <p className="font-display text-5xl font-extrabold text-secondary">1000+</p>
                <p className="mt-2 text-sm text-muted-foreground">Happy Investors</p>
                <div className="my-6 h-px bg-border" />
                <p className="font-display text-5xl font-extrabold text-brand-green">₹50Cr+</p>
                <p className="mt-2 text-sm text-muted-foreground">Assets Under Distribution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Start Your Investment Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Get a free financial health check and discover how to grow your wealth with disciplined investing.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-background text-foreground hover:bg-background/90">
              <Link to="/contact">
                Get Free Health Check <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/calculators">Try Our Calculators</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
