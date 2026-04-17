

# Balaji Nivesh v2.0 — Phased Rollout Plan

## Strategic Overview

The strategy document defines 3 core pillars + supporting features. I'm structuring this into **7 implementation phases** with a strong emphasis on **automation first** and a **central Integrations Hub** in the admin panel where you can plug in any AI provider, market data API, email service, WhatsApp, or analytics tool — without code changes later.

---

## Phase 0 — Foundation: Admin Integrations Hub & Compliance Layer
**Goal:** Build the central nervous system that every later phase plugs into.

1. **Integrations Hub** (`/admin/integrations`) — A single screen where the admin manages API connections:
   - **AI Providers**: Lovable AI (default, Gemini/GPT-5/Claude), plus ability to add custom keys for Anthropic Claude direct, OpenAI, Perplexity later
   - **Market Data**: NSE India / Alpha Vantage / MoneyControl (key + endpoint config)
   - **Email**: Resend (newsletters, alerts) — via Lovable connector
   - **WhatsApp**: Twilio / WhatsApp Business API (gift claims, lead alerts, share tracking)
   - **Analytics**: GA4 Measurement ID, GTM, Search Console verification token
   - **Storage of keys**: Secrets via Supabase Edge Function secrets; non-secret config in a new `integration_settings` table
   - **Test connection** button per integration (calls a small edge function ping)
   - **Enable/disable toggle** per integration so features gracefully degrade

2. **Global Compliance Component** — A hardcoded `<SebiDisclaimer />` React component automatically injected into Blog, Market Updates, NISM module, and Footer. Not editable by admin (per strategy doc requirement).

3. **Master ARN/AMFI settings** — Stored in `site_settings` table, surfaced site-wide automatically.

---

## Phase 1 — SEO & Automated Blog Infrastructure
**Goal:** Topical authority engine with full automation pipeline.

1. **Database**: `blog_posts`, `blog_categories`, `blog_tags`, `blog_generation_jobs`
2. **Public**: `/blog`, `/blog/investor`, `/blog/partner`, `/blog/[slug]` with JSON-LD Article schema, OG tags, breadcrumbs
3. **Auto-generated** `sitemap.xml` and `robots.txt` (disallow `/partner/`, `/admin/`)
4. **Admin Blog CMS** (`/admin/blog`):
   - **AI Auto-Draft**: Pick a content pillar (SIP Basics, NISM Prep, Local Context…), AI generates a full SEO-optimised draft using the configured AI provider, with embedded SEBI disclaimer and meta tags
   - **Content Calendar**: Auto-schedule "Day 1 Investor / Day 3 Partner" alternating cadence — cron edge function picks the next slot
   - **One-click publish** with compliance scan (blocks "guaranteed", "best fund", scheme names)
   - Rich-text editor for manual edits
5. **Automation cron**: Scheduled edge function generates the next post 24 hours before publish slot, queued for one-click admin approval (Phase 1 of strategy)

---

## Phase 2 — Daily Market Intelligence ("Samajhne Wali Khabar")
**Goal:** Daily auto-generated market update with admin review gate.

1. **Database**: `market_updates` (sensex, nifty, gold, silver, crude, INR/USD, summary, impact, status, draft/approved/published)
2. **Public**: `/market-updates` page — today's update card + 30-day calendar archive + WhatsApp share
3. **Automation pipeline** (edge function, cron 4:30 PM IST weekdays):
   - Fetches market data from configured Market Data API
   - Calls AI provider with the system prompt from the strategy doc (Class 10 reading level, no advice, mandatory disclaimer)
   - Saves as `draft`, sends admin push notification
4. **Admin** (`/admin/market-updates`): Review draft → one-click approve → auto-publishes + auto-emails newsletter subscribers + auto-posts to WhatsApp broadcast (via integration)
5. **Phase escalation toggle**: Admin can flip "Assisted → Semi-Auto → Full Auto" per the strategy timeline

---

## Phase 3 — Partner Learning University
**Goal:** Full mentor-style training platform with progress tracking and certificates.

1. **Database**: `learning_modules`, `learning_chapters`, `chapter_content` (rich text), `quiz_questions`, `quiz_attempts`, `partner_module_progress`, `learning_certificates`
2. **4 Modules built**: NISM V-A Prep (10 chapters + 3 mock tests), Product Knowledge (8 topics), Sales & Pitching (12 conversations), Compliance & Ethics (8 topics)
3. **Features**:
   - Chapter reader with bilingual EN/Bengali toggle on key terms
   - MCQ engine (4 options, instant explanation, spaced repetition for weak topics)
   - Progress bars per chapter & overall
   - Auto-generated certificate PDF on 100% NISM completion (reuses existing certificate edge function)
   - "Common Exam Traps" callout box per chapter
4. **Admin** (`/admin/academy`):
   - **AI Content Authoring**: Generate chapter content from syllabus topic — admin reviews & publishes
   - Bulk MCQ import via CSV or AI generation
   - Partner enrollment & progress dashboard

---

## Phase 4 — High-Impact Engagement Features (P1)
1. **SIP Goal Visualizer** — wealth chart vs FD comparison, goal presets (child education, wedding, retirement)
2. **WhatsApp Share buttons** — site-wide on blog, market updates, calculators (with UTM tracking)
3. **Investor Risk Profiler** — SEBI-compliant 10-Q quiz → risk category + suitable fund types (no scheme names)
4. **Bengali Language Toggle** — extends existing LanguageContext to add `bn` for key investor pages

---

## Phase 5 — Lead Capture & Newsletter Automation
1. **Investment Newsletter** — Resend integration: weekly digest auto-compiled (latest market update + top blog + SIP tip), double opt-in, unsubscribe links
2. **Partner Lead CRM auto-routing** — incoming website leads auto-assigned to nearest partner by PIN code; WhatsApp/email alert to partner; admin sees full funnel in `/admin/leads`
3. **Contact form** — wired to email + admin inbox + auto-reply

---

## Phase 6 — AI Chatbot, Video, Locator, Forum
1. **"Ask Balaji Nivesh" Chatbot** — floating widget, RAG over blog + FAQ + SEBI rules, hard guardrails against advice
2. **MFD Locator** — PIN-code → nearest active partner
3. **Video Explainer Series** — embedded YouTube section
4. **Investor Community Forum** — moderated Q&A (lowest priority)

---

## Cross-Cutting Automation Principles
- **Every long-running task = edge function + cron**, no manual triggers needed
- **Every AI call routes through the configured provider in Integrations Hub** — switching from Gemini to Claude is one dropdown change
- **Every external alert (lead, gift, market update)** routes through the WhatsApp + Email integration adapters
- **Compliance disclaimers are React components, not editable text** — strategy doc requirement
- **Content scanner** runs on every publish (blog, market update) to block forbidden phrases

---

## Suggested First Implementation Order

```text
Phase 0 (Foundation)     → 1 build cycle  ← START HERE
Phase 1 (Blog + SEO)     → 1-2 cycles
Phase 2 (Market Updates) → 1-2 cycles
Phase 3 (Academy)        → 2-3 cycles (split modules)
Phase 4 (Engagement)     → 1-2 cycles
Phase 5 (Newsletter/CRM) → 1 cycle
Phase 6 (Chatbot/Misc)   → 1-2 cycles
```

Approve this plan and I'll start with **Phase 0 — Integrations Hub & Compliance Foundation**. After that we go phase-by-phase, each phase delivered as a working, testable slice.

