import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "full" | "compact" | "inline";

interface SebiDisclaimerProps {
  variant?: Variant;
  className?: string;
}

/**
 * SEBI / AMFI Compliance Disclaimer.
 *
 * IMPORTANT: This component is intentionally hardcoded and NOT editable from the admin
 * panel. Per SEBI / AMFI norms for Mutual Fund Distributors, every page that discusses
 * markets, schemes, or returns must show the standard risk disclaimer.
 *
 * Inject this component on:
 *   - Blog post pages
 *   - Market update pages
 *   - Calculator result pages
 *   - Education / NISM module pages
 *   - Footer (compact variant)
 */
const SebiDisclaimer = ({ variant = "full", className }: SebiDisclaimerProps) => {
  if (variant === "inline") {
    return (
      <p className={cn("text-xs italic text-muted-foreground", className)}>
        Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.
        Balaji Nivesh is an AMFI-registered Mutual Fund Distributor — not a SEBI-registered Investment Adviser.
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div
        role="note"
        aria-label="SEBI Compliance Disclaimer"
        className={cn(
          "rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs leading-relaxed text-muted-foreground",
          className,
        )}
      >
        <p className="font-semibold text-foreground">
          Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
        </p>
        <p className="mt-1">
          Past performance is not indicative of future returns. Balaji Nivesh is an AMFI-registered Mutual Fund
          Distributor and not a SEBI-registered Investment Adviser. The information provided is for educational
          purposes only and does not constitute investment advice.
        </p>
      </div>
    );
  }

  return (
    <aside
      role="note"
      aria-label="SEBI Compliance Disclaimer"
      className={cn(
        "rounded-lg border border-destructive/20 bg-destructive/5 p-5 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Statutory Disclaimer</h3>
          <p className="mt-2 font-semibold text-foreground">
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before
            investing.
          </p>
          <p className="mt-2">
            Past performance is not indicative of future returns. The NAV of mutual fund units may go up or down
            depending on market conditions. There is no assurance or guarantee that the objectives of any scheme will
            be achieved.
          </p>
          <p className="mt-2">
            Balaji Nivesh is an <strong>AMFI-registered Mutual Fund Distributor</strong>. We are <strong>not</strong> a
            SEBI-registered Investment Adviser, Research Analyst, or Portfolio Manager. The content on this page is for
            educational and informational purposes only and does not constitute investment advice, recommendation, or a
            solicitation to buy or sell any security or financial product.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SebiDisclaimer;
