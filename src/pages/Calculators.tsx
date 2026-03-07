import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator, TrendingUp, ArrowUpRight, Landmark, PiggyBank, Shield, HeartPulse, UserCheck, ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Calculators = () => {
  const { t } = useLanguage();

  const calculators = [
    { icon: Calculator, title: t("calculators.sipTitle"), description: t("calculators.sipDesc"), path: "/calculators/sip", color: "bg-brand-orange-light text-primary" },
    { icon: TrendingUp, title: t("calculators.lumpsumTitle"), description: t("calculators.lumpsumDesc"), path: "/calculators/lumpsum", color: "bg-brand-blue-light text-secondary" },
    { icon: ArrowUpRight, title: t("calculators.stepUpTitle"), description: t("calculators.stepUpDesc"), path: "/calculators/step-up-sip", color: "bg-brand-green-light text-brand-green" },
    { icon: Landmark, title: t("calculators.retirementTitle"), description: t("calculators.retirementDesc"), path: "/calculators/retirement", color: "bg-brand-orange-light text-primary" },
    { icon: PiggyBank, title: t("calculators.sipVsFdTitle"), description: t("calculators.sipVsFdDesc"), path: "/calculators/sip-vs-fd", color: "bg-brand-blue-light text-secondary" },
    { icon: Shield, title: t("calculators.emergencyTitle"), description: t("calculators.emergencyDesc"), path: "/calculators/emergency-fund", color: "bg-brand-green-light text-brand-green" },
    { icon: HeartPulse, title: t("calculators.healthCheckTitle"), description: t("calculators.healthCheckDesc"), path: "/tools/health-check", color: "bg-brand-green-light text-brand-green" },
    { icon: UserCheck, title: t("calculators.riskTitle"), description: t("calculators.riskDesc"), path: "/tools/risk-profile", color: "bg-brand-blue-light text-secondary" },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-16 lg:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">{t("calculators.title")}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("calculators.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calc, i) => (
              <motion.div key={calc.path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Link to={calc.path}>
                  <Card className="group h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${calc.color}`}><calc.icon className="h-5 w-5" /></div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">{calc.title}</h3>
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{calc.description}</p>
                      <span className="flex items-center text-sm font-medium text-primary">{t("calculators.calculate")} <ArrowRight className="ml-1 h-4 w-4" /></span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-10">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            {t("calculators.personalized")}{" "}
            <Button variant="link" asChild className="h-auto p-0"><Link to="/contact">{t("calculators.freeConsult")}</Link></Button>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{t("calculators.disclaimer")}</p>
        </div>
      </section>
    </div>
  );
};

export default Calculators;
