# Update Balaji Nivesh email to infobalajinivesh@gmail.com everywhere

## Where the email lives today

1. **Site settings (database)** — `contact_email` = `contact@balajinivesh.com`. This single value drives the Footer, Contact page, Calculator lead capture, Commission Disclosure and anywhere using the site-settings hook. One update fixes all of these at once.
2. **Hardcoded fallbacks** — several pages show `info@balajinivesh.com` if the setting ever fails to load: Footer, Contact, Commission Disclosure, CalculatorLeadCapture.
3. **Hardcoded on legal pages** — Privacy Policy (2 places) and Terms of Use show `info@balajinivesh.com` directly in text.
4. **Reference doc** — `public/Balaji-Nivesh-Website-Data-Requirements.md` mentions the old email.

Not touched: `chatbot@balajinivesh.internal` (internal system tag, never shown), `onboarding@resend.dev` (email-sending service config), placeholder texts like `you@example.com` (form hints for the visitor's own email).

## Changes

1. Update the `contact_email` setting in the backend to `infobalajinivesh@gmail.com` — instantly updates Footer, Contact page, Commission Disclosure, calculator lead capture.
2. Replace every hardcoded `info@balajinivesh.com` fallback and legal-page mention with the new email (Footer, Contact, Commission Disclosure, CalculatorLeadCapture, PrivacyPolicy x2, TermsOfUse).
3. Update the reference doc email.

## Verification

- Typecheck passes and build log is clean.
- Preview check: Footer and Contact page show infobalajinivesh@gmail.com; Privacy Policy and Terms of Use contact sections show the new email.

One note: the website's outgoing emails (newsletter confirmations etc.) still send "from" the system address — if you'd like visitors to be able to *reply* to this Gmail, that can be wired separately. Just say so.
