## Final CRO + Mobile Fix Plan

### Point B — my final recommendation
Show the plain-English label as the **main title** and the original technical name as a small **muted subtitle** directly beneath it, inside the mega-menu and page hero. Top-level nav items (Invest, Learn, Find an Advisor, Partner, About) stay as-is — they're already simple.

Example (mega-menu item):
```text
What kind of investor am I?
Risk Profile · 2-min quiz
```
This keeps SEO/keyword recognition ("Risk Profile", "SIP Calculator") while making the action instantly obvious to a first-time visitor. On the page itself, the H1 becomes the plain-English question and the technical term appears as an eyebrow tag above it.

---

## Scope of work (in ship order)

### 1. Mobile menu drawer position (Fix 1)
- Add a `ref` on the `<header>` in `Header.tsx`, measure its live height with `ResizeObserver`, write it to `document.documentElement.style.setProperty('--header-h', ...)`.
- Mobile drawer uses `top: var(--header-h)` and `height: calc(100dvh - var(--header-h))`.
- Removes the "top items hidden behind banner" bug regardless of tagline wrap or viewport size.

### 2. Merge Chat + WhatsApp into ONE floating button (Fix 2, option B)
- Keep `ChatWidget`'s panel + edge-function logic; remove its standalone launcher button.
- Expose an `openChat()` function via a tiny Zustand store (or context).
- `StickyCTA` fan-out gets a fourth option: **"Ask our AI assistant"** which calls `openChat()`.
- Result: one clear orange bubble bottom-right on every page → tap → four labelled choices (WhatsApp / Call / Book a call / Ask AI).

### 3. Homepage upgrades (Points A, C, E)
- **One primary CTA:** keep only "Book a free 15-min call" as the loud orange button. Downgrade "Try the SIP calculator first" to a plain text link.
- **Trust line into hero:** move `AuthorityStrip` (ARN, 5+ yrs, 2,500 families, ₹310 Cr) directly under the hero sub-headline as a single scannable row.
- **"How this works" 3-step strip** immediately under the hero:
  ```text
  1. Tell us your goal   →   2. Get a free plan on a 15-min call   →   3. Start with as little as ₹500
  ```
  Big icons, one sentence each, no jargon.

### 4. Plain-English labels with subtitles (Point B, final form)
Update the following in `Header.tsx` mega-menu and matching page headers. Format: **Plain title** with `technical name · short hint` as muted subtitle.

| Location | Main label | Subtitle |
|---|---|---|
| Tools | What kind of investor am I? | Risk Profile · 2-min quiz |
| Tools | Score my money in 2 minutes | Financial Health Check |
| Tools | How much for my dream? | Goal Visualizer · SIP planner |
| Learn | Today's market, simply explained | Market Updates |
| Learn (col header) | Read & Watch | (replaces "Insights & Stories") |
| Learn | Ask the community | Community Forum |
| Buttons | See my result | (replaces "Calculate") |
| Buttons | Send my details | (replaces "Submit") |
| Buttons | Show me how → | (replaces "Learn more") |

Routes and SEO titles are unchanged.

### 5. Mobile sticky bottom bar (Point D)
- Slim bar above the FAB, appears only after user scrolls past hero.
- Two buttons: **"WhatsApp us"** (green) and **"Book a call"** (orange).
- Uses `env(safe-area-inset-bottom)` for iOS home indicator.
- Auto-hides when an input/textarea is focused (won't cover keyboard).

### 6. Standardized "Next step" block (Point A, end of pages)
- New shared component `NextStepBlock` with WhatsApp + Book-a-call buttons and one sentence: *"Not sure which is right for you? Talk to an advisor free for 15 minutes."*
- Drop into every Solution page (MF, Bonds, Insurance, FDs, IPO), every Calculator result section, every Education pillar page.
- Replaces the current inline `CalculatorLeadCapture` form on calculator results (still keeps the phone-capture form as an optional secondary card).

### 7. Progressive disclosure on long pages (Point G)
- Wrap below-the-fold sections of Education, Academy, and long Solution pages in shadcn `Accordion` with plain-English section titles.
- Only the first section stays open by default; the rest are collapsed.

### 8. Exit / dwell-time nudge (Point H)
- One-time toast after 30 seconds of scrolling on Solution + Calculator pages.
- Copy: *"Confused? Get a human to explain in 15 mins — free."* + WhatsApp + Book buttons.
- Dismissible, capped once per session via `sessionStorage`.

### 9. Partner section rename (Point I)
- Under `/partner`, replace "Partner Academy / NISM Prep / Content Bible" tiles with **Learn / Earn / Grow** (same underlying routes and content).
- Update `PartnerHome.tsx` copy + Partner sub-nav labels only.

---

## What stays untouched
- All routes, database schema, edge functions, auth, admin panel, RTA integration.
- All compliance disclaimers, ARN tagline, SEBI/AMFI wording.
- WhatsApp fallback number, `useWhatsAppContactHref` hook.
- Academy content and generation pipeline.

## Technical notes
- Header height via CSS variable so drawer, sticky bar, and any anchor scrolls can all use `var(--header-h)`.
- Chat/WhatsApp merge uses a shared imperative store — no prop drilling, no re-render churn on other pages.
- All copy changes are presentation-only; no i18n key deletions (add new keys, keep old ones for now to avoid missing-translation warnings in `hi.json` / `bn.json`, then translate in a follow-up).
- Estimated files touched: ~14 (Header, StickyCTA, ChatWidget, new `NextStepBlock`, new `MobileStickyBar`, new `HowItWorks`, `Index.tsx`, `AuthorityStrip.tsx`, ~5 solution pages, ~3 calculator pages, `PartnerHome.tsx`).

Reply **"go"** to build in this order (1 → 9), or tell me which steps to skip or reorder.