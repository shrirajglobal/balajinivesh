# Two-path login for investors and distributors

## Goal
Turn every website login entry into one clear choice:

```text
Login
├── Portfolio Login → existing Wealth Elite login
└── Distributor Login → Balaji Nivesh Learning & CRM
```

Portfolio access remains exactly as it is. Distributor access will use the website's existing profiles, application approval, Learning Academy, Leads CRM, Clients, commissions, and toolkit.

## 1. Create a user-friendly login choice page
- Replace the automatic external redirect on `/auth` with a focused selection page.
- Present two equal, clearly labelled choices rather than technical account types:
  - **Portfolio Login** — “View your investments and portfolio.” Opens the existing Wealth Elite login in a new tab.
  - **Distributor Login** — “Continue your learning and manage leads.” Opens the Balaji Nivesh distributor sign-in on the same page.
- Add a secondary **Apply to become a distributor** action under Distributor Login for new applicants.
- Use investor and distributor icons, concise benefit-led copy, trust messaging, and a clear note explaining that the two logins are separate.
- Keep the page free of unrelated navigation distractions, but retain Balaji Nivesh identity and the mandatory ARN line.

## 2. Build the Distributor sign-in and account recovery journey
- Enable secure email/password authentication for distributors and add Google sign-in as the convenient alternative.
- Provide sign in, create account, forgot password, and the required password-reset page.
- After account creation, collect and store the distributor profile details already needed by the application process.
- Preserve email confirmation before first sign-in; show a clear “check your email” state instead of treating registration as complete.
- Remember the intended destination so a successful login returns the distributor to Learning, CRM, or the page they originally requested.

## 3. Make application and approval a single guided funnel
- New distributor path: create account → complete distributor application → pending-review screen → approval notification/state → portal access.
- Prefill name and email from the profile to reduce form effort; collect phone, city, profession, ARN and EUIN as appropriate.
- Detect an existing application and show its real status instead of allowing duplicate submissions.
- For pending or rejected applications, show the correct next action and a contact option without exposing the CRM.
- Update customer-facing terminology from “Partner” to **Distributor** throughout this journey and portal while retaining internal data names where changing them would add unnecessary risk.

## 4. Secure and simplify approval
- Make approval one reliable admin action that updates the application, creates or updates the distributor record, and assigns the distributor role together.
- Only active, approved distributors can enter Learning & CRM; inactive, pending, rejected, or ordinary users receive a specific status screen.
- Keep roles in the existing dedicated roles table and enforce access through server-backed permissions, never browser-stored flags.
- Preserve row-level separation so each distributor can access only their own leads, clients, learning progress, commissions, calendar connection, and profile.
- Improve approval errors so administrators can resolve missing or duplicate account links without handling raw user IDs.

## 5. Reorganize the distributor portal around the two promised outcomes
- Rename the portal visibly to **Distributor Learning & CRM**.
- Make the first signed-in screen action-oriented:
  - **Continue Learning** with current progress and next lesson.
  - **Work Your Leads** with due follow-ups, hot leads, and a quick-add lead action.
- Group navigation for easier scanning:
  - **Home**
  - **CRM:** Leads, Clients
  - **Learning:** Academy, certificates/progress
  - **Business:** Commissions, Toolkit
- Keep the existing CRM functionality and Google Calendar follow-up sync; this phase connects it through the new login rather than replacing it.
- Add a visible sign-out action and a small profile/status area.

## 6. Update every login entry consistently
- Route the header desktop/mobile Login buttons to the new two-choice page.
- Route distributor-only prompts, application prompts, academy sign-ins, forum sign-ins, and protected distributor pages to the relevant internal sign-in state.
- Keep explicit Portfolio Login actions pointed to Wealth Elite.
- Remove automatic popup behavior from distributor/admin guards; redirect inside the site with a return path instead.
- Keep administrator access working through the internal account system without presenting admin as a public login choice.

## 7. CRO and compliance treatment
- Use intent-based labels everywhere: **Portfolio Login** and **Distributor Login**, not a generic “Login.”
- Place “Already a distributor? Sign in” and “Interested in becoming one? Apply” together to prevent dead ends.
- Show the value immediately after distributor sign-in: pending follow-ups and next learning lesson, not only summary totals.
- Add helpful empty states that drive the next action: add first lead, continue lesson, complete profile, or contact the Balaji Nivesh team.
- Use “mutual fund distributor” consistently; do not describe Balaji Nivesh, applicants, or portal users as advisors/advisers.
- Keep the mandatory AMFI distributor identity and existing educational/compliance language.

## 8. Verification
- Test desktop and mobile for both login choices, popup-blocked portfolio access, distributor registration, email confirmation, sign-in, sign-out, forgot/reset password, and return-to-page behavior.
- Test pending, rejected, approved, active, inactive, admin, and ordinary-user states.
- Verify approval grants access immediately and cannot create duplicate distributor records or roles.
- Verify one distributor cannot read or modify another distributor's CRM, learning, or client data.
- Confirm all login links across the site reach the correct path and no banned self-referential advisor/adviser wording is introduced.
- Run the build and targeted authentication/access tests, then verify the complete journey in the live preview at mobile and desktop sizes.

## Technical details
- Reuse the existing `profiles`, `partner_applications`, `partners`, `user_roles`, learning, lead, client, commission, and activity records.
- Add only the smallest database migration needed for application/profile fields, uniqueness, and an atomic admin approval function after validating the current live schema and policies.
- Update authentication state handling to validate the signed-in user and centralize post-login destination logic.
- Add a public `/reset-password` path and keep protected portal paths behind distributor-status checks.
- Keep the Wealth Elite URL centralized as the sole Portfolio Login destination.
