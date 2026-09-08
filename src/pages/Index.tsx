import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator, BookOpen, Target, HeartPulse, TrendingUp, Shield,
  ArrowRight, CheckCircle2, Home, GraduationCap, Briefcase, Users,
  Crown, Landmark, Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBanner from "@/components/layout/HeroBanner";
import AuthorityStrip from "@/components/layout/AuthorityStrip";
import HowItWorks from "@/components/layout/HowItWorks";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import GoogleReviewsStrip from "@/components/home/GoogleReviewsStrip";
import AppPromo from "@/components/app/AppPromo";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
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
    { label: t("nav.sif"), path: "/solutions/sif" },
    { label: t("nav.aif"), path: "/solutions/aif" },
    { label: t("nav.pms"), path: "/solutions/pms" },
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
      <HeroBanner className="py-12 sm:py-16 lg:py-28">
        <div className="mx-auto max-w-3xl text-center px-1">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
            <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:px-4 sm:py-1.5">
              {t("home.badge")}
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:mt-6 sm:text-4xl lg:text-6xl">
            {t("home.heroTitle1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t("home.heroTitle2")}</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
            {t("home.heroSubtitle")}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={3} className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/contact">Book a free 15-min call <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/calculators">Try the SIP calculator first</Link>
            </Button>
          </motion.div>
          <motion.p initial="hidden" animate="visible" variants={fadeInUp} custom={4} className="mt-4 text-xs text-muted-foreground sm:text-sm">
            No fees · No pressure · Balaji Nivesh Private Limited — AMFI-registered Mutual Fund Distributor | ARN-173142
          </motion.p>
        </div>
      </HeroBanner>

      <HowItWorks />
      <AuthorityStrip />
      <AppPromo variant="band" placement="homepage" />

      {/* What's your goal? */}
      <section className="border-b border-border/60 py-10 sm:py-12">
        <div className="container">
          <h2 className="text-center font-display text-xl font-bold text-foreground sm:text-2xl">{t("home.goalStripTitle")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">{t("home.goalStripSubtitle")}</p>
          <div className="mx-auto mt-6 grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
            {[
              { icon: Crown, label: t("home.goalCrorepati"), path: "/calculators/crorepati" },
              { icon: Landmark, label: t("home.goalRetirement"), path: "/calculators/retirement" },
              { icon: GraduationCap, label: t("home.goalEducation"), path: "/calculators/child-education" },
              { icon: Gem, label: t("home.goalMarriage"), path: "/calculators/child-marriage" },
              { icon: Shield, label: t("home.goalEmergency"), path: "/calculators/emergency-fund" },
              { icon: Home, label: t("home.goalHome"), path: "/tools/sip-goal" },
            ].map((g) => (
              <Link key={g.path} to={g.path} className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition-all hover:border-primary/40 hover:shadow-md">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-brand-orange-light text-primary">
                  <g.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary sm:text-sm">{g.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Features Grid */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">{t("home.featuresTitle")}</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">{t("home.featuresSubtitle")}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeInUp} custom={i}>
                <Link to={feature.path}>
                  <Card className="group h-full border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-6">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg sm:h-11 sm:w-11 ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">{feature.title}</h3>
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
      <section className="bg-muted/40 py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">{t("home.solutionsTitle")}</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">{t("home.solutionsSubtitle")}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4">
            {solutions.map((s, i) => (
              <motion.div key={s.path} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={i}>
                <Button variant="outline" size="lg" asChild className="rounded-full text-sm">
                  <Link to={s.path}>{s.label}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                  {t("home.trustTitle1")}{" "}
                  <span className="text-primary">Balaji</span>{" "}
                  <span className="text-secondary">Nivesh</span>
                </h2>
                <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                  {trustPoints.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange-light to-brand-blue-light p-6 text-center sm:p-8 lg:p-12">
                <p className="font-display text-4xl font-extrabold text-primary sm:text-5xl">5+</p>
                <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{t("home.yearsExp")}</p>
                <div className="my-4 h-px bg-border sm:my-6" />
                <p className="font-display text-4xl font-extrabold text-secondary sm:text-5xl">2,500+</p>
                <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{t("home.happyInvestors")}</p>
                <div className="my-4 h-px bg-border sm:my-6" />
                <p className="font-display text-4xl font-extrabold text-brand-green sm:text-5xl">₹310Cr+</p>
                <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{t("home.aum")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="bg-muted/40 py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">Join Our Team</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">Become a mutual fund distribution partner. Earn commissions while helping families invest wisely.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {partnerPersonas.map((p, i) => (
              <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={i}>
                <Card className="h-full border-border/60 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex flex-col items-center gap-3 p-5 sm:p-6">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg sm:h-11 sm:w-11 ${p.color}`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">{p.title}</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center sm:mt-8">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/partner">Become a Partner <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container max-w-3xl">
          <NewsletterSignup source="homepage" variant="card" />
        </div>
      </section>

      <GoogleReviewsStrip />

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16 lg:py-20">
        <div className="container text-center px-6">
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">{t("home.ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80 sm:mt-4 sm:text-base">{t("home.ctaSubtitle")}</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild className="w-full bg-background text-foreground hover:bg-background/90 sm:w-auto">
              <Link to="/contact">{t("home.getHealthCheck")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
              <Link to="/calculators">{t("home.tryCalc")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
