# Goal-Based Calculators + CRO Hub Makeover

Inspired by the Nivesh Care reference, we reframe our calculators around **life goals** (what users actually search for) while keeping technical names as subtitles, and add 4 high-demand goal calculators.

## 1. New calculator pages (4)

Each follows the existing calculator conventions (sliders + inputs, Recharts growth chart, `SebiDisclaimer`, `CalculatorLeadCapture` lead form, EN/HI/BN translations, SEO meta):

- **`/calculators/crorepati` — "Crorepati Calculator"** — reverse SIP: pick target (₹1 Cr default) + years + return rate → monthly SIP needed, with/without step-up option. Very high search volume.
- **`/calculators/child-education` — "Child Education Planner"** — current cost, inflation rate (default 6%), years until admission → future cost + monthly SIP needed.
- **`/calculators/child-marriage` — "Child Marriage Planner"** — same inflation-adjusted goal math, marriage-cost framing.
- **`/calculators/life-cover` — "Life Cover Calculator (HLV)"** — Human Life Value: income, age, dependents, liabilities → recommended cover. Educational only; clearly states we do not sell insurance and to consult for term insurance needs (cross-sell to contact).

## 2. Calculators hub redesign (`/calculators`)

Group cards by user intent instead of a flat list, friendly goal names first with the technical name as subtitle:

- **Plan Your Goals**: Crorepati, Child Education, Child Marriage, Retirement, SIP Goal Visualizer (featured)
- **Invest Smarter**: SIP, Lumpsum, Step-Up SIP, SIP vs FD
- **Protect Your Family**: Emergency Fund, Life Cover, Financial Health Check, Risk Profiler

CRO improvements: section anchors with jump links at top, "Not sure where to start? Take the 2-min Risk Profiler" helper strip, WhatsApp CTA at bottom ("Confused by numbers? Ask us on WhatsApp").

## 3. Homepage teaser

Add a compact "What's your goal?" strip on the homepage: 6 icon-chips (Crorepati, Retirement, Education, Marriage, Emergency, Dream Home → SIP Goal Visualizer) linking to the calculators — reduces clicks from home to a calculation.

## Technical details

- New files: `src/pages/calculators/CrorepatiCalculator.tsx`, `ChildEducationCalculator.tsx`, `ChildMarriageCalculator.tsx`, `LifeCoverCalculator.tsx`
- Routes + lazy imports in `src/App.tsx`; nav/hub entries in `Calculators.tsx`
- Translation keys in `en.json`, `hi.json`, `bn.json` (English financial terms preserved)
- Compliance: all pages carry the standard AMFI/SEBI disclaimer; life-cover page states returns/cover are illustrative, no insurance solicitation
- Verify: typecheck + Playwright click-through of each new calculator and hub
