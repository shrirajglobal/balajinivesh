import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator, TrendingUp, ArrowUpRight, Landmark, PiggyBank, Shield, HeartPulse, UserCheck, ArrowRight,
  Target, Crown, GraduationCap, Gem, LifeBuoy, MessageCircle, Compass,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBanner from "@/components/layout/HeroBanner";
import { useWhatsAppContactHref } from "@/lib/whatsapp";

interface CalcItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  path: string;
  featured?: boolean;
}

const Calculators = () => {
  const { t } = useLanguage();
  const waHref = useWhatsAppContactHref("Hi! I was exploring the calculators on your website and have a question.");

  const groups: { id: string; title: string; tagline: string; items: CalcItem[] }[] = [
    {
      id: "goals",
      title: t("calculators.groupGoals"),
      tagline: t("calculators.groupGoalsTag"),
      items: [
        { icon: Crown, title: t("calculators.crorepatiTitle"), subtitle: t("calculators.crorepatiDesc"), path: "/calculators/crorepati", featured: true },
        { icon: GraduationCap, title: t("calculators.childEduTitle"), subtitle: t("calculators.childEduDesc"), path: "/calculators/child-education" },
        { icon: Gem, title: t("calculators.marriageTitle"), subtitle: t("calculators.marriageDesc"), path: "/calculators/child-marriage" },
        { icon: Landmark, title: t("calculators.retirementTitle"), subtitle: t("calculators.retirementDesc"), path: "/calculators/retirement" },
        { icon: Target, title: "SIP Goal Visualizer", subtitle: t("calculators.sipGoalDesc"), path: "/tools/sip-goal", featured: true },
      ],
    },
    {
      id: "invest",
      title: t("calculators.groupInvest"),
      tagline: t("calculators.groupInvestTag"),
      items: [
        { icon: Calculator, title: t("calculators.sipTitle"), subtitle: t("calculators.sipDesc"), path: "/calculators/sip" },
        { icon: TrendingUp, title: t("calculators.lumpsumTitle"), subtitle: t("calculators.lumpsumDesc"), path: "/calculators/lumpsum" },
        { icon: ArrowUpRight, title: t("calculators.stepUpTitle"), subtitle: t("calculators.stepUpDesc"), path: "/calculators/step-up-sip" },
        { icon: PiggyBank, title: t("calculators.sipVsFdTitle"), subtitle: t("calculators.sipVsFdDesc"), path: "/calculators/sip-vs-fd" },
      ],
    },
    {
      id: "protect",
      title: t("calculators.groupProtect"),
      tagline: t("calculators.groupProtectTag"),
      items: [
        { icon: Shield, title: t("calculators.emergencyTitle"), subtitle: t("calculators.emergencyDesc"), path: "/calculators/emergency-fund" },
        { icon: LifeBuoy, title: t("calculators.lifeCoverTitle"), subtitle: t("calculators.lifeCoverDesc"), path: "/calculators/life-cover" },
        { icon: HeartPulse, title: t("calculators.healthCheckTitle"), subtitle: t("calculators.healthCheckDesc"), path: "/tools/health-check" },
        { icon: UserCheck, title: t("calculators.riskTitle"), subtitle: t("calculators.riskDesc"), path: "/tools/risk-profile" },
      ],
    },
  ];

  return (
    <div>
      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">{t("calculators.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("calculators.subtitle")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {groups.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                {g.title}
              </a>
            ))}
          </div>
        </motion.div>
      </HeroBanner>

      {/* Helper strip */}
      <section className="border-b border-border/60 bg-muted/40 py-4">
        <div className="container flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="h-4 w-4 text-primary" /> {t("calculators.notSure")}
          </span>
          <Button variant="link" asChild className="h-auto p-0 text-sm font-semibold">
            <Link to="/tools/risk-profile">{t("calculators.takeProfiler")} <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-24 py-12 lg:py-16">
          <div className="container">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{group.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{group.tagline}</p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((calc, i) => (
                <motion.div key={calc.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <Link to={calc.path}>
                    <Card className={`group h-full transition-all hover:shadow-lg hover:shadow-primary/5 ${calc.featured ? "border-primary/40 bg-gradient-to-br from-brand-orange-light to-background" : "border-border/60 hover:border-primary/30"}`}>
                      <CardContent className="flex h-full flex-col gap-3 p-6">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-brand-orange-light text-primary">
                            <calc.icon className="h-5 w-5" />
                          </div>
                          {calc.featured && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">{t("calculators.popular")}</span>}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">{calc.title}</h3>
                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{calc.subtitle}</p>
                        <span className="flex items-center text-sm font-medium text-primary">{t("calculators.calculate")} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* WhatsApp CTA */}
      <section className="bg-muted/40 py-12">
        <div className="container text-center">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">{t("calculators.waTitle")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{t("calculators.waDesc")}</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" /> {t("calculators.waCta")}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">{t("calculators.freeConsult")}</Link>
            </Button>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-xs text-muted-foreground">{t("calculators.disclaimer")}</p>
        </div>
      </section>
    </div>
  );
};

export default Calculators;
