

# Education Hub — Completion Tracking, Certificates & Gift Rewards

## Overview

Extend the Homemakers and Kids education segments with an account-based progress tracking system. Users complete topics, earn a downloadable PDF certificate from Balaji Nivesh, receive it via email, and can claim a physical gift by submitting their details — which are sent to the back office via email, WhatsApp, and stored in a database.

**Requires Lovable Cloud** for authentication, database, edge functions, and email.

---

## Architecture

```text
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User reads  │────▶│ Mark topic done  │────▶│ Progress saved  │
│  a topic     │     │ (checkbox/button) │     │ in DB table     │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                              All topics done?
                                                       │
                                    ┌──────────────────▼──────────────────┐
                                    │  Certificate generated (PDF)        │
                                    │  + emailed via edge function        │
                                    │  + "Claim Gift" button appears      │
                                    └──────────────────┬──────────────────┘
                                                       │
                                              User fills gift form
                                              (name, phone, address)
                                                       │
                                    ┌──────────────────▼──────────────────┐
                                    │  Edge function:                     │
                                    │  1. Save to gift_claims table       │
                                    │  2. Email back office               │
                                    │  3. WhatsApp message to back office │
                                    └─────────────────────────────────────┘
```

---

## Database Tables (Lovable Cloud)

**1. `profiles`** — basic user info (auto-created on signup)
- `id` (uuid, FK to auth.users), `full_name`, `email`, `phone`, `created_at`

**2. `education_progress`** — tracks topic completions
- `id`, `user_id` (FK), `segment` (enum: 'homemakers' | 'kids'), `topic_id` (text), `completed_at` (timestamp)
- Unique constraint on (user_id, segment, topic_id)

**3. `certificates`** — issued certificates
- `id`, `user_id` (FK), `segment`, `certificate_number` (unique), `issued_at`

**4. `gift_claims`** — gift requests for back office
- `id`, `user_id` (FK), `segment`, `full_name`, `phone`, `address`, `city`, `pincode`, `status` (pending/shipped/delivered), `created_at`

RLS: Users can only read/write their own rows.

---

## Authentication

- Add login/signup pages (email-based) using Supabase Auth
- Protected routes for progress tracking
- Users can browse education content without login, but must sign in to track progress and earn certificates

---

## New Pages & Components

### 1. Auth pages
- `src/pages/Auth.tsx` — login/signup form
- Route: `/auth`

### 2. Updated education segment pages
- `src/pages/education/HomemakersEducation.tsx` — each "Life Lesson" card gets a "Mark Complete" button (requires login)
- `src/pages/education/KidsEducation.tsx` — each "Mission" gets a completion checkbox styled as a fun badge unlock
- Both pages show a progress bar at the top (e.g., "4 of 6 completed")

### 3. Certificate & Gift components
- `src/components/education/CertificateModal.tsx` — shows congratulations, generates PDF certificate (using browser canvas/HTML-to-PDF), download button
- `src/components/education/GiftClaimForm.tsx` — dialog form collecting name, phone, address, city, pincode
- `src/components/education/ProgressTracker.tsx` — reusable progress bar with topic checklist

### 4. Certificate PDF generation
- Generate a branded certificate in-browser using HTML Canvas or a library like `jspdf`
- Certificate includes: user name, segment completed, certificate number, date, Balaji Nivesh branding

---

## Edge Functions

### 1. `send-certificate-email`
- Triggered when all topics in a segment are completed
- Creates certificate record in DB, generates certificate number
- Sends email to user with congratulations (using Lovable Cloud email)

### 2. `notify-gift-claim`
- Triggered when user submits gift claim form
- Saves to `gift_claims` table
- Sends email notification to back office email
- Sends WhatsApp message to back office number (using WhatsApp API URL with pre-filled message)

---

## User Flow

1. User browses education content freely (no login needed)
2. To track progress, user signs up / logs in
3. As they read each topic, they click "Mark Complete" — progress saved to DB
4. Progress bar updates in real-time
5. When all topics in a segment are done:
   - Confetti animation plays
   - Certificate modal appears with download button
   - Certificate emailed to user
   - "Claim Your Gift" button appears
6. User fills gift form → data sent to back office via email + WhatsApp + stored in DB

---

## Implementation Order

1. Enable Lovable Cloud, set up auth and database tables
2. Build auth pages and protected route logic
3. Create Homemakers and Kids education pages with topic content
4. Build progress tracking (DB writes, progress bar component)
5. Build certificate generation (PDF + modal + email edge function)
6. Build gift claim form and notification edge function

