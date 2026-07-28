## Fix Google Reviews: reliable link, auto-refresh, prominent homepage placement

Three problems, one coordinated fix.

### 1. Fix the broken review link

The current URL `https://share.google/IK6J7sBBQJRY6TR55` fails (screenshot: `ERR_BLOCKED_BY_RESPONSE`). Google's short-share links are unreliable when opened cross-app / cross-browser. Replace with the canonical Google "write review" deep link built from the Place ID:

```
https://search.google.com/local/writereview?placeid=ChIJU6iTkPd3AjoRgHIh_QBOn14
```

- Store `google_place_id = ChIJU6iTkPd3AjoRgHIh_QBOn14` in `site_settings`.
- Update `google_review_url` to the writereview URL above.
- Also expose a "see all reviews" URL: `https://search.google.com/local/reviews?placeid=ChIJU6iTkPd3AjoRgHIh_QBOn14` for the new homepage strip.

### 2. Auto-refresh rating & review count daily

Use the existing **Google Maps Platform** connector (already available in this workspace, gateway-backed) — no new API key or secret needed from you.

- Confirm/link the `google_maps` connection via `standard_connectors--connect` (one-click if a workspace connection already exists).
- New Edge Function `supabase/functions/refresh-google-reviews/index.ts`:
  - Reads `google_place_id` from `site_settings`.
  - Calls Places API (New) via gateway: `GET /places/v1/places/{place_id}` with `X-Goog-FieldMask: rating,userRatingCount`.
  - Updates `site_settings.google_rating` and `google_review_count` via service-role client.
  - Returns a small JSON summary for manual test runs.
- Daily cron via `pg_cron` + `pg_net` (inserted via `supabase--insert`, not migration, since it embeds project URL + anon key) — runs at 03:00 IST.
- Add a small "Refresh now" button in `AdminSiteSettings` for on-demand refresh.

### 3. Make the review CTA visible & inviting on the homepage

Today the only homepage cue is a small chip in `AuthorityStrip` — easy to miss and doesn't clearly say "you can leave a review." Add both:

**a) Enhance the AuthorityStrip badge** (`src/components/layout/AuthorityStrip.tsx`)
- Change label from "4.7 on Google · 54 reviews" to "★ 4.7 on Google · Rate us →" so the invitation to review is explicit.
- Point to the new writereview URL.

**b) New homepage reviews strip** (new component `src/components/home/GoogleReviewsStrip.tsx`, mounted in `src/pages/Index.tsx` before the footer / after testimonials-region)
- Large rating number (4.7), 5 gold stars, "Based on 54 Google reviews" subtitle.
- Two buttons: **"Read reviews on Google"** (opens reviews URL) and **"Write a review"** (opens writereview URL, primary style).
- One-line trust copy: "Families across India trust Balaji Nivesh with ₹310 Cr+ of goals. Share your experience."
- Uses the same design tokens (`bg-card`, `border-border`, `text-primary`) — no new palette.

### Technical details

**Files to add**
- `supabase/functions/refresh-google-reviews/index.ts`
- `src/components/home/GoogleReviewsStrip.tsx`

**Files to edit**
- `src/components/layout/AuthorityStrip.tsx` — clearer "Rate us →" copy.
- `src/pages/Index.tsx` — mount `<GoogleReviewsStrip />`.
- `src/pages/admin/AdminSiteSettings.tsx` — "Refresh Google rating" button that invokes the edge function.

**DB changes**
- Migration: none needed (site_settings row already exists — we'll upsert `google_place_id` via `supabase--insert`).

**Cron (via `supabase--insert`, not migration)**
```sql
select cron.schedule(
  'refresh-google-reviews-daily',
  '30 21 * * *',   -- 03:00 IST
  $$ select net.http_post(
       url:='https://<project>.supabase.co/functions/v1/refresh-google-reviews',
       headers:='{"Content-Type":"application/json","apikey":"<anon>"}'::jsonb,
       body:='{}'::jsonb
     ); $$
);
```

**Places API (New) call shape**
```
GET https://connector-gateway.lovable.dev/google_maps/places/v1/places/ChIJU6iTkPd3AjoRgHIh_QBOn14
Headers:
  Authorization: Bearer $LOVABLE_API_KEY
  X-Connection-Api-Key: $GOOGLE_MAPS_API_KEY
  X-Goog-FieldMask: rating,userRatingCount
```

### Order of execution
1. Verify `google_maps` connector is linked (or prompt connect).
2. Deploy `refresh-google-reviews` edge function.
3. Upsert `google_place_id` + fixed `google_review_url` in `site_settings`; run function once to populate live values.
4. Schedule daily cron.
5. Ship UI: enhanced AuthorityStrip badge + new homepage reviews strip + admin "Refresh now" button.