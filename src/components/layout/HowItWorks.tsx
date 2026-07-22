import { Target, PhoneCall, Rocket } from "lucide-react";

/**
 * Homepage "How this works" 3-step strip — first-time-visitor orientation.
 * Placed directly under the hero so users instantly know what happens next.
 */
const HowItWorks = () => {
  const steps = [
    {
      icon: Target,
      title: "Tell us your goal",
      desc: "Retirement, kids' education, dream home — anything.",
      tone: "bg-brand-orange-light text-primary",
    },
    {
      icon: PhoneCall,
      title: "Get a free 15-min plan call",
      desc: "A qualified advisor walks you through the options.",
      tone: "bg-brand-blue-light text-secondary",
    },
    {
      icon: Rocket,
      title: "Start with as little as ₹500",
      desc: "Begin small, grow steadily. No pressure, no fees.",
      tone: "bg-brand-green-light text-brand-green",
    },
  ];

  return (
    <section aria-label="How it works" className="border-y border-border bg-background">
      <div className="container py-8 sm:py-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
          How this works
        </p>
        <ol className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-3 sm:gap-6">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 sm:p-5"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-sm font-semibold text-foreground sm:text-base">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {s.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
