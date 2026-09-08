import { useSiteSettings } from "@/hooks/useSiteSettings";

export const DEFAULT_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.balajiniveshpvt.balajinivesh";
export const DEFAULT_APP_STORE_URL =
  "https://apps.apple.com/us/app/balaji-nivesh/id1465867906";

export type MobilePlatform = "android" | "ios" | "other";

/** Best-effort platform sniff. Returns "other" on desktop / SSR. */
export function detectPlatform(): MobilePlatform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  // iPadOS 13+ reports as Mac with touch support
  if (/Macintosh/.test(ua) && typeof document !== "undefined" && "ontouchend" in document) return "ios";
  return "other";
}

/** Store links, overridable from site settings (play_store_url / app_store_url). */
export function useAppStoreLinks() {
  const { data: settings } = useSiteSettings();
  const play = settings?.map.play_store_url || DEFAULT_PLAY_STORE_URL;
  const ios = settings?.map.app_store_url || DEFAULT_APP_STORE_URL;
  const platform = detectPlatform();
  return {
    play,
    ios,
    platform,
    /** Single smart link: right store on phones, Play Store as desktop default. */
    smart: platform === "ios" ? ios : play,
  };
}

/** Lightweight click tracking so we can see which surface drives installs. */
export function trackAppDownload(platform: "android" | "ios", placement: string) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "app_download_click", platform, placement });
  } catch {
    /* ignore */
  }
}
