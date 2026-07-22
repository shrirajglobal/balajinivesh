import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, CalendarClock, X } from "lucide-react";
import { useWhatsAppContactHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const KEY = "bn_dwell_nudge_shown";
const MATCH = ["/solutions", "/calculators", "/tools", "/education"];

/**
 * One-time toast on solution/calculator/education pages after 30s of dwell.
 * Dismissible; capped once per session via sessionStorage.
 */
const DwellNudge = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const whatsappHref = useWhatsAppContactHref("Hi Balaji Nivesh, I saw your website — can you help me?");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    if (!MATCH.some((p) => location.pathname.startsWith(p))) return;

    const t = window.setTimeout(() => {
      if (window.scrollY > 200) {
        setShow(true);
        sessionStorage.setItem(KEY, "1");
      }
    }, 30000);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Need help?"
      className={cn(
        "fixed left-1/2 z-40 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-border bg-card p-4 shadow-2xl",
        "bottom-24 sm:bottom-6",
      )}
    >
      <button
        onClick={() => setShow(false)}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 font-display text-sm font-semibold text-foreground sm:text-base">Confused? Let a human explain.</p>
      <p className="mt-1 pr-6 text-xs text-muted-foreground sm:text-sm">
        Free 15-minute call with a qualified advisor. No pressure, no fees.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setShow(false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-green px-3 py-2 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <Link
          to="/contact"
          onClick={() => setShow(false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <CalendarClock className="h-4 w-4" /> Book a call
        </Link>
      </div>
    </div>
  );
};

export default DwellNudge;
