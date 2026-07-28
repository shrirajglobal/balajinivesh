import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const CAN_ASK_KEY = "bn_can_ask_review";
const DISMISSED_KEY = "bn_review_dismissed_at";
const DISMISS_DAYS = 60;
const HIDDEN_PREFIXES = ["/admin", "/auth", "/partner/dashboard", "/partner/leads", "/partner/clients", "/partner/commissions"];

/**
 * Small floating "Rate us on Google" card that only appears AFTER a user has
 * shown intent (submitted a lead/contact form) and hasn't dismissed recently.
 * Never shown on admin/partner internal pages.
 */
const GoogleReviewNudge = () => {
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p))) {
      setVisible(false);
      return;
    }
    const canAsk = typeof window !== "undefined" && localStorage.getItem(CAN_ASK_KEY) === "1";
    if (!canAsk) { setVisible(false); return; }
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400 * 1000) {
      setVisible(false);
      return;
    }
    // Delay to avoid competing with page enter animations
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const reviewUrl = settings?.map.google_review_url || "";
  const rating = settings?.map.google_rating || "";

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  };

  const onClick = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  if (!visible || !reviewUrl) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[300px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-border bg-card p-4 shadow-2xl">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-50">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
          </div>
          <div className="flex-1">
            <p className="font-display text-sm font-semibold text-foreground">Loved working with us?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A quick Google review helps other families find us. It takes 30 seconds.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:opacity-90"
              >
                <Star className="h-3 w-3 fill-primary-foreground" />
                Leave a Google review
              </a>
              {rating && <span className="text-[11px] text-muted-foreground">Current: {rating} ★</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleReviewNudge;
