import { motion } from "framer-motion";
import { Sparkles, TrendingUp, BookOpen, MailCheck } from "lucide-react";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import SEO from "@/components/seo/SEO";

const Subscribe = () => (
  <div>
    <SEO
      title="Subscribe to Samajhne Wali Khabar — Daily Market Update | Balaji Nivesh"
      description="Get the daily Indian market update — Sensex, Nifty, gold, USD/INR — explained simply, every weekday. Free, SEBI-aligned, one-tap unsubscribe."
    />
    <section className="bg-gradient-to-br from-brand-orange-light via-background to-brand-blue-light py-16 lg:py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-green">
            <Sparkles className="h-3.5 w-3.5" /> Free • Daily • SEBI-aligned
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-5xl">
            Samajhne Wali Khabar
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            India's market news — explained in plain language. Sensex, Nifty, gold, currency moves, with what each means for your money. Delivered every market day in under 2 minutes of reading.
          </p>
        </motion.div>
        <div className="mx-auto mt-10 max-w-2xl">
          <NewsletterSignup source="subscribe_page" variant="card" heading="Join 2,500+ smart investors" />
        </div>
      </div>
    </section>

    <section className="py-14">
      <div className="container">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            { icon: TrendingUp, title: "Real numbers, real context", text: "Not just 'Sensex up 200' — we tell you why and what it means for SIPs, FDs, and gold." },
            { icon: BookOpen, title: "Class-10 reading level", text: "No jargon. SIP, NAV, AMC stay — but everything else is in plain English/Hindi/Bengali." },
            { icon: MailCheck, title: "Privacy-first", text: "Double opt-in. Single sender. One-tap unsubscribe. Never sold, never shared." },
          ].map((b) => (
            <div key={b.title} className="rounded-xl border border-border/60 bg-card p-5">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-base font-semibold text-foreground">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Subscribe;
