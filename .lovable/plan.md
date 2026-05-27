
# CRO Audit & Simplification Plan — Balaji Nivesh

## 1. The core problem (what hurts conversion today)

- **10 top-level nav items** (Home, Solutions ▾, Tools, Education, Blog, Market Updates, Videos, Find MFD, Partner, About). Hick's Law: every extra item delays the click and dilutes the primary CTA.
- **Two unrelated audiences share one nav**: investors (most visitors) and partner-aspirants. Partners get equal real estate, which confuses investors.
- **Content is fragmented across 4 separate destinations** (Blog, Market Updates, Videos, Education) that all serve the same job: "help me learn and trust you".
- **Weak commitment ladder**: the only conversion ask is a generic "Free Health Check" → `/contact`. There's no micro-yes (calculator → "email me this result"), no soft re-engagement (WhatsApp), and no urgency.
- **Trust proofs are abstract** ("1000+ investors", "₹50Cr+ AUM") but no faces, no testimonials, no SEBI/AMFI badge in the hero, no "as featured in".
- **The single primary CTA `/contact`** is a form page — high friction. A booking slot or WhatsApp tap converts 2–4× better for Indian fintech audiences.

## 2. Navigation consolidation — 10 items → 5

Reduce decisions in the header. Keep depth in mega-menus instead of flat links.

```text
BEFORE (10)                          AFTER (5 + utility)
─────────────────────                ──────────────────────────────────
Home                                 Invest  ▾   (mega-menu)
Investment Solutions ▾                 ├ Mutual Funds, Bonds, Insurance,
Tools & Calculators                    │  IPO, FDs
Education                              └ Calculators & Planners
Blog                                 Learn   ▾   (mega-menu)
Market Updates                         ├ Education Hub (Homemakers/Kids)
Videos                                 ├ Blog · Market Updates · Videos
Find MFD                               └ Community Forum
Partner                              Find an Advisor   (locator)
About                                Partner with Us
                                     About
                                     ─── utility ───
                                     [Lang] [Login] [WhatsApp us] ← primary
```

Rationale:
- "Invest" merges Solutions + Tools because a user shopping for "SIP" needs both the product page and the SIP calculator on the same hover.
- "Learn" merges Education + Blog + Market Updates + Videos + Forum. They share the same intent ("research before I trust you") and the same SEO topic cluster.
- "Find an Advisor" stays standalone — it's the highest-intent action besides booking.
- Primary header CTA changes from "Free Health Check" (vague) to **"Talk to us on WhatsApp"** with a chat icon, plus a secondary "Book a call". WhatsApp is the dominant lead channel for Indian distributors.

## 3. Page-level merges (cut surface area, keep SEO)

| Today | Merge into | Why |
|---|---|---|
| `/calculators` index + `/tools/health-check` + `/tools/risk-profile` + `/tools/sip-goal` | One **`/plan`** hub with tabs: Calculate · Assess · Plan a goal | All three answer "what should I do with my money?" Shared lead form at bottom. |
| `/insights` (Market Insights) + `/market-updates` | Single **`/market`** with tabs Daily Update · Weekly Outlook · Sector Insights | Currently splits the same audience and dilutes SEO juice. |
| `/blog` + `/videos` + `/education` index | Single **`/learn`** hub; videos become a content-type filter on blog, education stays as the structured-courses sub-section | Reduces 3 dead-end indexes to 1 with type filters. |
| `/about` + `/contact` + `/disclaimer` | Keep `/about` as the story page with contact + locations + ARN inline at the bottom. `/contact` form becomes a modal that opens from anywhere. `/disclaimer` stays for SEBI but linked only in footer. | Removes 2 nav clicks for the most common high-intent action. |
| `/forum/*` | Move under `/learn/community`. Keep routes; just renest in IA. | Forum traffic is low; surfacing it as a sub-tab keeps it discoverable without nav cost. |
| `/subscribe/*` flows | Keep functional, but remove from any visible nav. Trigger purely from inline newsletter components. | These are utility URLs, not destinations. |

Implementation note: keep the old URLs alive with 301 redirects so SEO and existing backlinks don't break.

## 4. Psychology-driven CRO wins (ranked by impact)

### Tier 1 — ship first, biggest lift

1. **Sticky "Talk to advisor" floating action button** (WhatsApp + Call + Book a slot, expanding). Present on every page including blog/calc. Mobile-first.
2. **Calculator → lead capture micro-ask**: after a user hits "Calculate SIP", show a soft prompt: *"Email me this plan + a free PDF"* — 1 field (email), pre-tick WhatsApp consent. This is the single highest-ROI change. It converts research traffic into leads.
3. **Hero rebuild with a single CTA + risk-reversal**: "Talk to a SEBI-registered MFD — 15-min free consultation, no pressure, no charges." Replace the two-button hero (calculators + free check) with one primary action + one ghost link.
4. **Social proof above the fold**: ARN badge, "Trusted by 1000+ families in Kolkata", 3 short testimonial cards with face + first name + city + investment goal. Currently the trust section is below the features fold.
5. **Exit-intent + 30%-scroll modal** on calculators and solution pages: *"Not sure where to start? Get a free 15-min portfolio review."*

### Tier 2 — meaningful, ship second

6. **Cross-sell strip at the bottom of every Solution page**: "People who explored Mutual Funds also looked at SIP Calculator → Tax-saving ELSS → Term Insurance." Use static curated rules, not ML. Drives session depth.
7. **Anchor pricing / scarcity language** on the Partner page: *"Onboarding 50 new partners this quarter — 12 spots left in Kolkata"* (rotate honestly). Loss aversion drives partner applications.
8. **Replace "Get Free Health Check" generic CTA with a 3-step micro-funnel**: Q1 age, Q2 monthly investable income, Q3 goal → "See your suggested plan + book a call". Each step is a commitment escalator (foot-in-the-door).
9. **Add WhatsApp click-to-chat with pre-filled message** on every calculator result: *"Hi, I just calculated my SIP for ₹X for Y years, can you help me start?"* Removes the user's burden of explaining themselves.
10. **Authority bar in the header sub-strip**: *"AMFI-registered ARN-XXXX · 10+ yrs experience · SEBI-compliant"* — only on home + key landing pages. Removes the "is this a scam?" friction Indian first-time investors carry.

### Tier 3 — polish, ship after analytics confirm Tier 1/2

11. **Comparison tables** on each solution page: MF vs FD, ULIP vs Term + MF. Investors love comparisons; this is high-search-intent SEO + cross-sell.
12. **"Last update X hours ago"** timestamp on Market Updates — recency = trust.
13. **One-line testimonial under hero CTA**: *"\"Started SIP at ₹2000, now have ₹3L corpus\" — Anita, homemaker, Howrah"* — beats stats for emotion.
14. **Loss-aversion framing on Education**: *"₹10,000 left in savings account for 10 years = ₹10,000. In equity MF = ~₹26,000. Don't let inflation eat your future."* Replace neutral copy with what-you-lose framing.
15. **Sticky bottom bar on mobile blog/article pages**: *"Liked this? Talk to the author →"* with WhatsApp tap.
16. **Forum → lead engine**: when an anonymous user posts a question, soft-prompt *"Want a personal answer from our team? Drop your number."*
17. **Partner page**: replace generic "Become a Partner" with persona-specific CTAs ("I'm a homemaker", "I'm a CA", "I'm a student") that scroll-anchor to tailored sections with case-study earnings.

## 5. Form & friction cleanup

- **Contact form**: reduce to Name + Phone (single field) + 1 dropdown ("What do you need help with?"). Move email to optional. Currently the form is the biggest drop-off step; phone-first matches Indian behavior.
- **Newsletter**: replace "Subscribe to newsletter" with a benefit: *"Daily 2-min market brief in Hindi/English on WhatsApp"* — and offer WhatsApp as an option, not just email.
- **Auth**: don't gate any calculator, blog, or tool behind login. Keep login for partner dashboard only. Currently auth is optional but visible, which creates "do I need an account?" friction.
- **Language toggle**: move into footer or a flag icon. Hindi/Bangla users mostly auto-detect; the visible toggle adds visual noise for English users (the majority).

## 6. Trust & compliance polish (SEBI/AMFI-safe)

- Display ARN number + AMFI badge in the **header sub-strip on the homepage**, not just the footer.
- Add a **"Why a distributor, not an advisor?"** explainer link in the footer disclaimer. This pre-empts the question and reinforces honesty.
- Keep all "guaranteed returns" language out (already enforced by memory) — but replace neutral phrasing like "explore mutual funds" with action-oriented: *"Start with as little as ₹500/month"* — compliant and conversion-focused.

## 7. What I will NOT change

- Admin, Partner Dashboard, Auth flows — all internal, no CRO value to investors.
- The Phase-6 chatbot, forum, locator, videos features — keep functionality, only re-nest under "Learn" / "Find Advisor".
- Brand colors, fonts, dot-grid hero treatment — stays per visual identity memory.
- All Supabase queries and DB schema.

## 8. Suggested implementation order (when you switch to build mode)

1. **Header redesign** + sticky WhatsApp FAB + new mega-menu IA (highest leverage, touches every page).
2. **Calculator post-result lead capture** (single biggest lift on existing traffic).
3. **Hero rebuild + testimonials + authority strip** on Home.
4. **Page merges**: `/plan` hub, `/market` hub, `/learn` hub, with 301-style redirects from old URLs.
5. **Contact form simplification + WhatsApp pre-fill links sitewide**.
6. **Tier-2 nudges**: cross-sell strips, partner scarcity, exit-intent modal.
7. Tier-3 polish + analytics review.

## 9. Open questions before I build

1. Do you have a WhatsApp Business number we can wire as the primary CTA, and is it OK to expose it publicly?
2. Can we list 3–5 real client testimonials (first name + city only, SEBI-compliant)? If not, I'll use generic trust copy.
3. For the Partner page scarcity language — do you actually cap monthly onboarding, or should I avoid scarcity tactics there?
4. Are you OK consolidating Blog + Market Updates + Videos under one `/learn` hub with type-filters, or do you want them kept as separate SEO landing pages?
