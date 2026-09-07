# Revise Investment Solutions to Mutual Funds, SIF, AIF, PMS

The product line-up across the whole site becomes four offerings only: Mutual Funds, SIF (Specialized Investment Fund), AIF (Alternative Investment Fund) and PMS (Portfolio Management Services). Bonds, Insurance, IPO and Fixed Deposits are retired, with their old links redirected so nothing breaks.

## What changes for visitors

- **Menus** — the "Invest" menu in the top bar and the products list in the footer show the four new offerings with fresh one-line descriptions.
- **Home page** — the "Investment Solutions We Distribute" strip lists the four offerings.
- **Three new pages** — `/solutions/sif`, `/solutions/aif`, `/solutions/pms`, built with the same layout as the Mutual Funds page: what it is, who it suits, investment horizon, risk level, key benefits and FAQs. Content written in the existing educational, distributor-only tone with the standard disclaimer.
  - SIF: SEBI's newer category sitting between mutual funds and PMS, minimum investment ₹10 lakh, higher flexibility strategies.
  - AIF: Categories I / II / III, minimum ₹1 crore, for HNI and accredited investors, longer lock-ins, illiquidity risk.
  - PMS: minimum ₹50 lakh, individually managed portfolio, discretionary vs non-discretionary, fee structures.
  - Each page states clearly that these are educational overviews and that products are offered through duly registered managers/AMCs, with the risk and eligibility criteria spelled out.
- **Old pages removed and redirected** — `/solutions/bonds`, `/solutions/insurance`, `/solutions/ipo`, `/solutions/fixed-deposits` now land on `/solutions/mutual-funds` instead of a dead page.
- **Life Cover Calculator stays** as an educational planning tool, with its existing note that we do not sell insurance. Its link to the retired Insurance page is removed.

## Other places the old product names appear

Each is reviewed and reworded so nothing references retired products:

- Risk Profiler and Financial Health Check result copy
- Contact page product dropdown / interest options
- Resources page
- Commission Disclosure, Terms of Use and Disclaimer wording, including a note that AIF/PMS/SIF commissions differ from mutual fund trail
- Chatbot knowledge prompt so the assistant no longer offers bonds, insurance, IPO or FDs
- Home page goal strip links, if any point at retired pages

## Technical notes

- Delete `src/pages/solutions/{Bonds,Insurance,IPO,FixedDeposits}.tsx`; add `SIF.tsx`, `AIF.tsx`, `PMS.tsx` using `SolutionPageTemplate`.
- `src/App.tsx`: new lazy routes for the three pages; four `<Navigate to="/solutions/mutual-funds" replace />` routes for the retired paths.
- `src/components/layout/Header.tsx` and `Footer.tsx`: rebuild the solutions arrays.
- `src/locales/{en,hi,bn}.json`: replace `nav.bonds/insurance/ipo/fixedDeposits` keys with `nav.sif/aif/pms` (English acronyms preserved in all three languages).
- `public/sitemap.xml`, `public/llms.txt` and `supabase/functions/sitemap/index.ts`: swap the URL entries.
- `supabase/functions/chatbot/index.ts`: update the system prompt product list.
- Grep-sweep for `bonds|insurance|ipo|fixed-deposits` afterwards to catch stragglers; typecheck and verify the new routes plus each redirect in the preview.
