import { Smartphone, PieChart, FileText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import StoreBadges from "./StoreBadges";
import appQr from "@/assets/app-qr.svg";

interface Props {
  variant?: "band" | "footer" | "inline" | "card";
  placement?: string;
  className?: string;
}

const benefits = [
  { icon: PieChart, text: "See your portfolio at a glance" },
  { icon: FileText, text: "Download statements anytime" },
  { icon: ShieldCheck, text: "Secure login, your data stays private" },
];

/**
 * Reusable "get the app" surface.
 * band   – full-width homepage section with QR on desktop
 * footer – compact column for the site footer
 * inline – one-liner with badges for content pages
 * card   – post-conversion next-step card
 */
const AppPromo = ({ variant = "band", placement = variant, className }: Props) => {
  if (variant === "footer") {
    return (
      <div className={className}>
        <h4 className="mb-3 font-display text-sm font-semibold text-foreground sm:mb-4">Get the app</h4>
        <p className="mb-3 text-sm text-muted-foreground">
          Track your investments on your phone.
        </p>
        <StoreBadges placement={placement} size="sm" className="gap-2" />
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-primary">
              <Smartphone className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Balaji Nivesh app</p>
              <p className="text-sm text-muted-foreground">Track your portfolio and get statements on the go.</p>
            </div>
          </div>
          <StoreBadges placement={placement} size="sm" />
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border border-secondary/30 bg-brand-blue-light/40 p-4 text-center", className)}>
        <p className="font-display text-sm font-bold text-foreground">Next step: get the app</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep an eye on your investments anytime, right from your phone.
        </p>
        <StoreBadges placement={placement} size="sm" className="mt-3 justify-center" />
      </div>
    );
  }

  // band
  return (
    <section className={cn("border-y border-border bg-muted/40 py-12 lg:py-16", className)}>
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-3 py-1 text-xs font-semibold text-primary">
              <Smartphone className="h-3.5 w-3.5" /> Mobile app
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Track your investments on the go
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              The Balaji Nivesh app puts your portfolio, statements and our team in your pocket — on Android and iPhone.
            </p>
            <ul className="mt-5 space-y-2.5">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background text-primary">
                    <b.icon className="h-3.5 w-3.5" />
                  </span>
                  {b.text}
                </li>
              ))}
            </ul>
            <StoreBadges placement={placement} className="mt-6" />
          </div>

          <div className="hidden justify-self-center text-center lg:block">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <img src={appQr} alt="QR code to download the Balaji Nivesh app" className="h-40 w-40" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Scan with your phone camera</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
