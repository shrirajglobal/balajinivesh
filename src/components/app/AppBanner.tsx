import { useEffect, useState } from "react";
import { X, Smartphone } from "lucide-react";
import { useAppStoreLinks, trackAppDownload } from "@/lib/appLinks";
import { cn } from "@/lib/utils";

const KEY = "bn_app_banner_dismissed_at";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/**
 * Slim, dismissible mobile-only app strip that sits just above the sticky
 * action bar. Appears after the visitor scrolls; stays hidden for 30 days
 * once closed.
 */
const AppBanner = () => {
  const [visible, setVisible] = useState(false);
  const { smart, platform } = useAppStoreLinks();

  useEffect(() => {
    const p = window.location.pathname;
    if (p.startsWith("/admin") || p.startsWith("/partner/dashboard") || p.startsWith("/auth")) return;
    try {
      const at = Number(localStorage.getItem(KEY) || 0);
      if (at && Date.now() - at < THIRTY_DAYS) return;
    } catch {
      /* ignore */
    }
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[60px] z-30 border-t border-border bg-card/95 backdrop-blur sm:hidden",
      )}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-primary">
          <Smartphone className="h-4 w-4" />
        </span>
        <p className="min-w-0 flex-1 text-xs leading-snug text-foreground">
          <span className="font-semibold">Balaji Nivesh app</span>
          <br />
          <span className="text-muted-foreground">Track your investments on your phone</span>
        </p>
        <a
          href={smart}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAppDownload(platform === "ios" ? "ios" : "android", "mobile-banner")}
          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground active:scale-95"
        >
          Install
        </a>
        <button onClick={dismiss} aria-label="Dismiss app banner" className="shrink-0 p-1 text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AppBanner;
