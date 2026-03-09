

# Sub-Distributor Portal with RTA Report Upload

## Overview

Build a comprehensive Sub-Distributor Portal where AUM and commission data is tracked via monthly CAMS/KFintech statement uploads by the admin. Partners can view their dashboard with parsed data.

---

## Data Flow

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Admin uploads  │ ──> │  Edge function   │ ──> │  Parsed data    │
│  RTA statement  │     │  parses PDF/CSV  │     │  stored in DB   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                              ┌───────────────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │  Partner Dashboard  │
                    │  shows their AUM,   │
                    │  clients, commissions│
                    └─────────────────────┘
```

---

## New Database Tables

| Table | Purpose |
|-------|---------|
| `partners` | Partner profiles (ARN, status, joined date) |
| `partner_applications` | New partner signup requests |
| `rta_uploads` | Track uploaded statement files |
| `partner_aum_data` | Parsed AUM data per partner/month |
| `partner_commissions` | Commission records |
| `partner_clients` | Client list per partner |
| `partner_leads` | Lead CRM for partners |

---

## Features by User Role

### Public (Unauthenticated)
- `/partner` — Landing page with benefits, "Become a Partner" CTA
- Partner application form → stored in `partner_applications`

### Partner (Authenticated + partner role)
- **Dashboard** — AUM summary, commission total, client count
- **Commission Tracker** — Monthly breakdown, AMC-wise
- **Client List** — All mapped clients with SIP status
- **Lead CRM** — Add/track prospects, follow-up reminders
- **Learning Academy** — Training modules, certification
- **Marketing Toolkit** — Download creatives, brochures

### Admin (Authenticated + admin role)
- **RTA Upload** — Upload CAMS/KFintech statements
- **Partner Management** — Approve applications, view all partners
- **Data Review** — See parsed AUM/commission data

---

## RTA Statement Parsing

CAMS and KFintech statements typically come as:
- **PDF** — Detailed statements (harder to parse)
- **CSV/Excel** — Transaction data (easier to parse)

The edge function will:
1. Accept uploaded file (stored in Supabase Storage)
2. Parse CSV/Excel format (most common for bulk data)
3. Extract: Partner code, Client name, Folio, AUM, Commission
4. Store parsed data in respective tables

---

## New Files

**Pages:**
- `src/pages/Partner.tsx` — Public landing page
- `src/pages/partner/Dashboard.tsx` — Partner dashboard
- `src/pages/partner/Commissions.tsx` — Commission tracker
- `src/pages/partner/Clients.tsx` — Client list
- `src/pages/partner/Leads.tsx` — Lead CRM
- `src/pages/partner/Academy.tsx` — Learning modules
- `src/pages/partner/Toolkit.tsx` — Marketing materials
- `src/pages/admin/RTAUpload.tsx` — Admin RTA upload
- `src/pages/admin/Partners.tsx` — Partner management

**Components:**
- `src/components/partner/PartnerSidebar.tsx` — Dashboard nav
- `src/components/partner/StatsCard.tsx` — Metric cards
- `src/components/partner/ApplicationForm.tsx` — Join form

**Edge Functions:**
- `supabase/functions/parse-rta-statement/index.ts` — Parse uploaded files

---

## Home Page Addition

New "Join Our Team" section with 4 persona cards:
- Homemakers — "Earn from home"
- Students — "Build income while studying"
- CAs — "Add MF distribution to practice"
- Professionals — "Side income opportunity"

Button: "Become a Partner" → `/partner`

---

## Security

- Partners can only view their own data (RLS by user_id)
- Admin role required for RTA uploads and partner management
- Separate `user_roles` table for role management

---

## Implementation Order

1. Database schema (tables + RLS + roles)
2. Partner landing page + application form
3. Home page "Join Our Team" section
4. Partner dashboard with placeholder data
5. Admin RTA upload + parsing edge function
6. Connect parsed data to partner dashboard
7. Additional features (leads, academy, toolkit)

