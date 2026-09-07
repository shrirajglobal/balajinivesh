# Update Commission Disclosure page from niveshcare.com reference

## Goal
Replace the current `/commission-disclosure` content with a fuller, SEBI/AMFI-aligned disclosure adapted from `https://niveshcare.com/disclosure.html`, while keeping Balaji Nivesh branding, styling, and existing functionality intact.

## What will change
- Rewrite `src/pages/CommissionDisclosure.tsx` to mirror the reference structure:
  1. **Regulatory status** — AMFI-registered Mutual Fund Distributor, ARN-173142, not a SEBI-registered Investment Adviser/Research Analyst/Portfolio Manager.
  2. **How distributor commissions work** — SEBI all-trail framework, trail commission paid by AMCs out of TER, no separate deduction from investor amount, no entry load, upfront commissions discontinued.
  3. **Illustrative commission table** — styled HTML table with the same broad fund-type / upfront / trail ranges as the reference, clearly labelled as indicative/illustrative and not a guarantee. Exact scheme-wise rates available on request.
  4. **Investor rights** — right to ask for exact commission, option to invest in direct plans, account statements reflect plan/expense ratios, suitability-first recommendation per AMFI Code of Conduct.
  5. **Other disclosures** — no separate fee from investors; participation in AMC training/BD programs; insurance referral commission paid by insurers per IRDAI norms and embedded in premium; aggregate commission details disclosed in CAS per SEBI.
  6. **Contact** — use live `site_settings` email/phone (fallback to `info@balajinivesh.com` / `+91 93300 79717`).
  7. **Standard AMFI/SEBI disclaimer** at the bottom.
- Keep the page English-only (no new i18n keys) and visually consistent with `Disclaimer.tsx` (container, headings, section cards, link styling).
- Update the "Last updated" date to today.
- No routing or footer changes needed; the page and footer link already exist.

## Out of scope
- No backend/schema changes.
- No translation keys (page remains static English).
- No new assets/images; the table will be a responsive HTML table.

## Verification
- Typecheck (`tsgo` or `bunx tsc --noEmit`) passes.
- Playwright check that `/commission-disclosure` loads, the table is visible, and the Balaji Nivesh ARN/contact details render.
