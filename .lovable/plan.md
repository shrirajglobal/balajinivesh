# Chapter Reading Experience Redesign

Transform `src/pages/partner/AcademyChapter.tsx` from a plain copy-paste read into a guided, enjoyable study session. Module list and chapter data are already correct (NISM V-A mirror is done); this plan is purely about the in-chapter reading UX.

## Goals
- Make every chapter feel like a designed lesson, not a wall of text
- Give learners orientation (where am I, how much is left, what's next)
- Break content into scannable, themed blocks with clear hierarchy
- Add light interactivity so reading sticks (recap checks, mini self-check, glossary)
- Celebrate completion to drive next-chapter pull-through

## What the user will see

**Sticky reading shell (top)**
- Chapter number + title on the left
- Live progress bar (scroll %) under the title
- Estimated read time + prev/next chapter arrows
- "Mark complete" pill, glossary "Aa" toggle

**Two-column layout (desktop ≥1024px)**
- Left rail: auto-generated outline from H2s with scroll-spy active state
- Right column: chapter content
- Mobile: outline collapses into a single column; sticky shell stays

**Four content blocks rendered as styled cards**
1. Plain English — drop-cap first letter, auto-highlighted key terms
2. Real-World Example — coloured story card, monospace ₹ amounts
3. Exam Traps — red-bordered numbered cards with ⚠ pills
4. Quick Recap — interactive checklist (localStorage persistence) + "Generate flashcards" link

**Mini self-check**
- One random question from existing `quiz_questions` pool
- Inline reveal of correct answer + explanation, no scoring

**Bengali glossary**
- Inline highlighted terms with hover tooltips from chapter's `bengali_glossary` JSONB
- Full glossary card at the bottom of the chapter

**Completion moment**
- Confetti animation on "Mark complete"
- Next-chapter preview card with title + 1-line teaser
- Scroll position saved to localStorage per chapter

## Technical details

**Files**
- Rewrite: `src/pages/partner/AcademyChapter.tsx`
- Add tokens to: `src/index.css` (block colours, drop-cap, recap pill)
- New components under `src/components/academy/`:
  - `ChapterShell.tsx` (sticky header + progress + nav)
  - `ChapterOutline.tsx` (left rail, scroll-spy)
  - `ContentBlock.tsx` (themed card wrapper for the 4 block types)
  - `RecapChecklist.tsx`
  - `MiniCheck.tsx`
  - `GlossaryToggle.tsx` + `GlossaryCard.tsx`
  - `ChapterComplete.tsx`

**Dependencies**
- `framer-motion` (already used elsewhere in project — reuse)
- `canvas-confetti` (~3kb, new)

**Out of scope (not touched in this pass)**
- AI content generation
- Quiz/exam UX
- Module/chapter list page
- Database schema or chapter data

Once approved I'll build it in one pass and verify on a sample chapter.
