# Leads-first Distributor Login and Portal CRO

## Goal
Give distributors a simple, credible journey built only around what is currently offered:

```text
Distributor Login
├── Home — today’s priorities
├── Leads — CRM and follow-ups
├── Academy — learning and progress
└── Toolkit — practical resources
```

AUM, commissions, and client management will not be advertised or shown in the distributor experience.

## 1. Make the login promise accurate and focused
- Keep the existing Portfolio Login and Distributor Login choice.
- Rewrite the Distributor Login card and sign-in screen around three clear benefits: manage leads, continue learning, and access distributor resources.
- Remove all references to clients, AUM, commissions, earnings, and broad “business tools.”
- Make **Sign in to Distributor Portal** the primary action.
- Keep **Become a distributor** as a quieter secondary path for new applicants.
- Retain Google sign-in, email/password, forgot password, clear error messages, and the mandatory ARN identity line.
- Reduce distractions on the sign-in form so returning distributors can complete it quickly on mobile.

## 2. Improve the post-login handoff
- Return approved distributors to the page they originally requested; otherwise open Home.
- Show a brief, useful welcome state while the account and access status are checked.
- Keep specific screens for application required, pending review, rejected, inactive, and approved access rather than showing a generic denial.
- Give each non-approved state one obvious next action: apply, wait for review, contact the team, or sign out.

## 3. Rebuild Home around lead action first
- Replace the current AUM, commission, and client totals with useful CRM indicators:
  - follow-ups due or overdue;
  - hot leads;
  - total active leads;
  - leads converted this month.
- Put **Review follow-ups** and **Add lead** at the top of the page.
- Show the most urgent follow-ups directly on Home, with call/WhatsApp/open-lead actions where data is available.
- Place **Continue learning** beneath the lead section, showing progress and the next useful Academy action.
- Add Toolkit as a compact tertiary action rather than giving it equal weight to daily lead work.
- Use meaningful first-time states: add the first lead, start the first lesson, or open resources.

## 4. Reduce portal navigation to four destinations
- Show only **Home, Leads, Academy, Toolkit** in desktop and mobile portal navigation.
- Remove Clients and Commissions from the visible distributor navigation.
- Redirect old distributor Clients and Commissions links to Home so saved bookmarks do not become broken pages.
- Add a compact signed-in identity area with account email/status and a clearly visible sign-out action.
- Rename remaining “Partner University” and other visible partner wording to **Distributor Academy** or **Distributor** where appropriate.

## 5. Strengthen the four destinations
- **Home:** daily priorities, urgent follow-ups, quick add, and next learning action.
- **Leads:** preserve the existing CRM, filters, activity history, follow-up dates, Google Calendar connection, call, and WhatsApp actions; make due work easiest to reach.
- **Academy:** emphasize “Continue” over browsing, make progress and certification status clear, and keep module cards concise.
- **Toolkit:** present only genuinely available resources. Use clear categories and useful empty states instead of disabled promises that look unfinished.

## 6. Improve the application conversion path
- Keep account creation and distributor application available from login.
- Explain the short journey before signup: create account → submit details → team review → portal access.
- Preserve profile prefilling and duplicate-application prevention.
- After application submission, show what happens next and a single contact option for genuine questions.
- Avoid income claims and avoid implying that AUM or commission reporting is included.

## 7. Consistency and compliance
- Update all Distributor Login descriptions, portal headings, empty states, and application copy to match the actual four-part offer.
- Use “mutual fund distributor” consistently and do not introduce advisor/adviser wording for Balaji Nivesh or its distributors.
- Preserve the mandatory AMFI identity line and existing educational/compliance treatment.
- Do not change the Portfolio Login destination or investor account flow.

## 8. Verification
- Test desktop and mobile for login choice, sign-in, Google sign-in handoff, password recovery, signup, and return-to-page behavior.
- Test approved, pending, rejected, inactive, application-required, and signed-out experiences.
- Confirm Home contains no AUM, commission, or client figures and navigation contains exactly Home, Leads, Academy, and Toolkit.
- Confirm old Clients and Commissions bookmarks redirect safely.
- Verify lead quick actions, Academy continuation, Toolkit states, sign-out, and mobile navigation.
- Run the build and check the live preview for layout, wording, broken links, and console errors.

## Technical details
- This is primarily a presentation and routing update; no new database tables are planned.
- Reuse the existing lead, lead-activity, learning-progress, module, certificate, profile, application, distributor-status, and authentication records.
- Remove AUM, commission, and client queries from the distributor Home page so unavailable features are not loaded or implied.
- Keep existing internal table and route names where renaming them would create unnecessary migration risk; change the customer-facing experience and safely redirect retired portal pages.
