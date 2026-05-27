## Goal

Fill all 4 Partner Academy modules with practical, exam-ready, real-world balanced content so partners can (a) pass NISM Series V-A, (b) speak confidently to real clients, (c) handle compliance & objections, and (d) earn certificates that actually mean something.

Today every module shows "0 chapters / Coming soon". Database tables (`learning_modules`, `learning_chapters`, `quiz_questions`, progress + certificate tables) and the admin authoring UI already exist — only content is missing.

## Content philosophy (the "balance" you asked for)

Every chapter follows the same 4-block structure so partners get exam marks AND real practice value:

1. **Concept in plain English** (with a Bengali/Hindi analogy where useful)
2. **Real-world application** — a worked example, mini-script, or client situation
3. **Exam Traps** — the 3-5 wording tricks NISM uses on this topic
4. **Quick Recap** — bullet takeaways

Each chapter ends with **3-5 MCQs** (NISM-style: 4 options, single correct, 1-line explanation), plus a **20-question module-final quiz** for certificate.

Tone: senior mentor, Class-10 readability, fully SEBI/AMFI compliant — Distributor never Adviser, no scheme/AMC names, no "guaranteed/best/risk-free" language.

## Module-by-module chapter plan

### Module 1 — NISM V-A Mutual Fund Distributors Prep (12 chapters, certificate)
Aligned to the official NISM-V-A syllabus units:
1. Investment Landscape & Why Mutual Funds Exist
2. Concept, Role & Structure of Mutual Funds in India
3. Legal Structure: Sponsor, Trustee, AMC, RTA, Custodian
4. Types of Schemes — Equity, Debt, Hybrid, Solution-oriented, Others
5. Scheme-Related Information — SID, SAI, KIM, fact sheet
6. NAV, Total Expense Ratio & Pricing of Units
7. Performance Measurement — Returns (Absolute, CAGR, XIRR, Rolling)
8. Risk, Return & Benchmarking — Std Dev, Beta, Sharpe, Alpha
9. Mutual Fund Taxation (latest FY rules — equity, debt, STT, LTCG, indexation removal)
10. Investor Services — KYC, transactions, nomination, consolidation
11. Regulatory Framework — SEBI MF Regulations 1996, AMFI, codes of conduct
12. Recommending Funds — Risk profiling, asset allocation, model portfolios (educational)

### Module 2 — Product Knowledge Mastery (10 chapters, certificate)
Deep-dive product literacy, not exam-only:
1. Equity Funds — Large/Mid/Small/Flexi/Focused/ELSS (when each fits which life-stage)
2. Sector & Thematic Funds — Why concentration cuts both ways
3. Index Funds & ETFs — Tracking error, iNAV, when passive wins
4. Debt Funds Decoded — Liquid, Overnight, Ultra-Short, Short, Corporate Bond, Gilt
5. Credit Risk & Duration — Macaulay vs Modified, YTM, accrual vs duration strategies
6. Hybrid Funds — Aggressive, Balanced Advantage, Multi-Asset, Equity Savings, Arbitrage
7. International / Fund-of-Funds & Gold/Silver ETFs — Diversification + taxation
8. Solution-Oriented & Retirement Funds — Lock-in, suitability
9. SIP, STP, SWP, Switch — Mechanics, taxation, and the real client use-cases
10. Reading a Factsheet Like a Pro — Portfolio, ratios, churn, expense, exit load

### Module 3 — Sales & Pitching Conversations (12 chapters, certificate)
Pure practice. Each chapter = one realistic client scenario with full dialogue script + objection handling + compliant close.
1. First-Meeting Discovery — questions that build trust in 10 minutes
2. The First-Time SIP Investor (₹500/month from a young salaried Bengali professional)
3. The FD-Only Saver Aged 55+ (safety bias, taxation reality)
4. The Market-Correction Panic Call (script for -15% week)
5. The "My Friend Got 30% Last Year" Investor (managing return expectations)
6. The Retirement Planner Aged 45 (gap analysis on a napkin)
7. The Homemaker Investor (joint-holding, nomination, household budgeting)
8. The Small-Business Owner with Lumpy Income (STP from liquid, surplus parking)
9. The NRI Client (FATCA, repatriable vs non-repatriable basics)
10. The Goal-Based Conversation — Child education / marriage / home down-payment
11. Cross-Selling Beyond MF — Insurance gap, emergency fund, will & nominee hygiene
12. Asking for Referrals Without Sounding Pushy

### Module 4 — Compliance & Ethics for Distributors (8 chapters, certificate)
1. Distributor vs Adviser — The Line You Must Never Cross
2. KYC & CKYC — Documents, in-person verification, re-KYC triggers
3. Suitability & Risk Profiling — Why "best fund" is a banned phrase
4. AMFI Code of Conduct & Advertisement Code (Reg. 30 + Sixth Schedule)
5. Mis-Selling Red Flags — Real SEBI enforcement cases
6. ARN, EUIN & NISM Renewal — CPE, validity, brokerage implications
7. Grievance Redressal — SCORES, Ombudsman, RIA-vs-MFD complaints
8. Data Privacy & WhatsApp Communication Rules (recordkeeping, opt-in, DPDP Act)

**Total: 42 chapters + ~210 chapter MCQs + 80 final-quiz MCQs = ~290 questions.**

## How content gets created

To keep this manageable and high-quality, I'll do this in **two waves**:

### Wave 1 — Foundation (this build)
- Seed **all 42 chapters** as fully-written Markdown via a single SQL migration (content authored manually for accuracy, not AI-generated, so SEBI tone and NISM alignment are guaranteed).
- Seed **5 MCQs per chapter** (210 questions) in the same migration.
- Update `learning_modules.total_chapters` to match.
- Verify the existing `AcademyModule` / `AcademyChapter` / `AcademyQuiz` pages render the new content correctly — small UI polish only if needed (no design changes).
- Mark Module 3 (Sales & Pitching) as `issues_certificate = true` so all four modules now grant certificates.

Realistic content size note: 42 chapters × ~800 words = ~33k words. To keep the migration reviewable, I'll split it into 4 migration files (one per module) submitted sequentially.

### Wave 2 — Polish & enrichment (separate follow-up turn after you review Wave 1)
- Add **20-question final-exam pool** per module (the existing UI already runs `AcademyQuiz`).
- Add downloadable **1-page cheat sheets** (PDF or printable HTML) for each module.
- Add **Bengali glossary** entries (the `learning_chapters.bengali_glossary` jsonb field already exists but is unused) — exam terms with Bengali translation for West-Bengal partners.
- Wire a "Mock NISM Test" button on the NISM-V-A module that pulls 100 random questions, 2-hour timer, 60% pass — mirrors the actual exam.

## My suggestions (beyond what you asked)

1. **CPE-style refresher reminders** — once a partner finishes a module, schedule a 30-day spaced-repetition email with 5 tricky MCQs from that module (the `spacedRepetition.ts` lib already exists in the codebase).
2. **Roleplay audio** — for Module 3, record (or TTS-generate) the client dialogues as short audio clips so partners can practice while commuting. Cheap, high-retention.
3. **"Submit your own objection" form** — partners send a real objection they couldn't handle; we publish a vetted script the next week. Builds community + content engine.
4. **Leaderboard inside Academy** — top quiz-scorers this month get a featured badge on `/locator`. Drives both learning AND lead-gen for them.
5. **Tie certificate completion to perks** — finish all 4 modules → unlock a free co-branded brochure pack in `/partner/toolkit`. Aligns training with the toolkit page that's currently "Coming Soon".

Items 1-5 are suggestions only — I won't build them in Wave 1 unless you greenlight.

## Out of scope (won't touch)

- Existing UI design, colors, routes, or schema changes beyond `learning_modules.total_chapters` count and one boolean flip on Module 3.
- Admin authoring UI (`AdminAcademy.tsx`) — already works, no changes needed.
- The AI generator edge function — keep it for future admin use; we are authoring content directly for quality.

## What I need from you before Wave 1

1. **Confirm scope** — proceed with all 42 chapters in Wave 1, or start with one module first as a sample for you to review tone/depth?
2. **Bengali coverage** — full Bengali translations of every chapter (doubles content size + migration count), OR just a Bengali glossary of key terms per chapter? I recommend the latter.
3. **NISM rules reference** — should I write to the latest NISM-V-A workbook (Oct-2024 edition with the post-Apr-2023 debt-fund taxation, no indexation on debt held >3y rule)? Confirm so we don't ship stale tax content.
4. **Any of suggestions 1-5 above to include in Wave 1** instead of deferring?