/**
 * Google review deep-link helpers.
 *
 * We intentionally avoid `search.google.com/local/writereview?placeid=...` —
 * that host is blocked on many corporate / school / ISP networks
 * (ERR_BLOCKED_BY_RESPONSE), which broke the "Rate us" button for real users.
 *
 * The canonical Google Maps place URL works everywhere Google Maps works and
 * shows the "Write a review" button prominently on both mobile and desktop.
 */
export function buildWriteReviewUrl(placeId?: string | null, fallback?: string | null): string {
  if (placeId) return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  return fallback || "";
}

export function buildReadReviewsUrl(placeId?: string | null, fallback?: string | null): string {
  if (placeId) return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  return fallback || "";
}
