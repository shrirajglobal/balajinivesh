# Promote the Balaji Nivesh mobile app across the site

Goal: make it obvious the app exists, and give people an easy, low-friction way to install it — without adding another top-level tab or crowding the existing WhatsApp/call actions.

## Where the app appears (in priority order)

1. **Homepage band (high visibility, mid-page)**
   A dedicated section placed after the trust/how-it-works area: short headline ("Track your investments on the go"), 3 short benefit lines (portfolio at a glance, statements anytime, secure login), official Google Play and App Store badges, and a QR code on desktop so people can scan with their phone. On mobile the QR is hidden and the badges become big tap targets.

2. **Smart store detection**
   One "Get the app" button that sends Android phones to Play Store, iPhones/iPads to the App Store, and shows both badges on desktop. Avoids the classic "wrong store" drop-off.

3. **Footer column**
   A compact "Get the app" column with both badges — present on every page, zero extra navigation cost.

4. **Thank-you / post-conversion moments**
   After someone submits a calculator lead, contact form, or newsletter confirmation, show a small "Next step: download the app" card. Highest-intent moment, no distraction from the primary conversion.

5. **Mobile bottom bar (mobile only, subtle)**
   Keep the existing two actions (WhatsApp, Book a call) as they are. Add a slim dismissible app strip above it that appears once per visitor after they scroll, with a close button and a 30-day memory so it never nags.

6. **Contact & About pages**
   A single line with badges under the contact options, so "how do I reach/see my account" queries land on the app.

No new page and no new top-level menu item. An `/app` route is added only as a shareable redirect target (e.g. for WhatsApp messages) that store-detects and forwards.

## Copy and compliance

- Wording stays distributor-appropriate: "track", "view your portfolio", "get statements" — no advice or return promises.
- The ARN/distributor line and disclaimers stay untouched.
- Badges use the official Google Play and Apple marketing assets, correct sizing and clear space.

## Technical notes

- New `src/lib/appLinks.ts`: store URLs (Play `com.balajiniveshpvt.balajinivesh`, Apple id `1465867906`), platform detection, `useAppStoreLink()`. URLs overridable via `site_settings` keys `play_store_url` / `app_store_url` so they can be changed from the admin panel later.
- New `src/components/app/AppPromo.tsx` (variants: `band`, `footer`, `inline`, `card`) and `AppBanner.tsx` (dismissible, `localStorage` flag).
- Store badges as local assets; QR code generated as a static asset pointing to `/app`.
- Clicks tracked with a simple event name (`app_download_click` + platform) so effectiveness is measurable.
- Touched files: `src/pages/Index.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Layout.tsx`, `src/pages/Contact.tsx`, `src/pages/About.tsx`, `src/components/leads/CalculatorLeadCapture.tsx`, `src/App.tsx` (the `/app` redirect).
- English, Hindi and Bengali strings added to the locale files.
