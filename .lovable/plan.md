

## Super Admin Panel — Comprehensive Plan

### Summary
Build a full-featured Super Admin dashboard at `/admin` with sidebar navigation, covering every manageable aspect of the platform. Also create the super admin account (`the.suvee@gmail.com` / `Looks@1634`) and assign the `admin` role.

---

### Step 1: Create Super Admin Account

- Use the Auth API to create user `the.suvee@gmail.com` with password `Looks@1634` (auto-confirm enabled temporarily, then disabled again)
- Insert an `admin` role into `user_roles` for that user
- Insert a profile row in `profiles`

### Step 2: Admin Layout with Sidebar

Create `src/components/admin/AdminLayout.tsx` — a sidebar-based layout (using shadcn Sidebar) with these sections:

| Section | Route | Description |
|---------|-------|-------------|
| Dashboard | `/admin` | Overview stats & quick actions |
| Partner Applications | `/admin/partners` | Approve/reject applications (existing, will be moved) |
| Active Partners | `/admin/partners/active` | View/edit/deactivate partners, edit ARN/EUIN |
| RTA Uploads | `/admin/rta-upload` | Upload RTA statements (existing, will be moved) |
| Clients | `/admin/clients` | View all partner clients across the platform |
| Commissions | `/admin/commissions` | View/manage commission records |
| AUM Data | `/admin/aum` | Browse AUM data by partner/scheme |
| Users | `/admin/users` | View all registered users, assign roles |
| Gift Claims | `/admin/gifts` | View/update gift claim statuses |
| Education Certs | `/admin/certificates` | View issued certificates |
| Contact Leads | `/admin/leads` | View leads submitted across all partners |
| Content/Settings | `/admin/settings` | Placeholder for future CMS/settings |

### Step 3: Admin Dashboard Page (`/admin`)

Summary cards showing:
- Total registered users
- Pending partner applications
- Active partners count
- Total AUM
- Pending gift claims
- Recent activity feed

### Step 4: Partner Management Pages

**Applications** (refactor existing `AdminPartners`):
- Table with search/filter by status
- Approve (with ARN input dialog) / Reject actions

**Active Partners**:
- List all partners with ARN, EUIN, status, joined date
- Edit partner details inline
- Deactivate/reactivate toggle

### Step 5: User Management Page

- List all profiles (from `profiles` table)
- Show email, name, roles
- Assign/remove roles (admin, partner, user)
- Search by email/name

### Step 6: Financial Data Pages

**Commissions**: Table of all `partner_commissions` with filters by partner, AMC, month, status
**AUM Data**: Table of all `partner_aum_data` with filters
**Clients**: Table of all `partner_clients` with partner name

### Step 7: Gift Claims Management

- Table of all `gift_claims` with status filter
- Update status (pending → shipped → delivered)

### Step 8: RTA Uploads (refactor existing)

- Move into admin layout
- Same functionality, cleaner integration

### Step 9: Database Changes

- Add RLS policy on `profiles` for admin SELECT (admins can view all profiles)
- Add RLS policy on `gift_claims` for admin ALL
- Add RLS policy on `certificates` for admin SELECT
- Add RLS policy on `education_progress` for admin SELECT
- Add RLS policy on `partner_leads` for admin ALL
- Migration to add `gift_claim_status` update capability for admins

### Step 10: Route Updates

- Add all new `/admin/*` routes to `App.tsx`
- Each admin page wrapped with admin role check (redirect to `/auth` if not admin)
- Create a reusable `AdminGuard` component

### Step 11: Header Integration

- Add "Admin" link in header navigation (visible only to admin users)

---

### Technical Notes

- All admin pages use the `has_role(auth.uid(), 'admin')` RLS function already in the database
- No new database tables needed — only new RLS policies on existing tables
- The admin sidebar uses shadcn `Sidebar` component with `collapsible="icon"` for mobile
- Approximately 12 new files to create, 2 existing files to refactor

