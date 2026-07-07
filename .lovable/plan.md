# Update Site with Balaji Nivesh Official Info

Apply the confirmed data from the uploaded document across the entire site. Blank fields in the doc (contact email, social links, story/mission/team, lead-capture email, gift-capture email, signature) will be left as-is per your decision.

## Confirmed data being applied

| Field | Value |
|---|---|
| Legal name | Balaji Nivesh Private Limited |
| Entity type | Private Limited |
| ARN | 173142 (displayed as `ARN-173142`) |
| Phone | +91 93300 79717 |
| Address | 1 R. N. Mukherjee Road, 3rd Floor, Room No. 320, Kolkata – 700001 |
| Founded | October 2020 (→ "5+ years experience") |
| Clients | 2,500+ |
| AUD | ₹310 Cr+ |

## Changes

**1. Database (site_settings) — single source of truth**
- `arn_number` → `ARN-173142`
- `contact_phone` → `+91 93300 79717`
- Add new public keys: `contact_address`, `company_legal_name`, `company_entity_type`, `year_founded`, `clients_count`, `aud_value`, `years_experience`

**2. Hardcoded placeholders replaced with real values**
- `src/pages/Index.tsx` — hero stats: 10+ → **5+**, 1000+ → **2,500+**, ₹50Cr+ → **₹310Cr+**
- `src/components/layout/AuthorityStrip.tsx` — "10+ years experience" → **"5+ years experience"**, "1,000+ families served" → **"2,500+ families served"**
- `src/pages/About.tsx` — ARN placeholder `XXXXXX` → **173142**; add legal name + founded year
- `src/pages/Contact.tsx` — default phone fallback + address block use real values from settings
- `src/components/layout/Footer.tsx` — phone fallback → real number; add address line
- `src/pages/PrivacyPolicy.tsx` — ARN `XXXXXX` → `173142`; phone/address placeholders → real values (3 occurrences)
- `src/pages/TermsOfUse.tsx` — ARN + phone placeholders → real values (2 occurrences)
- `src/pages/Disclaimer.tsx` — ARN placeholder → `173142`

**3. Not touched (per your decision to leave blanks)**
- Contact email, social media links, About page story/mission/team profiles, lead-capture email, gift-capture email, senior team signature/stamp, Google Maps embed.
- Homepage statistics wording (Years / Clients / AUD labels) stays, only the numbers update.
- Admin/backoffice pages, locales (`en.json`/`hi.json`/`bn.json`) will keep existing labels — only visible placeholder values change.

## Files edited
- `src/pages/Index.tsx`
- `src/components/layout/AuthorityStrip.tsx`
- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- `src/components/layout/Footer.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/TermsOfUse.tsx`
- `src/pages/Disclaimer.tsx`
- `site_settings` table (data update + new rows)

## Verification
Grep for remaining `XXXXX`, `1000+`, `₹50Cr`, `10+ years`, `Your Office Address` after edits — expect zero hits in user-facing pages.
