import { useSiteSettings } from "@/hooks/useSiteSettings";

/** Guaranteed fallback WhatsApp contact number (E.164, no +, no spaces) for Balaji Nivesh. */
export const DEFAULT_WHATSAPP_NUMBER = "919330079717";

/**
 * Returns the WhatsApp contact number to use for "talk to us" style CTAs.
 * Prefers the admin-configurable site setting, but always falls back to
 * DEFAULT_WHATSAPP_NUMBER so these buttons never silently break.
 */
export function useWhatsAppNumber(): string {
  const { data: settings } = useSiteSettings();
  const configured = (settings?.map.contact_whatsapp || settings?.map.contact_phone || "").replace(/[^\d]/g, "");
  return configured || DEFAULT_WHATSAPP_NUMBER;
}

/** Builds a wa.me link to contact Balaji Nivesh with a pre-filled message. */
export function useWhatsAppContactHref(message: string): string {
  const number = useWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
