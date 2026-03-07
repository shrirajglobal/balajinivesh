import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Target, Heart, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.jpeg";

const values = [
  {
    icon: Users,
    title: "Investor First",
    description:
      "Every recommendation and tool is designed keeping the investor's best interest in mind. We believe in education-first approach to investing.",
  },
  {
    icon: Target,
    title: "Goal Oriented",
    description:
      "We help investors plan with purpose — whether it's retirement, child education, or wealth creation. Every goal deserves a clear plan.",
  },
  {
    icon: Heart,
    title: "Trust & Transparency",
    description:
      "We maintain complete transparency about our role as distributors, our fees, and the products we recommend. No hidden charges, ever.",
  },
  {
    icon: Award,
    title: "Regulatory Compliance",
    description:
      "We strictly adhere to SEBI and AMFI guidelines. Our processes are designed to be fully compliant with Indian financial regulations.",
  },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-background to-accent py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
              About <span className="text-primary">Balaji</span>{" "}
              <span className="text-secondary">Nivesh</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your trusted partner in financial planning and investment distribution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Our Story
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Balaji Nivesh was founded with a simple mission — to make financial planning
                accessible, understandable, and actionable for every Indian investor. We believe that
                informed investors make better decisions, and better decisions lead to financial
                freedom.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                As an AMFI registered mutual fund distributor, we help investors navigate the world
                of mutual funds, bonds, insurance, IPOs, and fixed deposits. Our approach is
                education-first — we empower investors with knowledge, tools, and insights before
                anything else.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Over the years, we have built lasting relationships with our investors by
                prioritizing transparency, trust, and disciplined investing. Our goal is to be the
                financial planning partner that every Indian family deserves.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange-light to-brand-blue-light p-12">
                <img src={logo} alt="Balaji Nivesh" className="mx-auto h-32 w-auto" />
                <p className="mt-6 text-center font-display text-xl font-bold text-foreground">
                  <span className="text-primary">Balaji</span>{" "}
                  <span className="text-secondary">Nivesh</span>
                </p>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  AMFI Registered Distributor
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="container">
          <h2 className="text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
            Our Values
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-border/60">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-orange-light text-primary">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Details */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="font-display text-xl font-bold text-foreground">
              Registration & Compliance
            </h2>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">ARN Number:</strong> XXXXXX
              </p>
              <p>
                <strong className="text-foreground">AMFI Registration:</strong> Valid & Active
              </p>
              <p>
                <strong className="text-foreground">Type:</strong> Mutual Fund Distributor
                (Individual / Firm)
              </p>
              <p>
                <strong className="text-foreground">SEBI Compliance:</strong> Compliant with all
                applicable SEBI regulations
              </p>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Balaji Nivesh operates as a mutual fund distributor registered with AMFI. We are not a
              SEBI Registered Investment Advisor (RIA).
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
            Let's Plan Your Financial Future Together
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Connect with us for a free consultation.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="mt-6 bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/contact">
              Contact Us <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
