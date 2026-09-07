# Standardise the ARN / distributor identity line site-wide

Every place the site names the firm and its ARN must read exactly:

```text
Balaji Nivesh Private Limited
AMFI-registered Mutual Fund Distributor | ARN-173142
```

Today the same fact appears in at least six different shapes — "ARN – 173142" (en-dash) in the header, legal pages and the closing block, "AMFI Reg. ARN-173142" in the trust strip, "ARN NO: ... | ARN Holder: ..." in the footer strip, "ARN-173142 | AMFI Registered" in the three language files, and "AMFI registered mutual fund distributor" with no ARN at all on the product pages.

## One source of truth

Add a small shared helper that reads the company name and ARN from the existing site settings (already `Balaji Nivesh Private Limited` and `ARN-173142`) and returns the approved wording in two shapes:

- Two-line form (name on line 1, credential line below) — for the header bar, footer, closing block.
- Single-line inline form — for sentences inside legal copy.

The helper normalises the ARN so it is always printed as `ARN-173142`, with a plain hyphen, whatever the setting holds. Everything below consumes the helper instead of hardcoded text, so a future ARN change is one edit.

## Where it gets applied

| Area | Current | Action |
| --- | --- | --- |
| Header compliance bar | "· AMFI-registered Mutual Fund Distributor · ARN – 173142" | approved format |
| Footer brand line + statutory strip | "ARN-173142 · Balaji Nivesh…" and "ARN NO: … \| ARN Holder: …" | single approved strip |
| Trust strip (AuthorityStrip) | "AMFI Reg. ARN-173142" | "AMFI-registered Mutual Fund Distributor \| ARN-173142" |
| Closing block (NextStepBlock) | "ARN – 173142" | approved format |
| Home page trust line | "SEBI-compliant AMFI-registered distributor" | approved format |
| About page credentials | "ARN-173142" | approved format |
| Disclaimer, Privacy Policy, Terms of Use | "(ARN – 173142)" | approved inline format |
| Commission Disclosure | "(ARN-173142)" | approved inline format |
| Compliance disclaimer component | no ARN | append `| ARN-173142` |
| Mutual Funds / SIF / AIF / PMS pages | "AMFI registered mutual fund distributor" | approved inline format |
| English, Hindi, Bengali footer/about strings | mixed | approved format (the credential line stays in English as a statutory string) |
| index.html meta description, public/llms.txt | mixed | approved format |

## Left unchanged deliberately

- Partner ARN fields in the admin and partner portal (`ARN Number`, per-partner ARNs in the locator, RTA statement matching) — those are individual sub-distributor numbers, not the firm's statutory line.
- NISM academy chapter text that discusses ARN registration as a topic.

## Verification

Typecheck, then load the home page, About, Disclaimer, Privacy Policy, Terms of Use and Commission Disclosure in the browser and confirm every visible ARN mention matches the approved string, in all three languages.
