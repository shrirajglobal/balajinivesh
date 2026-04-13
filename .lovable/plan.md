

## Add Login/Logout Button to Website Header

### Problem
There is no visible login/sign-in button on the website. Admin and partner users have no way to access the auth page from the navigation.

### Plan

**1. Add Login/Logout to Header (desktop + mobile)**

- When **not logged in**: Show a "Login" button (with `LogIn` icon) next to the language toggle, linking to `/auth`
- When **logged in**: Show user avatar/initial + a dropdown with:
  - "Partner Portal" link (if user has partner role)
  - "Admin Panel" link (if user has admin role)
  - "Sign Out" button
- On mobile: Add the same Login link or user menu items in the mobile nav overlay

**2. Post-login redirect logic**

- After login, redirect admins to `/admin`, partners to `/partner/dashboard`, and regular users back to the previous page (existing behavior)

**3. Future-proofing for investor login**

- Keep the auth system modular. The current `/auth` page handles admin and partner login. When the 3rd party investor integration comes, a separate investor login flow can be added without disrupting the existing auth.

### Files Changed
- `src/components/layout/Header.tsx` — Add login button (when no user) and user dropdown menu (when logged in) to both desktop and mobile nav

### No database changes needed.

