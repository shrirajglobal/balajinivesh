import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  keywords?: string[];
  noindex?: boolean;
}

/**
 * Lightweight SEO head manager.
 * Sets <title>, meta description, canonical, OG tags, Twitter card, and optional JSON-LD.
 * Cleans up JSON-LD scripts on unmount so each page only emits its own.
 */
const SEO = ({ title, description, canonical, image, type = "website", jsonLd, keywords, noindex }: SEOProps) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        Object.entries(attrs).forEach(([k, v]) => k !== "content" && el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute("content", attrs.content);
      return el;
    };

    const upsertLink = (rel: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
      return el;
    };

    const created: HTMLElement[] = [];

    if (description) created.push(upsertMeta('meta[name="description"]', { name: "description", content: description }));
    if (keywords?.length) created.push(upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords.join(", ") }));
    if (noindex) created.push(upsertMeta('meta[name="robots"]', { name: "robots", content: "noindex,nofollow" }));

    const url = canonical ?? (typeof window !== "undefined" ? window.location.href : "");
    if (url) upsertLink("canonical", url);

    // OG
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    if (description) upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    if (url) upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    if (image) upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });

    // Twitter
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: image ? "summary_large_image" : "summary" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    if (description) upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    if (image) upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

    // JSON-LD
    const ldScripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((obj) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.text = JSON.stringify(obj);
        s.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(s);
        ldScripts.push(s);
      });
    }

    return () => {
      document.title = previousTitle;
      ldScripts.forEach((s) => s.remove());
    };
  }, [title, description, canonical, image, type, JSON.stringify(jsonLd), keywords?.join("|"), noindex]);

  return null;
};

export default SEO;
