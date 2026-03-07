import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Target, Heart, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.jpeg";

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Users, title: t("about.val1Title"), description: t("about.val1Desc") },
    { icon: Target, title: t("about.val2Title"), description: t("about.val2Desc") },
    { icon: Heart, title: t("about.val3Title"), description: t("about.val3Desc") },
    { icon: Award, title: t("about.val4Title"), description: t("about.val4Desc") },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-background to-accent py-16 lg:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              {t("about.title")} <span className="text-primary">Balaji</span>{" "}
              <span className="text-secondary">Nivesh</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("about.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{t("about.storyTitle")}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t("about.storyP1")}</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t("about.storyP2")}</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t("about.storyP3")}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange-light to-brand-blue-light p-12">
                <img src={logo} alt="Balaji Nivesh" className="mx-auto h-32 w-auto" />
                <p className="mt-6 text-center font-display text-xl font-bold text-foreground">
                  <span className="text-primary">Balaji</span>{" "}<span className="text-secondary">Nivesh</span>
                </p>
                <p className="mt-1 text-center text-sm text-muted-foreground">{t("about.amfiRegistered")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="container">
          <h2 className="text-center font-display text-2xl font-bold text-foreground sm:text-3xl">{t("about.valuesTitle")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <Card className="h-full border-border/60">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-orange-light text-primary">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="font-display text-xl font-bold text-foreground">{t("about.regTitle")}</h2>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">{t("about.arnNumber")}</strong> XXXXXX</p>
              <p><strong className="text-foreground">{t("about.amfiReg")}</strong> {t("about.amfiRegVal")}</p>
              <p><strong className="text-foreground">{t("about.type")}</strong> {t("about.typeVal")}</p>
              <p><strong className="text-foreground">{t("about.sebiComp")}</strong> {t("about.sebiCompVal")}</p>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">{t("about.regNote")}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">{t("about.ctaTitle")}</h2>
          <p className="mt-3 text-primary-foreground/80">{t("about.ctaSubtitle")}</p>
          <Button size="lg" variant="secondary" asChild className="mt-6 bg-background text-foreground hover:bg-background/90">
            <Link to="/contact">{t("about.contactUs")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
