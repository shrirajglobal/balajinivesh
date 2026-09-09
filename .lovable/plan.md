# Make the logo visibly larger on the website

## Why the logo looks small

Two compounding causes, both confirmed in the code and the image file:

1. **The image file is ~35% empty border.** `src/assets/logo.jpeg` is 1000×889 px, but the actual logo artwork occupies only 610×594 px in the middle (61% × 67% of the frame). The rest is blank background, so at any display size about a third of what you see is empty space.
2. **It is rendered small.** Header: `h-8 sm:h-10` (32–40 px tall). Footer: `h-9 sm:h-10`. Once the empty border is accounted for, the visible artwork is effectively only ~21–27 px tall — thumbnail size.

## Fix

1. **Trim the empty border** from the logo image (crop to the artwork bounding box, with a small even margin) and save as the site's logo asset. This alone makes the visible logo ~1.6× larger at the same display size, with no layout changes.
2. **Increase the display size**:
   - Header: from 32–40 px to ~44–48 px tall (still fits the existing header bar without pushing navigation).
   - Footer: from 36–40 px to ~48 px tall.
3. **Add the brand name next to the logo** in the header ("Balaji Nivesh" in the site's heading font), so brand recognition does not rely on the image alone. This also helps if the client later swaps in a smaller-emblem logo.
4. Reuse the trimmed asset everywhere the logo appears (header, footer, About/Terms pages if applicable, browser tab icon if it uses the same file).

Combined effect: the logo appears roughly **2–2.5× larger** than today.

## Technical details

- Crop with PIL (bounding box of non-background pixels, plus ~4% padding), overwrite/replace `src/assets/logo.jpeg` or add a trimmed variant.
- Update `className` sizes in `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx`; check About.tsx / TermsOfUse.tsx logo usage.
- No layout, navigation, or compliance text (ARN line) changes.
- Verify with a Playwright screenshot of the header at desktop and mobile widths; run typecheck.
