# Temporary redirect of all login flows to Wealth Elite

## Goal
Until the final auth process is frozen, every login/sign-in entry point on the site should send users to the external Wealth Elite login URL in a new browser tab.

## External URL
`https://login.arn.wealthelite.in/`

## What will change

1. **Single source of truth**
   - Add a constant `EXTERNAL_LOGIN_URL = "https://login.arn.wealthelite.in/"` in a central location (e.g., `src/lib/externalAuth.ts`).
   - Add a small helper `openExternalLogin()` that opens the URL in `_blank`.

2. **Public login buttons**
   - Header desktop Login button → external URL in new tab.
   - Header mobile menu Login button → external URL in new tab.
   - Forum "Sign in" / "New thread" prompts → external URL in new tab.
   - Education pages "Sign in" links (Homemakers, Kids) → external URL in new tab.
   - Partner application "Sign in / Create account" link → external URL in new tab.

3. **Protected-area guards**
   - `AdminGuard`: when no user is signed in, open the external login in a new tab and render a short "Opening login..." message instead of redirecting internally.
   - `PartnerLayout`: same behaviour for unauthenticated users.

4. **Fallback `/auth` page**
   - Keep the `/auth` route so old bookmarks/links do not 404.
   - On mount, open the external URL in a new tab and show a message explaining the temporary redirect.
   - The in-app email/password form will be hidden/replaced during this temporary period.

5. **Known temporary limitations**
   - Redirect-after-login (e.g., returning to `/forum` or `/partner/dashboard`) cannot be preserved because Wealth Elite does not share session state with this app.
   - Admin and partner portal access depends on whether Wealth Elite eventually redirects back and creates a session in this app. Until then, those areas will remain unreachable after the external login.

## Out of scope
- No changes to Supabase auth configuration.
- No changes to role checks or protected-route logic beyond the redirect target.
- No integration with Wealth Elite APIs.

## Verification
- Check that every Login / Sign in button on the site links to `https://login.arn.wealthelite.in/` and opens in a new tab.
- Confirm `/auth` opens the external URL instead of showing the email/password form.
- Confirm the build passes and no `/auth` internal links remain.
