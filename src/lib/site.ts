/** Single source of truth for the public site address. */
export const SITE_URL = "https://www.balajinivesh.com";

/** Absolute, canonical URL for a path on the site (query/hash stripped). */
export function absoluteUrl(pathname = "/"): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${clean === "/" ? "/" : clean.replace(/\/+$/, "")}`;
}
