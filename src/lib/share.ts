// Centralized share & UTM helpers used by ShareButtons and any inline share triggers.

export type ShareSource =
  | "blog_post"
  | "market_update"
  | "calculator"
  | "tool"
  | "education"
  | "homepage"
  | "academy"
  | "generic";

export interface BuildShareUrlOptions {
  /** Absolute or relative URL of the page being shared. Defaults to current location. */
  url?: string;
  /** UTM source. Always "whatsapp" for WhatsApp shares. */
  source?: string;
  /** UTM medium. Defaults to "share". */
  medium?: string;
  /** UTM campaign — short identifier for the surface (e.g. "blog_post"). */
  campaign: ShareSource | string;
  /** Optional UTM content (post slug, calculator name, etc.). */
  content?: string;
}

/**
 * Build a fully-qualified URL with UTM parameters appended.
 * Existing UTM params on the URL are preserved (not overwritten).
 */
export const buildShareUrl = ({
  url,
  source = "whatsapp",
  medium = "share",
  campaign,
  content,
}: BuildShareUrlOptions): string => {
  const base =
    url ??
    (typeof window !== "undefined" ? window.location.href : "https://balajinivesh.studydna.in/");

  let absolute: URL;
  try {
    absolute = new URL(base, typeof window !== "undefined" ? window.location.origin : undefined);
  } catch {
    return base;
  }

  const params = absolute.searchParams;
  if (!params.has("utm_source")) params.set("utm_source", source);
  if (!params.has("utm_medium")) params.set("utm_medium", medium);
  if (!params.has("utm_campaign")) params.set("utm_campaign", campaign);
  if (content && !params.has("utm_content")) params.set("utm_content", content);

  return absolute.toString();
};

/** Build a wa.me link with a pre-filled message + UTM-tagged URL. */
export const buildWhatsAppShareHref = (message: string, url: string): string => {
  const text = `${message}\n\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
