

## Remove Lovable Branding & Update Favicon

### Current State
- The favicon is set to `/favicon.ico` (likely the default Lovable favicon)
- The project already has a custom logo at `src/assets/logo.jpeg`

### Plan

1. **Update Favicon**: Change `index.html` to use the existing Balaji Nivesh logo (`src/assets/logo.jpeg`) as the favicon by copying it to `public/favicon.png` and updating the `<link>` tag.

2. **Hide Lovable Badge**: Direct you to **Settings → Hide 'Lovable' Badge** toggle to remove the "Edit in Lovable" badge from the preview.

3. **Audit for any Lovable references**: Search codebase for any "lovable" text/branding and remove if found.

### Note
To remove the "Edit in Lovable" badge that appears on the published site, go to your **Project Settings** and turn on **"Hide 'Lovable' Badge"**. This is a setting toggle, not a code change.

