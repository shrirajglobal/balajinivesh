import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Users, BookOpen, Briefcase, Home, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroBanner from "@/components/layout/HeroBanner";
import ApplicationForm from "@/components/partner/ApplicationForm";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Partner = () => {
  const { t } = useLanguage();

  const personas = [
    { icon: Home, title: t("partner.personaHomemakers"), desc: t("partner.personaHomemakersDesc"), color: "bg-brand-orange-light text-primary" },
    { icon: GraduationCap, title: t("partner.personaStudents"), desc: t("partner.personaStudentsDesc"), color: "bg-brand-blue-light text-secondary" },
    { icon: Briefcase, title: t("partner.personaCAs"), desc: t("partner.personaCAsDesc"), color: "bg-brand-green-light text-brand-green" },
    { icon: Users, title: t("partner.personaProfessionals"), desc: t("partner.personaProfessionalsDesc"), color: "bg-brand-orange-light text-primary" },
  ];

  const benefits = [
    t("partner.benefit1"), t("partner.benefit2"), t("partner.benefit3"), t("partner.benefit4"),
    t("partner.benefit5"), t("partner.benefit6"), t("partner.benefit7"), t("partner.benefit8"),
  ];

  const steps = [
    { step: "1", title: t("partner.step1Title"), desc: t("partner.step1Desc") },
    { step: "2", title: t("partner.step2Title"), desc: t("partner.step2Desc") },
    { step: "3", title: t("partner.step3Title"), desc: t("partner.step3Desc") },
  ];

  return (
    <div>
      <HeroBanner className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={0}>
            <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              {t("partner.badge")}
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("partner.heroTitle1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Balaji Nivesh</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t("partner.heroSubtitle")}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={3} className="mt-8">
            <Button size="lg" asChild>
              <a href="#apply">{t("partner.applyNow")} <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
          </motion.div>
        </div>
      </HeroBanner>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t("partner.whoCanJoin")}</h2>
            <p className="mt-4 text-muted-foreground">{t("partner.whoCanJoinDesc")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {personas.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={i}>
                <Card className="h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${p.color}`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-muted/40 py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t("partner.whyPartner")}</h2>
                <ul className="mt-8 space-y-4">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-xl border border-border bg-gradient-to-br from-brand-orange-light to-brand-blue-light p-6 text-center">
                  <p className="font-display text-4xl font-extrabold text-primary">₹25,000+</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("partner.avgIncome")}</p>
                </div>
              </div>
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t("partner.howItWorks")}</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={i} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;
