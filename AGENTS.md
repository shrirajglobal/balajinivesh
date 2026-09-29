# Project architecture rules

- Keep statutory identity wording centralized through `src/lib/arn.ts`; this prevents page-level ARN drift.
- Keep public investor-support and informational pages as lazy routes under the shared layout, with route metadata and both sitemap sources updated together; this keeps navigation and discovery consistent.
- Treat AMC examples as an illustrative directory, never a claim of Balaji Nivesh empanelment; actual distribution relationships require confirmed business data.