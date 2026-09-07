# Fix: Legal pages appear blank — missing scroll restoration

## Diagnosis (verified)

All four pages — Privacy Policy, Terms of Use, Disclaimer, Commission Disclosure — render correctly with full content in both the preview and the published site (tested headlessly: each page loads its H1 and 2,500–6,800 characters of text, zero console errors). Footer links point to the correct routes (`/privacy`, `/terms`, `/disclaimer`, `/commission-disclosure`).

**Root cause:** the app has no scroll-restoration on navigation. The legal links live in the **footer**, at the bottom of long pages. When a visitor clicks one, React Router swaps the page but keeps the browser scrolled at the bottom — so the new page opens scrolled past all its content, showing only empty space and the footer. It looks exactly like "the page has no content."

## Fix

1. **Add a `ScrollToTop` component** (`src/components/layout/ScrollToTop.tsx`): on every route change (`useLocation` pathname change), call `window.scrollTo({ top: 0, behavior: "instant" })`.
2. **Mount it once** inside `BrowserRouter` in `src/App.tsx` so it applies to every navigation site-wide (public pages, admin, partner portal).

## Result

Clicking any footer link opens the page at the top, with the heading and full content visible immediately.

## Verification

- Typecheck passes.
- Headless browser: open a long page (e.g. homepage), scroll to footer, click "Privacy Policy" → confirm the page loads with the H1 visible at the top (scrollY === 0).
- Repeat for Terms of Use, Disclaimer, Commission Disclosure.
