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
  Home,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBanner from "@/components/layout/HeroBanner";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Calculator, title: t("home.feat1Title"), description: t("home.feat1Desc"), path: "/calculators", color: "bg-brand-orange-light text-primary" },
    { icon: HeartPulse, title: t("home.feat2Title"), description: t("home.feat2Desc"), path: "/contact", color: "bg-brand-green-light text-brand-green" },
    { icon: Target, title: t("home.feat3Title"), description: t("home.feat3Desc"), path: "/calculators", color: "bg-brand-blue-light text-secondary" },
    { icon: BookOpen, title: t("home.feat4Title"), description: t("home.feat4Desc"), path: "/education", color: "bg-brand-orange-light text-primary" },
    { icon: TrendingUp, title: t("home.feat5Title"), description: t("home.feat5Desc"), path: "/insights", color: "bg-brand-blue-light text-secondary" },
    { icon: Shield, title: t("home.feat6Title"), description: t("home.feat6Desc"), path: "/calculators", color: "bg-brand-green-light text-brand-green" },
  ];

  const solutions = [
    { label: t("nav.mutualFunds"), path: "/solutions/mutual-funds" },
    { label: t("nav.bonds"), path: "/solutions/bonds" },
    { label: t("nav.insurance"), path: "/solutions/insurance" },
    { label: t("nav.ipo"), path: "/solutions/ipo" },
    { label: t("nav.fixedDeposits"), path: "/solutions/fixed-deposits" },
  ];

  const trustPoints = [t("home.trust1"), t("home.trust2"), t("home.trust3"), t("home.trust4"), t("home.trust5"), t("home.trust6")];

  const partnerPersonas = [
    { icon: Home, title: "Homemakers", desc: "Earn from home with flexible hours", color: "bg-brand-orange-light text-primary" },
    { icon: GraduationCap, title: "Students", desc: "Build income while studying", color: "bg-brand-blue-light text-secondary" },
    { icon: Briefcase, title: "CAs & Professionals", desc: "Add MF distribution to your practice", color: "bg-brand-green-light text-brand-green" },
    { icon: Users, title: "Anyone Passionate", desc: "Side income opportunity for all", color: "bg-brand-orange-light text-primary" },
  ];

  return (
    <div>
      {/* Hero */}
      <HeroBanner className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
            <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              {t("home.badge")}
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("home.heroTitle1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t("home.heroTitle2")}</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t("home.heroSubtitle")}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={3} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/calculators">{t("home.exploreCalc")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">{t("home.getFreeCheck")}</Link>
            </Button>
          </motion.div>
        </div>
      </HeroBanner>

      {/* Features Grid */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t("home.featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.featuresSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} custom={i}>
                <Link to={feature.path}>
                  <Card className="group h-full border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
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
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t("home.solutionsTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.solutionsSubtitle")}</p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {solutions.map((s, i) => (
              <motion.div key={s.path} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={i}>
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
                  {t("home.trustTitle1")}{" "}
                  <span className="text-primary">Balaji</span>{" "}
                  <span className="text-secondary">Nivesh</span>
                </h2>
                <ul className="mt-8 space-y-4">
                  {trustPoints.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange-light to-brand-blue-light p-8 text-center lg:p-12">
                <p className="font-display text-5xl font-extrabold text-primary">10+</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("home.yearsExp")}</p>
                <div className="my-6 h-px bg-border" />
                <p className="font-display text-5xl font-extrabold text-secondary">1000+</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("home.happyInvestors")}</p>
                <div className="my-6 h-px bg-border" />
                <p className="font-display text-5xl font-extrabold text-brand-green">₹50Cr+</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("home.aum")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="bg-muted/40 py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Join Our Team</h2>
            <p className="mt-4 text-muted-foreground">Become a mutual fund distribution partner. Earn commissions while helping families invest wisely.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerPersonas.map((p, i) => (
              <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={i}>
                <Card className="h-full border-border/60 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex flex-col items-center gap-3 p-6">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${p.color}`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link to="/partner">Become a Partner <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">{t("home.ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">{t("home.ctaSubtitle")}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-background text-foreground hover:bg-background/90">
              <Link to="/contact">{t("home.getHealthCheck")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/calculators">{t("home.tryCalc")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
