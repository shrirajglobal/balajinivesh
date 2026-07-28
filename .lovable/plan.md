# Chat, Reviews & Calendar Upgrades

Four independent improvements, grouped for one pass.

---

## 1. Ask Balaji Nivesh — smarter chat with lead capture

**In-chat action buttons (always visible in header of chat panel)**
Add a compact action row at the top of the chat panel with three icon-buttons:
- WhatsApp (uses existing `useWhatsAppContactHref`)
- Call (`tel:` link from `site_settings.contact_phone`)
- Book a call (routes to `/contact`)

**Lead capture (only when a CTA is clicked)**
Clicking any of the three buttons opens an inline mini-form inside the chat:
- Name (required)
- Mobile (required, 10-digit validated)
- Optional 1-line "What's on your mind?"

On submit:
- Insert into `contact_submissions` (source = `chatbot_whatsapp` / `chatbot_call` / `chatbot_book`) — auto-funnels into `lead_inbox` via existing trigger.
- Attach `name` + `phone` to the current `chat_conversations` row (new nullable columns `lead_name`, `lead_phone`, `lead_captured_at`).
- Then perform the original action (open WhatsApp / dial / navigate to /contact).
- If the same conversation already captured a lead, skip the form and go straight to the action.

**Fix chat text formatting**
The current bubbles use `prose prose-sm` inside `text-sm` containers, which makes headings, lists and paragraphs collapse awkwardly. Rework the assistant bubble:
- Remove the `bg-muted/60` bubble background on assistant messages (per chat-UI guidance); render on card surface with normal foreground.
- Give user messages a proper high-contrast pair (primary / primary-foreground) instead of `bg-primary/10`.
- Tighten Markdown component styles: proper spacing for `p`, `ul`, `ol`, `strong`, `h3/h4`; render links as underlined primary; add spacing between paragraphs.
- Add a subtle typing shimmer while streaming instead of the current spinner-in-bubble.
- Widen the panel slightly on desktop (`sm:w-[420px]`).

**Suggestion chips**
Keep the 4 starter chips but restyle as pill buttons in a 2-col grid so they don't stack as thin rows.

---

## 2. Admin: Chat conversation viewer (read-only)

New admin page `/admin/chats` (component `src/pages/admin/AdminChats.tsx`):
- Left list: conversations ordered by `updated_at` desc, showing title, captured name/phone (if any), message count, last activity.
- Filters: date range, "Has contact info", search on title/lead name/phone.
- Right pane: full transcript rendered with the same Markdown component, plus citation chips. Read-only.
- Link the "Has contact info" conversations to their `lead_inbox` row for quick follow-up.

Route added in `src/App.tsx` under `AdminGuard`. Sidebar link added in `AdminLayout.tsx`.

**RLS**: add admin SELECT policies on `chat_conversations` and `chat_messages` using `has_role(auth.uid(), 'admin')`. Existing user policies untouched.

---

## 3. Google Reviews — trust widget

Store the review link (`https://share.google/IK6J7sBBQJRY6TR55`) in `site_settings` as `google_review_url`. Add optional `google_rating` and `google_review_count` keys admins can edit from `AdminSiteSettings`.

Two placements:

**a) Homepage authority strip addition**
Add a Google-badged card to `AuthorityStrip.tsx`: yellow stars, `4.X / 5` from Google, "N happy families reviewed us", CTA `Leave a Google review →` opening the link in a new tab.

**b) Floating "Rate us" nudge (post-conversion)**
A small, dismissible bottom-left card that appears only:
- After a lead form submission (contact / calculator / gift claim) — set `localStorage.bn_can_ask_review = 1`.
- On `/contact` "thank you" state and after `CalculatorLeadCapture` success.
- Never on `/admin` or `/partner/dashboard`.
Copy: *"Loved working with us? A quick Google review helps other families find us."* Button → review URL. Persist a `bn_review_dismissed` flag for 60 days once dismissed or clicked.

No fake ratings — if `google_rating` isn't set, the strip renders "Rated on Google" with the stars-only badge and CTA.

---

## 4. Partner CRM — Google Calendar sync (2-way OAuth)

Uses the **Google Calendar App User Connector** so each partner connects their own Google account. This is the correct Lovable primitive per the App User Connectors knowledge.

**Setup (workspace-level, one-time by admin)**
Run `connector_app_user--connect_client` for `connector_id: google_calendar`. Admin creates the Google OAuth web client in Google Cloud Console, adds gateway redirect URI `https://connector-gateway.lovable.dev/api/v1/app-users/oauth2/callback`, requests scopes:
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`
- `.../auth/calendar.events`

**Per-partner connect flow**
- New "Google Calendar" card on Partner Dashboard + Leads page.
- Button "Connect Google Calendar" → opens the App User Connector popup (`connectAppUser` with `app_user_id = partner user.id`).
- Store returned connection key in `partner_google_connections` (new table: `partner_id`, `connection_key` (text), `google_email`, `connected_at`).
- Disconnect button clears the row.

**Sync behavior**
When a partner sets `next_follow_up_date` on a lead (existing Leads CRM):
- Server-side Edge Function `partner-calendar-sync` calls `callAsAppUser` → `POST /calendar/v3/calendars/primary/events` to create/update an event titled `Follow-up: {lead.name}` with 15-min default duration, description containing lead phone + notes, and a 30-min popup reminder.
- Persist returned `event_id` on the lead (new column `partner_leads.google_event_id`).
- Update triggers PATCH; clearing the follow-up date deletes the event.

**Edge cases**
- If the partner hasn't connected Google, keep the current in-app reminder behavior silently — no error.
- Token refresh handled by the gateway; if the connection dies, surface an inline "Reconnect Google Calendar" banner on the Leads page.

---

## Technical details

**New DB migration**
- `chat_conversations`: add `lead_name text`, `lead_phone text`, `lead_captured_at timestamptz`, `lead_action text`.
- `chat_conversations` + `chat_messages`: add admin SELECT policy via `has_role`.
- `site_settings`: seed keys `google_review_url`, `google_rating`, `google_review_count`.
- New table `partner_google_connections` (partner_id UUID PK → partners.id, connection_key text, google_email text, connected_at timestamptz). GRANT to `authenticated`/`service_role`, RLS: partner sees own row, admin sees all.
- `partner_leads`: add `google_event_id text`.

**New/changed files**
- `src/components/chatbot/ChatWidget.tsx` — action row, lead form, formatting.
- `src/components/chatbot/ChatLeadForm.tsx` — new.
- `src/components/blog/Markdown.tsx` — verify prose overrides; may add compact variant.
- `src/pages/admin/AdminChats.tsx` — new.
- `src/components/layout/AuthorityStrip.tsx` — Google card.
- `src/components/reviews/GoogleReviewNudge.tsx` — new floating post-conversion card, mounted in `LayoutWrapper`.
- `src/pages/admin/AdminSiteSettings.tsx` — expose 3 new keys.
- `src/components/partner/GoogleCalendarCard.tsx` — new; used in `Dashboard.tsx` + `Leads.tsx`.
- `src/pages/partner/Leads.tsx` — call sync when follow-up date changes.
- `supabase/functions/partner-calendar-sync/index.ts` — new Edge Function using `callAsAppUser` helper.
- `supabase/functions/_shared/appUserConnector.ts` — new helper per tanstack-app-user-connector guidance (adapted to Supabase Edge Function runtime).
- `src/App.tsx` + `AdminLayout.tsx` — new admin route/link.

**Not changing**
- Existing chatbot Edge Function RAG behavior, compliance system prompt, streaming protocol.
- Existing lead_inbox trigger — it will pick up the new `contact_submissions` rows automatically.

---

## Order of execution
1. Migration (chat lead cols, admin RLS, partner_google_connections, google_event_id, site_settings seed).
2. Chat UI — action buttons, lead form, formatting fix.
3. Admin `/admin/chats` viewer.
4. Google Review — AuthorityStrip card + post-conversion nudge + admin settings fields.
5. Google Calendar — `connect_client` for `google_calendar`, connect card, Edge Function, Leads integration.
