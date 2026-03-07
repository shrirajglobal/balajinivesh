# BALAJI NIVESH — Website Data Requirement Document
### Data Required from Team for Final Website Delivery
---
**Prepared by:** Development Team  
**Date:** March 7, 2026  
**Project:** Balaji Nivesh Website (balajinivesh.lovable.app)

---

## SECTION 1: BUSINESS IDENTITY & REGISTRATION

| # | Data Required | Currently Shows | Where It Appears |
|---|--------------|----------------|------------------|
| 1 | **ARN Number** | "XXXXXX" (placeholder) | About Page, Footer |
| 2 | **AMFI Registration Number / Details** | "Valid & Active" (generic) | About Page |
| 3 | **Entity Type** — Individual or Firm | "Individual / Firm" (placeholder) | About Page |
| 4 | **Full Legal Entity Name** | "Balaji Nivesh" | Site-wide |
| 5 | **Year of Establishment** | Not mentioned | About Page (for story section) |
| 6 | **Founder / Principal Officer Name** | Not mentioned | About Page |
| 7 | **SEBI Registration Number** (if any) | Not mentioned | About Page |

---

## SECTION 2: CONTACT INFORMATION

| # | Data Required | Currently Shows | Where It Appears |
|---|--------------|----------------|------------------|
| 1 | **Phone Number (primary)** | "+91 XXXXX XXXXX" (placeholder) | Contact Page, Footer |
| 2 | **Phone Number (secondary / WhatsApp)** | Not present | Contact Page |
| 3 | **Email Address** | "info@balajinivesh.com" (assumed) | Contact Page, Footer |
| 4 | **Full Office Address** | "Your Office Address, City, State, India" (placeholder) | Contact Page, Footer |
| 5 | **Office Hours / Working Days** | "Mon - Sat, 10 AM - 6 PM" (assumed) | Contact Page |
| 6 | **Google Maps Link / Embed** | Not present | Contact Page |
| 7 | **WhatsApp Business Number** (for back office gift notifications) | Not configured | Edge Function (notify-gift-claim) |
| 8 | **Back Office Email** (for gift claim notifications) | Not configured | Edge Function (notify-gift-claim) |

---

## SECTION 3: STATISTICS & NUMBERS (Homepage Trust Section)

| # | Data Required | Currently Shows | Where It Appears |
|---|--------------|----------------|------------------|
| 1 | **Years of Experience** | "10+" (assumed) | Homepage |
| 2 | **Number of Investors / Clients** | "1000+" (assumed) | Homepage |
| 3 | **Assets Under Distribution** | "₹50Cr+" (assumed) | Homepage |

> ⚠️ **Important:** These numbers are displayed prominently on the homepage. Please provide accurate figures or confirm the current placeholders.

---

## SECTION 4: ABOUT PAGE CONTENT

| # | Data Required | Currently Shows | Status |
|---|--------------|----------------|--------|
| 1 | **Company Story / History** | Generic founding story | Needs review — please provide the actual founding story, journey, and milestones |
| 2 | **Founder's Photo** | Not present | Optional — can add to About page |
| 3 | **Team Member Details** (if any) | Not present | Names, designations, photos (optional) |
| 4 | **Mission Statement** | Generic text | Please confirm or provide actual mission statement |
| 5 | **Vision Statement** | Not present | Optional |
| 6 | **Core Values** | 4 generic values listed | Please review and confirm |
| 7 | **Certifications / Awards** | Not mentioned | Any AMFI/NISM certifications to showcase? |

---

## SECTION 5: LOGO & BRANDING

| # | Data Required | Currently Shows | Status |
|---|--------------|----------------|--------|
| 1 | **High-resolution Logo** (PNG, transparent background) | logo.jpeg (current) | Need high-res version for certificate PDF |
| 2 | **Favicon** | Default Lovable favicon | Need Balaji Nivesh favicon (32x32 or 64x64) |
| 3 | **OG Image** (for social media sharing) | Not configured | 1200x630px branded image |
| 4 | **Brand Tagline** | "Your trusted partner in financial planning" | Confirm or update |

---

## SECTION 6: LEGAL PAGES (Currently Placeholder)

The following pages currently show "Coming Soon" and need actual content:

| # | Page | Route | Content Needed |
|---|------|-------|---------------|
| 1 | **Privacy Policy** | /privacy | Full privacy policy text (data collection, usage, cookies, etc.) |
| 2 | **Terms of Use** | /terms | Full terms & conditions text |
| 3 | **Disclaimer** | /disclaimer | Investment disclaimer, risk disclosures, AMFI/SEBI compliance text |

> 💡 **Suggestion:** Consider getting these drafted by a legal/compliance professional familiar with AMFI/SEBI regulations.

---

## SECTION 7: RESOURCES PAGE — DOWNLOADABLE FILES

The Resources page lists downloadable forms but no actual files are linked:

| # | Resource | File Needed | Format |
|---|----------|-------------|--------|
| 1 | **KYC Form** | Actual KYC form PDF | PDF |
| 2 | **Nomination Form** | Nomination form PDF | PDF |
| 3 | **Beginner's Investment Guide** | Balaji Nivesh branded guide | PDF |
| 4 | **Tax Planning Checklist** | Tax planning document | PDF |
| 5 | **SIP Registration Form** | SIP form PDF | PDF |
| 6 | **Goal Planning Worksheet** | Goal planning template | PDF |
| 7 | **Monthly Market Report** | Latest market report | PDF |
| 8 | **Fund Comparison Template** | Fund comparison sheet | PDF |

---

## SECTION 8: SOCIAL MEDIA & EXTERNAL LINKS

| # | Data Required | Currently Present | Where It Appears |
|---|--------------|-------------------|------------------|
| 1 | **Facebook Page URL** | No | Footer (can add) |
| 2 | **Instagram Profile URL** | No | Footer (can add) |
| 3 | **LinkedIn Profile URL** | No | Footer (can add) |
| 4 | **YouTube Channel URL** | No | Footer (can add) |
| 5 | **Twitter/X Profile URL** | No | Footer (can add) |
| 6 | **WhatsApp Chat Link** | No | Floating button (can add) |
| 7 | **Google Business Profile URL** | No | Footer / Contact |

---

## SECTION 9: EDUCATION HUB — CERTIFICATES & GIFTS

| # | Data Required | Purpose | Status |
|---|--------------|---------|--------|
| 1 | **Certificate Signatory Name & Designation** | Appears on PDF certificate | Currently shows "Balaji Nivesh" generically |
| 2 | **Digital Signature / Stamp Image** | For certificate PDF | Not present — would add authenticity |
| 3 | **Physical Gift Details** | What gift will be sent to users who complete education? | Not defined — team needs to decide |
| 4 | **Back Office WhatsApp Number** (for gift claim alerts) | Cloud secret: BACKOFFICE_WHATSAPP | Not configured |
| 5 | **Back Office Email** (for gift claim alerts) | Cloud secret: BACKOFFICE_EMAIL | Not configured |

---

## SECTION 10: DOMAIN & DEPLOYMENT

| # | Data Required | Status |
|---|--------------|--------|
| 1 | **Custom Domain** (e.g., www.balajinivesh.com) | Currently on balajinivesh.lovable.app |
| 2 | **Domain Registrar Access** (for DNS configuration) | Needed if custom domain |
| 3 | **SSL Certificate** | Auto-provisioned by Lovable |
| 4 | **Email Domain Setup** (for sending auth/certificate emails from @balajinivesh.com) | Not configured |

---

## SECTION 11: SEO & ANALYTICS

| # | Data Required | Status |
|---|--------------|--------|
| 1 | **Google Analytics Tracking ID** (GA4) | Not configured |
| 2 | **Google Search Console Verification** | Not configured |
| 3 | **Meta Description** (for homepage) | Uses default |
| 4 | **Target Keywords** | Not defined |
| 5 | **Google Tag Manager ID** (if using) | Not configured |

---

## SECTION 12: CONTACT FORM HANDLING

| # | Decision Required | Current State |
|---|------------------|---------------|
| 1 | **Where should contact form submissions go?** | Currently simulated (no actual delivery) |
| 2 | **Email address for form notifications** | Not configured |
| 3 | **CRM Integration** (if any) | Not configured |
| 4 | **WhatsApp notification for new leads?** | Not configured |

---

## PRIORITY SUMMARY

### 🔴 Critical (Must have before launch)
1. ARN Number
2. Phone Number
3. Full Office Address  
4. Email Address
5. Privacy Policy, Terms, Disclaimer content
6. Confirm homepage statistics (years, clients, AUD)

### 🟡 Important (Should have)
7. High-res logo (PNG, transparent)
8. Favicon
9. Company story review/confirmation
10. Downloadable resource PDFs
11. Contact form delivery setup
12. Back office WhatsApp & Email for gift notifications
13. Custom domain

### 🟢 Nice to Have
14. Social media links
15. Team photos
16. Google Analytics / Tag Manager
17. Digital signature for certificates
18. OG image for social sharing

---

**Please review each section and provide the required data. Items marked with placeholders (XXXXX) are visible to website visitors and should be updated before launch.**

*Document prepared for internal use by the Balaji Nivesh development team.*
