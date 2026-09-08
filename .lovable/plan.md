# Compliance check on auto-published content

You are right: the weekly roundup publishes itself with no human review, and the compliance word-check only runs inside the admin screens. Same gap exists for the daily update when automation mode is "Full Auto". This plan moves the check into the server so nothing can go live unchecked.

## What changes for you

- Any auto-generated market post is scanned before it goes live.
- If a blocking phrase is found ("guaranteed returns", "best mutual fund", etc.), the post is saved as a draft marked "Needs review" instead of published, with the offending phrase recorded.
- It then shows up in Market Updates > Awaiting Review with a red "Compliance hold" badge and the reason, so you can fix the wording and publish it yourself.
- Softer "warn" phrases do not stop publishing; they are recorded and shown on the post's review screen.
- Nothing changes for posts you already review by hand today.

## Technical details

1. New shared module `supabase/functions/_shared/compliance.ts` — a Deno copy of the rule list and `scanContent`/`hasBlockingViolations` from `src/lib/complianceScanner.ts`, kept identical rule-for-rule so both sides agree.
2. `generate-weekly-market-update/index.ts`: before insert, scan headline + summary + what_it_means + key_movers. Blocking hits → `status: "draft"`, `published_at: null`, and store `{ compliance_violations }` inside the existing `raw_ai_output` jsonb. No blocking hits → publish as today.
3. `generate-market-update/index.ts`: apply the same gate to the `autoPublish` path (full_auto + cron), so full auto can never bypass it.
4. `src/pages/admin/AdminMarketUpdates.tsx`: read `raw_ai_output.compliance_violations`; show a "Compliance hold" badge on the card and list the flagged phrases and reasons in the review dialog. Manual approve keeps its existing client-side scan.
5. Verify by inserting a scan call against known-bad text in a local test run of the scanner rules, and by loading /admin/market-updates in the browser to confirm the badge renders.

No schema change is needed; `raw_ai_output` already exists on `market_updates`.
