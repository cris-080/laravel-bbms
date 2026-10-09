# Blood Bank Management System (BBMS) — Updated Project Handoff & Remaining Tasks

**Project:** Blood Bank Management System  
**Repository:** `https://github.com/cris-080/laravel-bbms.git`  
**Tech Stack:** Laravel + Inertia.js + React + Tailwind CSS + Laravel Fortify + Spatie Laravel-Permission  
**Database:** MySQL (`bbms_db`)  
**Architecture:** MVC with Fat Model / Thin Controller

---

## 1. IMPORTANT INSTRUCTIONS FOR THE NEXT AI / TEAM MEMBER

You are continuing an existing Blood Bank Management System project. **Do not rebuild completed modules.** Review the current repository first, then only work on the remaining tasks listed in this file.

### Strict Rules

1. Follow Laravel MVC architecture.
2. Use the **Fat Model / Thin Controller** approach.
3. Use **Form Requests** for validation where appropriate.
4. Wrap multi-step database writes in `DB::transaction()`.
5. Do not invent database columns or tables.
6. Use the existing database schema only.
7. Use Inertia.js to pass Laravel controller data directly to React pages.
8. Keep feature routes modular inside the `routes/` folder.
9. Use Spatie Laravel-Permission for RBAC.
10. Protect restricted features on both:
   - Backend routes/middleware
   - Frontend navigation/buttons
11. React pages are located under:
   `resources/js/pages/`
12. Do not overwrite teammate work unless a bug is confirmed.

---

# 2. CURRENT DATABASE MODELS / CORE TABLES

The project currently uses these main BBMS tables/models:

- `users`
- `donors`
- `blood_inventory`
- `donations`
- `donation_schedules`
- `blood_requests`
- `audit_logs`

Roles are managed using Spatie Laravel-Permission:

- `admin`
- `staff`

Blood groups:

- `A+`
- `A-`
- `B+`
- `B-`
- `AB+`
- `AB-`
- `O+`
- `O-`

---

# 3. COMPLETED FOUNDATION WORK

The following foundation/setup work was already completed before the latest development work:

- [x] Laravel project setup
- [x] MySQL database configuration
- [x] Inertia.js + React integration
- [x] Tailwind CSS integration
- [x] Laravel Fortify authentication
- [x] Spatie Laravel-Permission installation
- [x] `admin` and `staff` roles
- [x] Authentication middleware
- [x] Global auth props through `HandleInertiaRequests.php`
- [x] Core migrations
- [x] Core Eloquent models
- [x] Blood bank seeder / imported `bbms_db_clean.sql`
- [x] Base authenticated system layout
- [x] Analytical Dashboard
- [x] Blood Inventory module
- [x] Blood Donation / Collection module
- [x] Audit Log module

Do **not** recreate these modules.

---

# 4. NEWLY COMPLETED WORK

The following modules were completed during the latest development session.

---

## 4.1 Donor Management — COMPLETED

### Files

- `app/Http/Controllers/DonorController.php`
- `app/Http/Requests/DonorRequest.php`
- `app/Models/Donor.php`
- `routes/donors.php`
- `resources/js/pages/Donors/Index.jsx`
- `resources/js/pages/Donors/Create.jsx`
- `resources/js/pages/Donors/Edit.jsx`

### Features Completed

- [x] Donor listing
- [x] Create donor
- [x] Edit donor
- [x] Delete donor
- [x] Search donors
- [x] Filter donors by blood group
- [x] Blood group validation
- [x] Unique email validation
- [x] Donation eligibility calculation
- [x] Minimum 56-day interval from `last_donation_date`
- [x] Display next eligible donation date
- [x] Audit logging for donor create/update/delete
- [x] Modular donor routes

### Donor Eligibility

Eligibility logic is kept in `Donor.php`, not duplicated in controllers.

A donor is considered eligible when:

- there is no previous donation date, or
- at least 56 days have passed since `last_donation_date`

---

## 4.2 Blood Requests / Dispensing — COMPLETED

### Files

- `app/Http/Controllers/BloodRequestController.php`
- `app/Http/Requests/BloodRequestFormRequest.php`
- `routes/blood-requests.php`
- `resources/js/pages/BloodRequests/Index.jsx`
- `resources/js/pages/BloodRequests/Create.jsx`

### Features Completed

- [x] Create blood request
- [x] List blood requests
- [x] New requests default to `Pending`
- [x] Approve and release blood
- [x] Reject blood requests
- [x] Validate requested blood group
- [x] Validate requested units
- [x] Check available blood inventory before dispensing
- [x] Prevent negative stock
- [x] Deduct blood inventory on approval/release
- [x] Use `DB::transaction()`
- [x] Use row locking during dispensing
- [x] Set request status to `Handed Over`
- [x] Generate reference code in format similar to `TRX-XXXXXX-BLD`
- [x] Save `released_to`
- [x] Save `dispensed_at`
- [x] Audit log blood request creation
- [x] Audit log dispensing
- [x] Audit log rejection
- [x] Show current blood inventory on the request form

---

## 4.3 User & Role Management — COMPLETED

### Files

- `app/Http/Controllers/UserController.php`
- `routes/users.php`
- `resources/js/pages/Users/Index.jsx`
- `resources/js/pages/Users/Create.jsx`
- `resources/js/pages/Users/Edit.jsx`
- `app/Models/User.php`

### Features Completed

- [x] User listing
- [x] Create user
- [x] Edit user
- [x] Delete user
- [x] Assign `admin` role
- [x] Assign `staff` role
- [x] Update user role using Spatie `syncRoles()`
- [x] Optional password update during edit
- [x] Prevent logged-in administrator from deleting their own account
- [x] Audit log user creation
- [x] Audit log user update
- [x] Audit log user deletion
- [x] Entire `/users` module protected by:
  `auth` + `role:admin`

### User Model Cleanup

`User.php` uses:

```php
use HasFactory, Notifiable, HasRoles;
```

Do not duplicate the `HasFactory` / `Notifiable` trait declarations.

---

## 4.4 Donation Schedules — COMPLETED

### Files

- `app/Http/Controllers/ScheduleController.php`
- `routes/schedules.php`
- `resources/js/pages/Schedules/Index.jsx`
- `resources/js/pages/Schedules/Create.jsx`

### Features Completed

- [x] Schedule listing
- [x] Create donation appointment
- [x] Link appointment to `donor_id`
- [x] Select appointment date
- [x] Select appointment time
- [x] New schedule defaults to `Scheduled`
- [x] Mark schedule as `Completed`
- [x] Mark schedule as `Cancelled`
- [x] Audit log appointment creation
- [x] Audit log appointment status changes
- [x] Modular schedule routes

### Valid Schedule Statuses

Use only:

- `Scheduled`
- `Completed`
- `Cancelled`

Do not invent `No Show` unless the database schema is intentionally changed by the team.

---

## 4.5 Layout / Flash Messages / Admin Visibility — COMPLETED

### Updated Files

- `app/Http/Middleware/HandleInertiaRequests.php`
- `resources/js/Layouts/AuthenticatedLayout.jsx`

### Features Completed

- [x] Global `flash.success`
- [x] Global `flash.error`
- [x] Success notification banner
- [x] Error notification banner
- [x] Self-delete warning is visible to the user
- [x] `Users` sidebar link is admin-only
- [x] `Audit Log` sidebar link is admin-only
- [x] Backend protection remains enforced separately

---

# 5. CURRENT MODULE STATUS

| Module | Status |
|---|---|
| Authentication | ✅ Complete |
| Roles & Permissions | ✅ Complete |
| Authenticated Layout | ✅ Complete |
| Dashboard | ✅ Complete |
| Donor Management | ✅ Complete |
| Blood Inventory | ✅ Complete |
| Blood Donation / Collection | ✅ Complete |
| Blood Requests / Dispensing | ✅ Complete |
| Donation Schedules | ✅ Complete |
| User & Role Management | ✅ Complete |
| Audit Logs | ✅ Complete |
| Flash Notifications | ✅ Complete |

---

# 6. REMAINING TASKS FOR THE NEXT MEMBER

The main BBMS modules are now implemented. The next member should focus on **integration, verification, cleanup, and any explicitly missing auxiliary feature**, rather than rebuilding core modules.

---

## Priority 1 — Verify Profile Module

Check whether these already exist and work:

- `ProfileController.php`
- `resources/js/pages/Profile/Edit.jsx`
- profile route(s)

### If already working

Do not rebuild them.

### If missing or incomplete

Complete only the profile functionality supported by the existing project/authentication setup.

Recommended scope:

- Update authenticated user's name
- Update authenticated user's email
- Update password only using the project's existing Fortify/profile setup
- Do not invent new profile database columns

---

## Priority 2 — Full Role-Based Access Testing

Test using both:

### Admin Account

Admin should be able to access:

- Dashboard
- Donors
- Inventory
- Donations
- Schedules
- Blood Requests
- Users
- Audit Logs

### Staff Account

Staff should be able to access operational modules but should **not** be able to access admin-only modules.

Verify:

- [ ] `/users` blocked for staff
- [ ] `/audit-logs` blocked for staff
- [ ] Users sidebar link hidden for staff
- [ ] Audit Log sidebar link hidden for staff
- [ ] Admin links visible for admin
- [ ] Direct URL access is protected, not just hidden in the UI

---

## Priority 3 — End-to-End Blood Request Test

Test the entire workflow:

1. Create a blood request
2. Confirm status is `Pending`
3. Check current stock
4. Approve request
5. Enter `released_to`
6. Confirm stock decreases correctly
7. Confirm request becomes `Handed Over`
8. Confirm `reference_code` exists
9. Confirm `dispensed_at` is saved
10. Confirm audit log entry exists

Also test:

- [ ] requesting more blood than available
- [ ] approving an already completed request
- [ ] rejecting a pending request
- [ ] attempting to reject an already completed request
- [ ] no negative blood inventory is possible

---

## Priority 4 — End-to-End Donation Collection Test

Verify the previously completed Donation module still works correctly after the latest changes.

Expected behavior:

1. Select donor
2. Record donation
3. If donation is `Completed`:
   - matching `blood_inventory.total_units` increases
   - donor `last_donation_date` updates
4. Audit log is created

Also test cancellation/deletion logic if already implemented.

Do not rewrite the Donation module unless a real bug is found.

---

## Priority 5 — Donor Eligibility + Schedule Integration Testing

Verify:

- [ ] Donor eligibility correctly uses the 56-day rule
- [ ] Donor without prior donation is eligible
- [ ] Recently donated donor is shown as not eligible
- [ ] Next eligible date is correct
- [ ] Schedule creation links to the correct donor
- [ ] Schedule status changes to Completed
- [ ] Schedule status changes to Cancelled
- [ ] Audit logs are created for scheduling actions

If the team decides that ineligible donors should be blocked from scheduling, implement that only after confirming it is a team requirement.

---

## Priority 6 — Dashboard Regression Check

Do not rebuild the Dashboard.

Verify that its counts still reflect the updated modules:

- Total Donors
- Total Blood Units
- Pending Requests
- Upcoming Schedules
- Completed Donations
- Blood inventory status
- Recent requests
- Upcoming schedules
- Admin audit trail

Fix only confirmed bugs.

---

## Priority 7 — UI / Navigation Cleanup

Review the sidebar and pages for:

- duplicate menu items
- dead links
- routes that do not exist
- inconsistent page naming
- buttons that lead to missing pages
- admin-only links accidentally visible to staff
- responsive layout issues

Important:

If `/history` does not have an implemented route/page, either connect it to the existing Donation History view or remove/hide the dead navigation item after confirming the intended design with the team.

Do not invent a new history module if the Donations Index already serves as donation history.

---

## Priority 8 — Validation & Error Handling Review

Verify all forms display Laravel validation messages correctly.

Review:

- Donor forms
- Blood Request form
- Schedule form
- User form
- Donation form

Also verify global flash banners:

- `flash.success`
- `flash.error`

No raw exception page should appear during normal user actions.

---

## Priority 9 — Audit Log Coverage

Confirm audit entries are created for major actions:

- donor created
- donor updated
- donor deleted
- donation recorded
- blood request created
- blood dispensed
- blood request rejected
- schedule created
- schedule status updated
- user created
- user updated
- user deleted

Do not duplicate audit records unnecessarily.

---

## Priority 10 — Final Integration & Merge Preparation

Before merging to `main`:

1. Pull the latest `main`
2. Resolve conflicts carefully
3. Do not overwrite teammate modules
4. Run:

```bash
php artisan optimize:clear
php artisan route:list
```

5. Run the application:

```bash
composer run dev
```

6. Test all major pages
7. Test admin account
8. Test staff account
9. Confirm database writes are correct
10. Check Git status
11. Do not commit local database files such as:

```text
database/database.sqlite
```

The project currently uses MySQL (`bbms_db`).

---

# 7. IMPORTANT ROUTES TO VERIFY

Expected modular feature routes include:

```text
/dashboard
/donors
/inventory
/donations
/blood-requests
/schedules
/users
/audit-logs
```

Expected modular route files include:

```text
routes/donors.php
routes/inventory.php
routes/donations.php
routes/blood-requests.php
routes/schedules.php
routes/users.php
routes/audit-logs.php
```

Do not dump all routes directly into `routes/web.php`.

`routes/web.php` should load the feature route files.

---

# 8. IMPORTANT BUSINESS RULES

## Blood Donation

Completed donation:

```text
blood_inventory.total_units += units_donated
```

and updates:

```text
donors.last_donation_date
```

Use a database transaction.

---

## Blood Dispensing

Before release:

```text
blood_inventory.total_units >= blood_requests.units_needed
```

If true:

```text
blood_inventory.total_units -= units_needed
status = Handed Over
reference_code = TRX-XXXXXX-BLD
released_to = recipient
dispensed_at = current datetime
```

If false:

```text
DO NOT dispense
DO NOT allow negative stock
```

Use a database transaction.

---

## Donor Eligibility

Minimum interval:

```text
56 days since last_donation_date
```

---

## Schedule Status

Allowed:

```text
Scheduled
Completed
Cancelled
```

---

## Roles

Allowed:

```text
admin
staff
```

---

# 9. FILES THAT SHOULD NOT BE REBUILT WITHOUT A CONFIRMED BUG

The next AI/team member should treat these as completed:

```text
app/Http/Controllers/DonorController.php
app/Http/Controllers/BloodInventoryController.php
app/Http/Controllers/DonationController.php
app/Http/Controllers/BloodRequestController.php
app/Http/Controllers/ScheduleController.php
app/Http/Controllers/UserController.php
app/Http/Controllers/AuditLogController.php
app/Http/Controllers/DashboardController.php

resources/js/Layouts/AuthenticatedLayout.jsx
resources/js/pages/Dashboard.jsx

resources/js/pages/Donors/
resources/js/pages/Inventory/
resources/js/pages/Donations/
resources/js/pages/BloodRequests/
resources/js/pages/Schedules/
resources/js/pages/Users/
resources/js/pages/AuditLogs/

routes/donors.php
routes/inventory.php
routes/donations.php
routes/blood-requests.php
routes/schedules.php
routes/users.php
routes/audit-logs.php
```

If a file name differs slightly in the actual repository, inspect the repository first instead of creating a duplicate.

---

# 10. COPY-PASTE PROMPT FOR THE NEXT AI

> Read the attached `Task.md` carefully before changing the project. The main BBMS modules are already implemented. Do not rebuild completed controllers, routes, models, or React pages. Follow Laravel + Inertia.js + React + Tailwind CSS + Spatie RBAC, keep Fat Model / Thin Controller architecture, use the existing database schema only, and use `DB::transaction()` for multi-step database writes.
>
> Start with Section 6 of `Task.md`. First verify whether the Profile module is already complete. Then perform role-based access testing, blood request/dispensing integration testing, donation collection regression testing, donor eligibility and schedule testing, dashboard regression testing, navigation cleanup, validation/error handling checks, and audit-log coverage. Only fix confirmed missing or broken functionality. Do not overwrite completed teammate work.

---

# 11. CURRENT HANDOFF SUMMARY

The BBMS is now feature-complete for the main operational modules.

### Completed

- Authentication
- RBAC
- Dashboard
- Donors
- Inventory
- Donations
- Blood Requests / Dispensing
- Schedules
- Users
- Audit Logs
- Flash notifications
- Admin-only navigation restrictions

### Remaining

Primarily:

- Profile verification/completion if needed
- integration testing
- role/access testing
- regression testing
- navigation cleanup
- validation review
- audit log verification
- final merge preparation

**Do not restart the project from scratch. Continue from the current repository state.**
