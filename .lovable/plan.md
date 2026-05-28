# Partner University — Structure Fix + Chapter UX Overhaul

Two distinct problems, one plan.

---

## Problem 1 — Module ↔ Book mismatch

The Academy card for **Investment Landscape** says *"Chapters 1–5"* but only 3 chapters are mapped to it. Other modules likely drift from the official NISM V-A workbook unit boundaries too.

### Root cause
`src/data/bibleChapters.ts` is the source of truth for which of the 42 chapters belong to which module. The current mapping was authored manually and does not match the official NISM V-A workbook unit boundaries. Module card descriptions (e.g. "Chapters 1–5", "Chapters 6–10") were written assuming a different mapping.

### Fix
Re-map all 42 chapters to follow the **official NISM V-A workbook** unit structure, then republish so each module shows the correct chapter count. Concretely:

1. **Audit the NISM V-A workbook table of contents** (latest edition) and lock the canonical unit → chapter list. The workbook is organised into 10 units; our 13 DB modules collapse some units (e.g. "Risk, Return & Performance") and split others. I will produce a single mapping table that:
   - Lists all 42 chapter slugs in book order
   - Assigns each to the correct `module_key` matching the existing `learning_modules` rows
   - Renumbers `n` (chapter_number) so chapters within a module are sequential (1..N per module) **and** also keeps a globally unique `display_order` for sorting
2. **Update `src/data/bibleChapters.ts`** with the corrected mapping.
3. **Update card descriptions** on `learning_modules` (the "Chapters X–Y" text in `subtitle`/`description`) via migration so they exactly match the new counts.
4. **Re-run the bible generator** only for chapters whose `module_key` changed (so they get re-inserted under the right module). Old rows under the wrong module are deleted in the same migration to avoid duplicates.
5. Verify on `/partner/academy` that every card's "X chapters" count = the number in its description.

I will share the proposed mapping table for your approval **before** running the regeneration, since this is a content-structure decision.

---

## Problem 2 — Chapter content is a wall of text

`src/pages/partner/AcademyChapter.tsx` already has scaffolding for 4 styled blocks (Plain English, Real-World, Exam Traps, Quick Recap) but the live page renders them as plain prose with tiny headings and no visual hierarchy. The reading experience feels like a copy-paste PDF.

### Redesign goals (CRO + mentor feel)
- Make a partner *want* to finish the chapter
- Reduce cognitive load: scan-friendly, chunked, visual
- Reinforce learning: glossary on hover, mini-recall checkpoints, clear "next action"
- Mobile-first reading rhythm

### Concrete UX changes to `AcademyChapter.tsx`

**a. Reading shell**
- Sticky top bar with: chapter number, title (truncated), live **reading progress %** based on scroll, "Mark complete" pill, prev/next arrows
- Two-column on desktop ≥1024px: left = sticky **chapter outline** (jump links to Plain English / Real-World / Traps / Recap / Glossary), right = content. Single column on mobile.
- Estimated read-time badge + difficulty dot at top
- Breadcrumb: Academy › Module › Chapter

**b. Content blocks (visual upgrade)**
- **Plain English** — large readable prose (`prose-lg`), drop-cap on first paragraph, key terms auto-highlighted (underline-dotted) and clickable to open a glossary popover pulled from `bengali_glossary`
- **Real-World Application** — coloured "story" card with a small avatar/icon, monospace numbers for ₹ amounts, side-by-side comparison table when the content contrasts two options (Aman vs Biren style)
- **Exam Traps** — numbered red-bordered cards, each trap = one card with a "⚠ Trap" pill, "Common error" sub-line, "Watch for" sub-line — parsed from the existing list
- **Quick Recap** — checklist with checkboxes the partner can tick (state stored locally per chapter), plus a one-tap "Generate flashcards" link that opens a 5-card review
- **Mini-check** — after Plain English, insert one self-check question pulled from the chapter's quiz pool (just show the question + reveal answer on tap). Lightweight, no scoring.

**c. Glossary**
- Replace the standalone "Show Bengali glossary" button with an inline floating "Aa" toggle in the sticky bar that switches all known terms in the page to show Bengali in parentheses, e.g. *inflation (मुद्रास्फीति / মুদ্রাস্ফীতি)*
- Keep the dictionary card at the bottom as a reference

**d. Completion + next action**
- When the partner hits "Mark complete":
   - Confetti micro-animation (framer-motion, 1.2s)
   - Replace the button area with a **next-chapter preview card** (title, summary, "Continue →") OR, if it's the last chapter, a "Take module quiz" card
- Persist scroll position per chapter in `localStorage` so reopening resumes where they left off

**e. Typography & theme**
- Use `prose prose-neutral dark:prose-invert max-w-none` on Plain English
- Body line-height 1.7, max-width 68ch
- All semantic tokens, no hardcoded colours — orange for accents, blue for info, amber for traps, emerald for recap (already in design system)

### Files to touch
- `src/pages/partner/AcademyChapter.tsx` — full rewrite of the article body (state, sticky bar, outline, block components)
- `src/components/partner/academy/ChapterOutline.tsx` *(new)* — sticky desktop TOC
- `src/components/partner/academy/ReadingProgress.tsx` *(new)* — scroll-based progress bar
- `src/components/partner/academy/GlossaryToggle.tsx` *(new)* — inline bilingual toggle
- `src/components/partner/academy/MiniCheck.tsx` *(new)* — one-question self-check
- `src/data/bibleChapters.ts` — remapped module assignments
- One migration to update `learning_modules.subtitle/description` text + delete stale chapter rows that moved modules

### Out of scope (call out)
- Rewriting the AI prompt in `generate-bible-chapter` — current output is good quality, only presentation is weak. Will only re-run generation for chapters whose module assignment changes.
- Quiz UX changes — separate task.

---

## Execution order (after you approve)

1. I post the proposed **NISM V-A module → chapter mapping table** for your sign-off
2. After sign-off: migration (module text + cleanup) → update `bibleChapters.ts` → regenerate only the moved chapters
3. Build the new chapter reading UI components and rewrite `AcademyChapter.tsx`
4. Spot-check 3 chapters across 3 modules in the preview, on desktop + mobile widths

---

## Question for you before I start

Do you want me to:
- **(A)** Strictly mirror the official NISM V-A workbook unit structure (10 units → may need to merge/rename some current modules), **or**
- **(B)** Keep the current 13 module cards as-is and just rebalance which of the 42 chapters belong to each so counts match the descriptions?

(A) is more "true to book", (B) is faster and keeps your current navigation intact.
