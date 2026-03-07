

# Hindi Language Support — Option A (Custom Translation System)

## Approach

Create a `LanguageContext` with a `t()` function that reads from two JSON translation files (`en.json` and `hi.json`). Add a language toggle (EN / हिं) in the Header. I will write all Hindi translations myself, keeping language simple, natural, and meaning-preserving.

## Scope

~35+ files need modification across the entire site:

**Infrastructure (new files)**:
- `src/contexts/LanguageContext.tsx` — context with `language`, `setLanguage`, `t()` function, localStorage persistence
- `src/locales/en.json` — all English strings keyed by page/section
- `src/locales/hi.json` — all Hindi translations (AI-generated, simple Hindi)

**Files to modify** (replace hardcoded strings with `t('key')` calls):
- **Layout**: `Header.tsx`, `Footer.tsx`
- **Main pages**: `Index.tsx`, `About.tsx`, `Contact.tsx`, `Education.tsx`, `MarketInsights.tsx`, `Calculators.tsx`, `Resources.tsx`, `Auth.tsx`
- **Education**: `HomemakersEducation.tsx`, `KidsEducation.tsx`, `ProgressTracker.tsx`, `CertificateModal.tsx`, `GiftClaimForm.tsx`
- **Solutions** (5 files): `MutualFunds.tsx`, `Bonds.tsx`, `Insurance.tsx`, `IPO.tsx`, `FixedDeposits.tsx` + `SolutionPageTemplate.tsx`
- **Calculators** (6 files): `SIPCalculator.tsx`, `LumpsumCalculator.tsx`, `StepUpSIPCalculator.tsx`, `RetirementPlanner.tsx`, `SIPvsFD.tsx`, `EmergencyFundCalculator.tsx`
- **Tools** (2 files): `FinancialHealthCheck.tsx`, `RiskProfiler.tsx`
- **Legal** (3 files): `PrivacyPolicy.tsx`, `TermsOfUse.tsx`, `Disclaimer.tsx`
- **Other**: `NotFound.tsx`
- **App.tsx** — wrap with `LanguageProvider`

## Translation Strategy

- Hindi will be in **simple, conversational Devanagari** — avoiding overly formal/Sanskritized Hindi
- Financial terms like SIP, mutual fund, NAV will stay in English (they are universally used in India)
- Legal pages will have Hindi translations but regulatory terms (SEBI, AMFI, ARN, etc.) stay in English
- Education content for Kids and Homemakers will use relatable, easy Hindi

## How `t()` Works

```typescript
// Usage in components:
const { t } = useLanguage();
<h1>{t('home.hero.title')}</h1>

// JSON structure:
{
  "home": {
    "hero": {
      "title": "Plan Your Financial Future with Confidence",
      "subtitle": "Free financial planning tools..."
    }
  }
}
```

## Language Toggle UI

A compact toggle button in the Header navbar area: `EN | हिं` — clicking switches the entire site. Selected language highlighted with primary color. Persisted in localStorage.

## Implementation Order

1. Create `LanguageContext.tsx` and empty locale JSON files
2. Extract all English strings into `en.json` (organized by page)
3. Write all Hindi translations into `hi.json`
4. Add language toggle to Header
5. Wrap App with `LanguageProvider`
6. Update all pages to use `t()` calls

This is a large refactor touching 35+ files. I will implement it all at once since the approach is straightforward and mechanical.

