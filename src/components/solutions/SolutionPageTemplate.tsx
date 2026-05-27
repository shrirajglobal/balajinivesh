import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertTriangle, Users, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroBanner from "@/components/layout/HeroBanner";
import SEO from "@/components/seo/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface SolutionPageProps {
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  whatIsIt: string;
  suitableFor: string[];
  horizon: string;
  riskLevel: "Low" | "Low to Moderate" | "Moderate" | "Moderate to High" | "High";
  keyBenefits: string[];
  faqs: FAQ[];
}

const riskColors: Record<string, string> = {
  Low: "text-brand-green",
  "Low to Moderate": "text-brand-green",
  Moderate: "text-primary",
  "Moderate to High": "text-primary",
  High: "text-destructive",
};

const SolutionPageTemplate = ({
  title,
  subtitle,
  description,
  icon,
  whatIsIt,
  suitableFor,
  horizon,
  riskLevel,
  keyBenefits,
  faqs,
}: SolutionPageProps) => {
  return (
    <div>
      <SEO
        title={`${title} — ${subtitle} | Balaji Nivesh`}
        description={description.length > 160 ? `${description.slice(0, 157)}...` : description}
      />
      {/* Hero */}
      <HeroBanner>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange-light text-primary">
            {icon}
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </motion.div>
      </HeroBanner>

      {/* What is it */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              What is {title}?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{whatIsIt}</p>
            <p className="mt-6 text-xs text-muted-foreground italic">{description}</p>
          </div>
        </div>
      </section>

      {/* Key Info Cards */}
      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            <Card className="border-border/60">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <Users className="h-8 w-8 text-secondary" />
                <h3 className="font-display text-sm font-semibold text-foreground">Suitable For</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {suitableFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <Clock className="h-8 w-8 text-primary" />
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Investment Horizon
                </h3>
                <p className="text-sm text-muted-foreground">{horizon}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <AlertTriangle className={`h-8 w-8 ${riskColors[riskLevel]}`} />
                <h3 className="font-display text-sm font-semibold text-foreground">Risk Level</h3>
                <p className={`text-sm font-medium ${riskColors[riskLevel]}`}>{riskLevel}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Key Benefits
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {keyBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-secondary" />
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="mt-6">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Want to learn more about {title}?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Connect with us for a free consultation and personalized guidance.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/contact">
                Get Free Consultation <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/calculators">Try Our Calculators</Link>
            </Button>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground">
            Mutual fund investments are subject to market risks. Read all scheme-related documents
            carefully before investing.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SolutionPageTemplate;
