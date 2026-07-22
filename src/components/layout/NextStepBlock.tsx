import { Link } from "react-router-dom";
import { MessageCircle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppContactHref } from "@/lib/whatsapp";

interface Props {
  headline?: string;
  subtext?: string;
  className?: string;
}

/**
 * Shared "what to do next" CTA block. Use at the end of Solution, Calculator,
 * and Education pillar pages so every journey ends with a single obvious action.
 */
const NextStepBlock = ({
  headline = "Not sure which is right for you?",
  subtext = "Talk to a Balaji Nivesh advisor free for 15 minutes — no pressure, no fees.",
  className = "",
}: Props) => {
  const whatsappHref = useWhatsAppContactHref("Hi Balaji Nivesh, I'd like a 15-min free plan call.");

  return (
    <section aria-label="Next step" className={className}>
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-gradient-to-br from-brand-orange-light via-card to-brand-blue-light p-6 text-center shadow-sm sm:p-8">
          <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">{headline}</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{subtext}</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/contact" className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" /> Book a free 15-min call
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-brand-green/40 text-brand-green hover:bg-brand-green/10 sm:w-auto"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </Button>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Balaji Nivesh Pvt Ltd · AMFI-registered Mutual Fund Distributor · ARN – 173142
          </p>
        </div>
      </div>
    </section>
  );
};

export default NextStepBlock;
