import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, CalendarClock } from "lucide-react";
import { useWhatsAppContactHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Persistent mobile-only bottom bar with two obvious actions.
 * Appears after the user scrolls past the hero. Auto-hides when a form
 * field is focused so it never covers the on-screen keyboard.
 */
const MobileStickyBar = () => {
  const [visible, setVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const whatsappHref = useWhatsAppContactHref("Hi Balaji Nivesh, I'd like to talk to an advisor.");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/partner/dashboard") || path.startsWith("/auth")) {
      return;
    }
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        setInputFocused(true);
      }
    };
    const onBlur = () => setInputFocused(false);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  if (typeof window !== "undefined") {
    const p = window.location.pathname;
    if (p.startsWith("/admin") || p.startsWith("/partner/dashboard") || p.startsWith("/auth")) return null;
  }

  return (
    <div
      aria-hidden={!visible || inputFocused}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-200 sm:hidden",
        visible && !inputFocused ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-2 gap-2 px-3 py-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-green px-3 py-2.5 text-sm font-semibold text-white active:scale-95"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp us
        </a>
        <Link
          to="/contact"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground active:scale-95"
        >
          <CalendarClock className="h-4 w-4" /> Book a call
        </Link>
      </div>
    </div>
  );
};

export default MobileStickyBar;
