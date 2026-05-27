import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Phone, CalendarClock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Sticky floating action button — primary CRO lead-capture surface.
 * Always visible on every page (except admin/partner internal pages).
 * Expands to WhatsApp / Call / Book a call actions.
 */
const StickyCTA = () => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { data: settings } = useSiteSettings();

  const phone = (settings?.map.contact_phone || "").trim();
  const whatsapp = ((settings?.map.contact_whatsapp || settings?.map.contact_phone || "").replace(/[^\d]/g, ""));
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Balaji Nivesh, I'd like to speak with an advisor.")}`
    : "/contact";
  const callHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : "/contact";

  // Auto-hide on admin/partner routes
  useEffect(() => {
    const path = window.location.pathname;
    setHidden(path.startsWith("/admin") || path.startsWith("/partner/dashboard"));
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-1 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <a
            href={whatsappHref}
            target={whatsapp ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-full bg-brand-green pl-4 pr-5 py-3 text-white shadow-lg shadow-brand-green/30 transition-transform hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">WhatsApp us</span>
          </a>
          <a
            href={callHref}
            className="group flex items-center gap-3 rounded-full bg-secondary pl-4 pr-5 py-3 text-secondary-foreground shadow-lg shadow-secondary/30 transition-transform hover:scale-105"
          >
            <Phone className="h-5 w-5" />
            <span className="text-sm font-semibold">Call us</span>
          </a>
          <Link
            to="/contact"
            className="group flex items-center gap-3 rounded-full bg-foreground pl-4 pr-5 py-3 text-background shadow-lg shadow-foreground/30 transition-transform hover:scale-105"
          >
            <CalendarClock className="h-5 w-5" />
            <span className="text-sm font-semibold">Book a free call</span>
          </Link>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact menu" : "Talk to an advisor"}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all sm:h-16 sm:w-16",
          open
            ? "bg-foreground text-background shadow-foreground/30 rotate-90"
            : "bg-primary text-primary-foreground shadow-primary/40 ring-4 ring-primary/20"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />}
      </button>

      {!open && (
        <span className="hidden sm:inline-block rounded-full bg-foreground/90 px-3 py-1 text-[11px] font-semibold text-background shadow-md">
          Talk to an advisor
        </span>
      )}
    </div>
  );
};

export default StickyCTA;
