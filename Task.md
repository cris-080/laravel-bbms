# Blood Bank Management System (`FinalTermLaravel_BBMS`)

**Course:** ITELEC 4100 – Advanced Web Development (Final Term Project)  
**Repository:** `https://github.com/cris-080/laravel-bbms.git`  
**Architecture:** Laravel (MVC Backend) + Inertia.js + React (Component UI) + Tailwind CSS + Laravel Fortify (Headless Auth) + Spatie Laravel-Permission (RBAC)

---

## 🤖 INSTRUCTIONS FOR AI CODING ASSISTANT (READ FIRST)

You are assisting a 3-member development team continuing the Blood Bank Management System.

The main operational modules are already implemented. **Do not rebuild completed work.** Review the current repository first, preserve existing code, and only continue with the remaining tasks listed below.

### Strict Architectural & Coding Rules

1. **Follow MVC & Fat Model, Thin Controller**
   - Controllers should handle HTTP concerns, validation, transactions, model calls, Inertia responses, and redirects.
   - Keep reusable business logic in models/services rather than duplicating it in controllers.

2. **Never Invent Database Columns or Tables**
   - Use only the current BBMS schema.
   - Do not add fields unless the team explicitly approves a schema change.

3. **Use Inertia.js Conventions**
   - Pass Laravel data directly to React using `Inertia::render()`.
   - Use `useForm`, `Link`, `Head`, `router`, and `usePage` from `@inertiajs/react`.

4. **Enforce Spatie RBAC on Backend and Frontend**
   - Backend: `auth`, `role:admin`, or permissions middleware.
   - Frontend: read `auth.roles` / `auth.permissions` and hide restricted links/buttons.

5. **Use Modular Routing**
   - Keep feature routes in separate files under `routes/`.
   - Require them from `routes/web.php`.

6. **Use Form Requests Where Appropriate**
   - Do not place large reusable validation rules directly inside controllers if a Form Request fits the feature.

7. **Use `DB::transaction()` for Multi-Step Writes**
   - Especially for blood inventory changes, blood dispensing, donation recording, and audit logs.

8. **Do Not Overwrite Completed Teammate Work**
   - Only fix confirmed bugs or missing functionality.

9. **Do Not Commit Local Database Files**
   - The project uses MySQL (`bbms_db`).
   - Do not commit `database/database.sqlite`.

---

## 1. Local Setup Commands for Teammates Cloning the Repo

After cloning the repository, run these steps.

### 1. Clone the Repository

```bash
git clone https://github.com/cris-080/laravel-bbms.git
cd laravel-bbms
```

### 2. Install Dependencies

```bash
composer install
npm install
copy .env.example .env
php artisan key:generate
```

### 3. Configure MySQL

Set:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bbms_db
DB_USERNAME=root
DB_PASSWORD=
```

Create `bbms_db` in phpMyAdmin and import `bbms_db_clean.sql` if needed.

### 4. Reset Laravel Cache

```bash
php artisan optimize:clear
```

### 5. Start the App

```bash
composer run dev
```

### 6. Default Test Credentials

- **Admin Account:** `admin@bloodbank.com` / `password123`
- **Staff Account:** `john@gmail.com` / `password123`

---

## 2. Exact Core Schema / Business Constraints

### 2.1 `donors`

Fields used by the current project:

- `id`
- `name`
- `email`
- `age`
- `sex`
- `blood_group`
- `contact_number`
- `address`
- `last_donation_date`
- timestamps

Allowed blood groups:

- `A+`
- `A-`
- `B+`
- `B-`
- `AB+`
- `AB-`
- `O+`
- `O-`

### 2.2 `blood_inventory`

- `id`
- `blood_group`
- `total_units`
- `last_updated`
- timestamps

Model must use:

```php
protected $table = 'blood_inventory';
```

### 2.3 `donations`

- `id`
- `donor_id`
- `donation_date`
- `units_donated`
- `status`
- timestamps

### 2.4 `donation_schedules`

- `id`
- `donor_id`
- `appointment_date`
- `appointment_time`
- `status`
- timestamps

Allowed statuses:

- `Scheduled`
- `Completed`
- `Cancelled`

### 2.5 `blood_requests`

- `id`
- `physician_name`
- `patient_name`
- `blood_group`
- `units_needed`
- `status`
- `request_date`
- `reference_code`
- `released_to`
- `dispensed_at`
- timestamps

Status values in current use:

- `Pending`
- `Approved`
- `Handed Over`
- `Rejected`

### 2.6 `audit_logs`

- `id`
- `user_id`
- `action`
- `details`
- timestamps

---

## 3. Completed Tasks Log

The following features are already completed and should **not** be rebuilt unless a confirmed bug is found.

### Core Foundation

- [x] Base Laravel project
- [x] MySQL setup
- [x] Inertia.js + React
- [x] Tailwind CSS
- [x] Laravel Fortify
- [x] Spatie Laravel-Permission
- [x] Admin and Staff roles
- [x] Core migrations
- [x] Core Eloquent models
- [x] `bbms_db_clean.sql`
- [x] Global authenticated user / roles / permissions
- [x] Base authenticated layout

### Dashboard

- [x] `DashboardController.php`
- [x] `Dashboard.jsx`
- [x] KPI cards
- [x] Blood inventory analytics
- [x] Recent blood requests
- [x] Upcoming schedules
- [x] Admin audit trail

### Blood Inventory

- [x] `BloodInventoryController.php`
- [x] `Inventory/Index.jsx`
- [x] Blood group stock tracking

### Donations / Blood Collection

- [x] `DonationController.php`
- [x] `Donations/Create.jsx`
- [x] `Donations/Index.jsx`
- [x] Completed donation increases blood inventory
- [x] Updates donor `last_donation_date`
- [x] Uses database transactions
- [x] Audit logging

### Audit Logs

- [x] `AuditLogController.php`
- [x] `AuditLogs/Index.jsx`
- [x] Admin-only access

---

## 4. Newly Completed Tasks

### Priority Task 1: Donor Management — COMPLETED

**Files:**

- `app/Http/Controllers/DonorController.php`
- `app/Http/Requests/DonorRequest.php`
- `app/Models/Donor.php`
- `routes/donors.php`
- `resources/js/pages/Donors/Index.jsx`
- `resources/js/pages/Donors/Create.jsx`
- `resources/js/pages/Donors/Edit.jsx`

**Completed Features:**

- [x] Donor CRUD
- [x] Search donors
- [x] Filter by blood group
- [x] Unique email validation
- [x] Blood group validation
- [x] Audit logging
- [x] Modular donor routes

**Eligibility Logic:**

- Donor with no previous donation date = eligible.
- Donor must wait **56 days** after `last_donation_date`.
- Next eligible donation date is calculated in the `Donor` model.

---

### Priority Task 2: Blood Requests / Dispensing — COMPLETED

**Files:**

- `app/Http/Controllers/BloodRequestController.php`
- `app/Http/Requests/BloodRequestFormRequest.php`
- `routes/blood-requests.php`
- `resources/js/pages/BloodRequests/Index.jsx`
- `resources/js/pages/BloodRequests/Create.jsx`

**Completed Features:**

- [x] Create blood request
- [x] List blood requests
- [x] Default request status = `Pending`
- [x] Approve/release blood
- [x] Reject blood request
- [x] Check current inventory
- [x] Prevent negative stock
- [x] Use `DB::transaction()`
- [x] Use row locking during dispensing
- [x] Deduct `blood_inventory.total_units`
- [x] Set status to `Handed Over`
- [x] Generate `TRX-XXXXXX-BLD`
- [x] Save `released_to`
- [x] Save `dispensed_at`
- [x] Audit logging

---

### Priority Task 3: User & Role Management — COMPLETED

**Files:**

- `app/Http/Controllers/UserController.php`
- `app/Models/User.php`
- `routes/users.php`
- `resources/js/pages/Users/Index.jsx`
- `resources/js/pages/Users/Create.jsx`
- `resources/js/pages/Users/Edit.jsx`

**Completed Features:**

- [x] User CRUD
- [x] Assign `admin`
- [x] Assign `staff`
- [x] Update roles with `syncRoles()`
- [x] Optional password update
- [x] Prevent logged-in user from deleting own account
- [x] Audit logging
- [x] Admin-only backend route protection

---

### Priority Task 4: Donation Schedules — COMPLETED

**Files:**

- `app/Http/Controllers/ScheduleController.php`
- `routes/schedules.php`
- `resources/js/pages/Schedules/Index.jsx`
- `resources/js/pages/Schedules/Create.jsx`

**Completed Features:**

- [x] Schedule listing
- [x] Create appointment
- [x] Link appointment to donor
- [x] Set appointment date/time
- [x] Default status = `Scheduled`
- [x] Mark as `Completed`
- [x] Mark as `Cancelled`
- [x] Audit logging

---

### Priority Task 5: Layout / Flash / Admin Visibility — COMPLETED

**Updated Files:**

- `app/Http/Middleware/HandleInertiaRequests.php`
- `resources/js/Layouts/AuthenticatedLayout.jsx`

**Completed Features:**

- [x] `flash.success`
- [x] `flash.error`
- [x] Success banner
- [x] Error banner
- [x] Admin-only Users sidebar item
- [x] Admin-only Audit Log sidebar item
- [x] Backend route protection retained

---

## 5. Current Module Status

| Module | Status |
|---|---|
| Authentication | ✅ Complete |
| Roles & Permissions | ✅ Complete |
| Authenticated Layout | ✅ Complete |
| Dashboard | ✅ Complete |
| Donor Management | ✅ Complete |
| Blood Inventory | ✅ Complete |
| Donations / Collection | ✅ Complete |
| Blood Requests / Dispensing | ✅ Complete |
| Donation Schedules | ✅ Complete |
| User & Role Management | ✅ Complete |
| Audit Logs | ✅ Complete |
| Flash Notifications | ✅ Complete |

---

## 6. Remaining Tasks — Start Here

The core BBMS feature set is now implemented.

The remaining work should focus on **verification, integration, cleanup, regression testing, and final handoff**.

### Priority Task 1: Verify Profile Module

Check whether these already exist and work:

- `ProfileController.php`
- `resources/js/pages/Profile/Edit.jsx`
- profile routes

If already complete, **do not rebuild**.

If missing/incomplete, only implement functionality supported by the current `users` table:

- Update name
- Update email
- Update password through the existing authentication/profile flow

Do not invent profile columns.

---

### Priority Task 2: Role-Based Access Testing

Test both roles.

#### Admin should access:

- Dashboard
- Donors
- Blood Inventory
- Donations
- Blood Requests
- Schedules
- Users
- Audit Logs

#### Staff should not access:

- Users
- Audit Logs

Checklist:

- [ ] `/users` blocked for staff
- [ ] `/audit-logs` blocked for staff
- [ ] Users sidebar item hidden for staff
- [ ] Audit Log sidebar item hidden for staff
- [ ] Admin sees both links
- [ ] Direct URL access is protected

---

### Priority Task 3: Blood Request End-to-End Testing

Test:

1. Create blood request.
2. Confirm it starts as `Pending`.
3. Confirm current stock.
4. Approve request.
5. Enter `released_to`.
6. Confirm stock decreases.
7. Confirm status becomes `Handed Over`.
8. Confirm `reference_code`.
9. Confirm `dispensed_at`.
10. Confirm audit log.

Also test:

- [ ] Request more units than available
- [ ] Attempt to approve a completed request
- [ ] Reject a pending request
- [ ] Attempt to reject a completed request
- [ ] Confirm negative inventory is impossible

---

### Priority Task 4: Donation Collection Regression Testing

Verify the existing Donation module still works:

- [ ] Record donation
- [ ] Completed donation increases matching inventory
- [ ] Donor `last_donation_date` updates
- [ ] Audit log is created
- [ ] Existing cancellation/deletion adjustment still works if implemented

Do not rewrite Donation code unless a confirmed bug exists.

---

### Priority Task 5: Donor Eligibility + Schedule Integration Testing

Verify:

- [ ] 56-day eligibility rule
- [ ] No previous donation = eligible
- [ ] Recent donor = not eligible
- [ ] Next eligible date is correct
- [ ] Schedule links to correct donor
- [ ] Schedule can become `Completed`
- [ ] Schedule can become `Cancelled`
- [ ] Schedule audit logs are created

Do not add a `No Show` status unless the team explicitly changes the schema.

---

### Priority Task 6: Dashboard Regression Check

Do not rebuild Dashboard.

Verify:

- Total Donors
- Total Blood Units
- Pending Requests
- Upcoming Schedules
- Completed Donations
- Blood Inventory
- Recent Requests
- Upcoming Schedules
- Admin Audit Trail

Only fix confirmed bugs.

---

### Priority Task 7: UI / Navigation Cleanup

Review for:

- duplicate menu items
- dead links
- missing routes
- inconsistent labels
- buttons leading to missing pages
- admin links visible to staff
- responsive layout issues

Special check:

If `/history` is still in the sidebar but has no working route/page, either:
- connect it to the existing donation history page, or
- remove/hide the dead link after confirming team intent.

Do not invent a new History module if `Donations/Index.jsx` already serves that purpose.

---

### Priority Task 8: Validation & Error Handling Review

Verify validation messages for:

- Donor forms
- Blood Request form
- Schedule form
- User form
- Donation form

Verify global:

- `flash.success`
- `flash.error`

Normal user actions should not display raw exception pages.

---

### Priority Task 9: Audit Log Coverage

Verify audit entries for:

- Donor created
- Donor updated
- Donor deleted
- Donation recorded
- Blood request created
- Blood dispensed
- Blood request rejected
- Schedule created
- Schedule status updated
- User created
- User updated
- User deleted

Do not create duplicate audit records.

---

### Priority Task 10: Final Integration & Submission Check

Before final submission:

```bash
php artisan optimize:clear
php artisan route:list
composer run dev
```

Then verify:

- [ ] All main pages open
- [ ] Admin account works
- [ ] Staff account works
- [ ] RBAC works
- [ ] Inventory updates correctly
- [ ] Audit logs work
- [ ] No dead routes
- [ ] No raw errors
- [ ] `git status` is clean
- [ ] `database/database.sqlite` is not committed

---

## 7. Remaining Task Division for the 3-Member Team

At this point, the main feature modules are already implemented.

The next teammate should **not take ownership of a completed vertical module again**. Remaining work should be divided as verification/integration work.

| Member / Next Owner | Assigned Remaining Work | Main Files / Areas to Review | Expected Result |
|---|---|---|---|
| **Next Member / QA Integration** | **Profile Verification, RBAC Testing, Regression Testing, Navigation Cleanup, Final Integration** | `ProfileController.php`, `Profile/Edit.jsx`, routes, `AuthenticatedLayout.jsx`, existing Controllers/Pages | Confirm all modules work together without rebuilding completed code |
| **Existing Member 2 Work** | **Inventory & Donation Regression Check** | `BloodInventoryController.php`, `DonationController.php`, `Inventory/`, `Donations/` | Confirm stock increment/update logic still works |
| **Existing Member 3 Work** | **Blood Requests, Schedules, Audit Logs, Dashboard Regression Check** | `BloodRequestController.php`, `ScheduleController.php`, `AuditLogController.php`, `DashboardController.php` | Confirm dispensing, schedules, audit trail, and dashboard remain correct |

---

## 8. Important Business Logic & Permissions

### Donation Collection

Completed donation:

```text
blood_inventory.total_units += units_donated
```

and:

```text
donors.last_donation_date = donation_date
```

Use a DB transaction.

### Blood Dispensing

Before release:

```text
blood_inventory.total_units >= units_needed
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
DO NOT DISPENSE
DO NOT ALLOW NEGATIVE STOCK
```

Use a DB transaction.

### Donor Eligibility

```text
56 days since last_donation_date
```

### Schedule Status

Allowed only:

```text
Scheduled
Completed
Cancelled
```

### User Roles

Allowed:

```text
admin
staff
```

---

## 9. Expected Modular Routes

Expected routes:

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

Expected route files:

```text
routes/donors.php
routes/inventory.php
routes/donations.php
routes/blood-requests.php
routes/schedules.php
routes/users.php
routes/audit-logs.php
```

Do not move all module routes directly into `routes/web.php`.

---

## 10. Files That Should Not Be Rebuilt Without a Confirmed Bug

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

If the actual repository uses a slightly different file name, inspect the existing project before creating a duplicate.

---

## 11. Current Handoff Summary

### Completed

- [x] Authentication
- [x] RBAC
- [x] Layout
- [x] Dashboard
- [x] Donors
- [x] Inventory
- [x] Donations
- [x] Blood Requests / Dispensing
- [x] Schedules
- [x] Users
- [x] Audit Logs
- [x] Flash Notifications
- [x] Admin-only navigation restrictions

### Remaining

- [ ] Profile verification/completion if needed
- [ ] Role-based access testing
- [ ] Blood request integration testing
- [ ] Donation regression testing
- [ ] Donor eligibility/schedule testing
- [ ] Dashboard regression testing
- [ ] UI/navigation cleanup
- [ ] Validation review
- [ ] Audit log coverage verification
- [ ] Final integration/submission check

---

## 12. Copy-Paste Prompt for Teammate to Give Their AI

> **"Read the attached `Task.md` carefully. The main BBMS modules are already implemented. Do not rebuild completed controllers, models, routes, or React pages. Follow the existing Laravel + Inertia.js + React + Tailwind CSS + Spatie RBAC architecture, preserve Fat Model / Thin Controller structure, use the current database schema only, and use `DB::transaction()` for multi-step database writes. Start with Section 6: verify the Profile module, then perform role-based access testing, blood request integration testing, donation regression testing, donor eligibility and schedule testing, dashboard regression testing, navigation cleanup, validation/error handling review, audit-log coverage, and final integration checks. Only fix confirmed missing or broken functionality."**
