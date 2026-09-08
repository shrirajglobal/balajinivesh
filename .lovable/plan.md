# Go-live cleanup for www.balajinivesh.com — links, SEO, conversion

Now that the site is live on its own address, three things need to be right: every link works, Google sees the correct address everywhere, and each page pushes visitors towards talking to the team.

## 1. Point everything at the new address

Several places still name the old test address `balajinivesh.studydna.in`. Confirmed in:

- `public/robots.txt` (sitemap line)
- `public/sitemap.xml` (all 33 entries)
- `src/lib/share.ts` (share fallback link)
- `src/pages/admin/AdminNewsletter.tsx` (two buttons inside newsletter emails)
- `supabase/functions/subscribe-newsletter` (confirmation email text and fallback)
- `supabase/functions/send-newsletter` (unsubscribe link)
- `supabase/functions/sitemap` (fallback address)

All become `https://www.balajinivesh.com`. The newsletter unsubscribe link is the important one — today it points at an address that no longer serves the site.

## 2. One official address for Google

Both `balajinivesh.com` and `www.balajinivesh.com` serve the same site, which Google can read as two duplicate sites. Fix:

- Every page declares `www.balajinivesh.com` as its official address, instead of whichever one the visitor happened to type (today the page reports the current browser address, so the apex and www versions each claim to be canonical).
- Sharing tags (title/description/preview image) in `index.html` switch from `balajinivesh.com` to the www version, and the preview image moves off the temporary Lovable preview screenshot to a permanent picture served from the site itself.

## 3. Broken-link sweep

Automated crawl of every page on the running site: click through every link in the header, footer, home page, hub pages, calculators, education, blog, forum, market updates and legal pages; record any that land on the "page not found" screen, any that go nowhere, and any outside link that fails to load. Fix everything found.

Known checks already done: all 22 hard-coded internal links resolve to real pages, and old product pages (bonds, insurance, IPO, fixed deposits) correctly redirect to Mutual Funds. The sweep covers the links built from data (blog posts, forum threads, calculator cards, locator, app store buttons, SEBI/AMFI/CAMS outside links) that a static check can't confirm.

## 4. Sitemap that stays correct by itself

The current `public/sitemap.xml` is hand-written and already out of date — it is missing the Crorepati, Child Education, Child Marriage and Life Cover calculators, the SIP Goal tool, Market Updates, the app page, the forum, videos, and the Commission Disclosure page, and it still lists a `/insights` address that now redirects.

There is already a working sitemap builder in the backend that includes every blog post automatically. Plan: point `robots.txt` at that live sitemap, and refresh the static file as a fallback so both list the same, complete set of pages. Blocked areas (admin, partner portal, sign-in, subscribe confirm/unsubscribe) stay blocked.

## 5. Per-page titles and descriptions

Check every public page has its own title (under 60 characters) and description (under 160), a single main heading, and pictures with descriptions for screen readers and image search. Fill in the ones that are missing or duplicated, with wording aimed at what people actually search for ("SIP calculator", "mutual fund distributor Kolkata", "retirement planning India").

Add the business details Google understands — company name, ARN registration, address, phone, opening hours — as structured data on the home and contact pages, and breadcrumb data on blog posts, calculators and product pages.

## 6. Conversion improvements

- **Every calculator ends in an ask.** Confirm each of the eleven calculators shows the "talk to us" step after a result, not just a number. Any missing one gets the same block.
- **One clear next step per page.** Product, education and legal pages get the same closing block: book a 15-minute call, or message on WhatsApp.
- **Cross-sell where it's natural.** Retirement calculator → mutual funds page; SIP vs FD → SIP calculator; Risk Profiler → matching product page; blog posts → the calculator matching the topic.
- **Faster first impression.** Home page loads its main picture eagerly and everything else lazily, so the page feels instant on a phone.

## 7. Verification

- Crawl every page again after the fixes and confirm zero dead links.
- Confirm each page reports `www.balajinivesh.com` as its official address.
- Confirm the sitemap lists every public page and nothing blocked.
- Re-run the built-in SEO review and report what it says.

## Technical notes

- Canonical/`og:url` resolution moves to a single `SITE_URL` constant (`https://www.balajinivesh.com`) used by `src/components/seo/SEO.tsx`, `share.ts`, the sitemap function and the newsletter functions, so the address is only written once.
- `SEO.tsx` currently defaults canonical to `window.location.href`; it will build from `SITE_URL` + pathname instead, keeping the per-page override.
- Structured data goes through the existing `jsonLd` prop on `SEO.tsx` (Organization + LocalBusiness on home/contact, BreadcrumbList elsewhere).
- Link crawl runs headless against the local preview and reports a table of source page → target → result.
- No database or compliance-logic changes.

## Worth knowing

This site is built as a single page app, so social apps like WhatsApp and LinkedIn only ever see one shared preview for the whole site rather than a per-page one. Google reads the per-page titles fine. Per-page social previews would need a server-rendered setup — the app can get that by upgrading to Lovable's latest template ([what the upgrade gives you](https://lovable.dev/blog/building-apps-using-tanstack-start)); happy to do it separately, nothing here depends on it.

Also: title, description and sitemap changes only reach the live address after the site is published again.
