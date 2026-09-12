# Make Ashish a Super Admin

## Current state

- `ashishkhand@gmail.com` does not yet have a website account, so there is no account to grant access to today.
- The admin panel already checks the protected `admin` role before allowing access.
- Google sign-in is already available on the Distributor Login screen.

## Steps

1. Ask Ashish to open **Login → Distributor Login → Continue with Google** and select `ashishkhand@gmail.com` once.
2. After that first sign-in creates the account, assign the protected `admin` role to that exact account in the database.
3. Preserve any existing roles on the account; add admin access without weakening the current access checks.
4. Verify that Ashish can open `/admin` and that a normal non-admin account remains blocked.

## Security

- Match the account by its verified email and store access against its unique account ID.
- Do not hardcode the email in the website or use browser storage for admin authorization.
- Do not create or share a password on Ashish’s behalf; Google handles authentication.

## Required first action

Ashish must complete one Google sign-in before step 2 can be performed. Once completed, the admin grant can be applied immediately.
