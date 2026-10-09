# Blood Bank Management System (`FinalTermLaravel_BBMS`)

**Course:** ITELEC 4100 – Advanced Web Development (Final Term Project)  
**Repository:** `https://github.com/cris-080/laravel-bbms.git`  
**Architecture:** Laravel (MVC Backend) + Inertia.js + React (Component UI) + Tailwind CSS + Laravel Fortify (Headless Auth) + Spatie Laravel-Permission (RBAC)

---

## 🤖 INSTRUCTIONS FOR AI CODING ASSISTANT (READ FIRST)

You are assisting a 3-member development team building and completing a modern **Laravel + Inertia.js + React Blood Bank Management System**.

The main BBMS modules are already implemented. **Do not rebuild completed modules.** Review the repository first and continue only with the remaining verification, cleanup, and integration tasks listed below.

### Strict Architectural & Coding Rules

1. **Follow MVC & Fat Model, Thin Controller**
   - Keep controllers focused on HTTP handling, validation, transactions, calling model logic, and returning Inertia responses or redirects.

2. **Never Invent Database Columns or Tables**
   - Use only the existing migrated schema.

3. **Use Inertia.js Conventions**
   - Pass data from Laravel controllers directly to React via `Inertia::render()`.
   - Use `@inertiajs/react` hooks/components such as `useForm`, `Link`, `Head`, `router`, and `usePage`.

4. **Enforce Spatie RBAC on Backend & Frontend**
   - Backend: use `auth`, `role:admin`, or permission middleware.
   - Frontend: use `auth.roles` / `auth.permissions` to hide restricted navigation and actions.

5. **Use Modular Routing**
   - Keep feature routes inside separate files under `routes/`.
   - Require them from `routes/web.php`.

6. **Use Form Requests Where Appropriate**
   - Do not place large validation blocks in controllers if a reusable Form Request already exists or should exist.

7. **Use `DB::transaction()` for Multi-Step Database Writes**
   - Especially for inventory changes, blood dispensing, donation recording, and audit logging.

8. **Do Not Overwrite Completed Teammate Work**
   - Only fix confirmed bugs or missing functionality.

---

## 1. Local Setup Commands for Teammates Cloning the Repo

After cloning the repository:

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

Use:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bbms_db
DB_USERNAME=root
DB_PASSWORD=
```

Create `bbms_db` in phpMyAdmin and import `bbms_db_clean.sql` if needed.

### 4. Reset Cache

```bash
php artisan optimize:clear
```

### 5. Start Development Servers

```bash
composer run dev
```

### 6. Default Test Credentials

- **Admin:** `admin@bloodbank.com` / `password123`
- **Staff:** `john@gmail.com` / `password123`

---

## 2. Completed Tasks Log

The following features are already built and should **not** be rebuilt.

### Core Foundation

- [x] Laravel project setup
- [x] MySQL database configuration
- [x] Inertia.js + React integration
- [x] Tailwind CSS integration
- [x] Laravel Fortify authentication
- [x] Spatie Laravel-Permission
- [x] Admin and Staff roles
- [x] Global authenticated user / role / permission props
- [x] Core migrations
- [x] Core Eloquent models
- [x] `bbms_db_clean.sql`
- [x] Base authenticated layout

### Dashboard

- [x] Analytical dashboard
- [x] KPI cards
- [x] Blood inventory overview
- [x] Recent blood requests
- [x] Upcoming schedules
- [x] Admin audit trail

### Blood Inventory

- [x] Inventory listing
- [x] Blood group stock tracking
- [x] Integration with donation collection
- [x] Integration with blood request dispensing

### Donations / Blood Collection

- [x] Record donation
- [x] Donation history
- [x] Completed donation increases blood inventory
- [x] Updates donor `last_donation_date`
- [x] Uses `DB::transaction()`
- [x] Audit logging

### Audit Logs

- [x] Audit Log controller
- [x] Audit Log page
- [x] Admin-only backend access
- [x] Admin-only sidebar visibility

---

## 3. Newly Completed Modules

### 3.1 Donor Management — COMPLETED

**Files:**
- `app/Http/Controllers/DonorController.php`
- `app/Http/Requests/DonorRequest.php`
- `app/Models/Donor.php`
- `routes/donors.php`
- `resources/js/pages/Donors/Index.jsx`
- `resources/js/pages/Donors/Create.jsx`
- `resources/js/pages/Donors/Edit.jsx`

**Completed Features:**
- [x] Donor listing
- [x] Add donor
- [x] Edit donor
- [x] Delete donor
- [x] Search donor
- [x] Filter by blood group
- [x] Unique email validation
- [x] Blood group validation
- [x] 56-day donation eligibility rule
- [x] Next eligible donation date
- [x] Audit logging for donor actions

---

### 3.2 Blood Requests / Dispensing — COMPLETED

**Files:**
- `app/Http/Controllers/BloodRequestController.php`
- `app/Http/Requests/BloodRequestFormRequest.php`
- `routes/blood-requests.php`
- `resources/js/pages/BloodRequests/Index.jsx`
- `resources/js/pages/BloodRequests/Create.jsx`

**Completed Features:**
- [x] Create blood request
- [x] Request listing
- [x] Pending status on creation
- [x] Approve and release blood
- [x] Reject blood request
- [x] Validate blood group
- [x] Validate units needed
- [x] Prevent dispensing when stock is insufficient
- [x] Prevent negative inventory
- [x] Deduct inventory during approval
- [x] Row locking / transaction protection
- [x] Set status to `Handed Over`
- [x] Generate `TRX-XXXXXX-BLD` reference code
- [x] Save `released_to`
- [x] Save `dispensed_at`
- [x] Audit logging

---

### 3.3 User & Role Management — COMPLETED

**Files:**
- `app/Http/Controllers/UserController.php`
- `app/Models/User.php`
- `routes/users.php`
- `resources/js/pages/Users/Index.jsx`
- `resources/js/pages/Users/Create.jsx`
- `resources/js/pages/Users/Edit.jsx`

**Completed Features:**
- [x] User listing
- [x] Create user
- [x] Edit user
- [x] Delete user
- [x] Assign `admin`
- [x] Assign `staff`
- [x] Update roles using Spatie `syncRoles()`
- [x] Optional password update
- [x] Prevent current admin from deleting own account
- [x] Audit logging
- [x] Admin-only route protection

---

### 3.4 Donation Schedules — COMPLETED

**Files:**
- `app/Http/Controllers/ScheduleController.php`
- `routes/schedules.php`
- `resources/js/pages/Schedules/Index.jsx`
- `resources/js/pages/Schedules/Create.jsx`

**Completed Features:**
- [x] Schedule listing
- [x] Create appointment
- [x] Link schedule to donor
- [x] Appointment date and time
- [x] Default status `Scheduled`
- [x] Mark as `Completed`
- [x] Mark as `Cancelled`
- [x] Audit logging

**Allowed Status Values:**
- `Scheduled`
- `Completed`
- `Cancelled`

---

### 3.5 Layout / Flash Messages / RBAC Visibility — COMPLETED

**Updated Files:**
- `app/Http/Middleware/HandleInertiaRequests.php`
- `resources/js/Layouts/AuthenticatedLayout.jsx`

**Completed Features:**
- [x] `flash.success`
- [x] `flash.error`
- [x] Success message banner
- [x] Error message banner
- [x] Users sidebar link hidden from staff
- [x] Audit Log sidebar link hidden from staff
- [x] Backend protection remains enforced

---

## 4. Current Main Module Status

| Module | Status |
|---|---|
| Authentication | ✅ Complete |
| Roles & Permissions | ✅ Complete |
| Layout | ✅ Complete |
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

## 5. Remaining Tasks

The main BBMS modules are already implemented. The remaining work is primarily **verification, integration, cleanup, and final testing**.

### Priority Task 1: Verify Profile Module

Check whether the following are already present and working:

- `ProfileController.php`
- `resources/js/pages/Profile/Edit.jsx`
- profile routes

If already complete, **do not rebuild**.

If incomplete, only complete functionality supported by the current user schema:
- update name
- update email
- update password using the existing authentication/profile flow

Do not invent new profile fields.

---

### Priority Task 2: Role-Based Access Testing

Test with both admin and staff accounts.

**Admin should access:**
- Dashboard
- Donors
- Blood Inventory
- Donations
- Blood Requests
- Schedules
- Users
- Audit Logs

**Staff should not access:**
- Users
- Audit Logs

Verify:
- [ ] `/users` is blocked for staff
- [ ] `/audit-logs` is blocked for staff
- [ ] Admin-only links are hidden from staff
- [ ] Direct URL access is protected

---

### Priority Task 3: Blood Request End-to-End Testing

Verify:
- [ ] Create request
- [ ] Request defaults to `Pending`
- [ ] Approve request
- [ ] Stock decreases correctly
- [ ] Status becomes `Handed Over`
- [ ] `reference_code` is generated
- [ ] `released_to` is saved
- [ ] `dispensed_at` is saved
- [ ] Audit log is created
- [ ] Insufficient stock is blocked
- [ ] Negative inventory is impossible
- [ ] Completed request cannot be approved again
- [ ] Completed request cannot be rejected

---

### Priority Task 4: Donation Collection Regression Test

Verify:
- [ ] Completed donation increases inventory
- [ ] Donor `last_donation_date` updates
- [ ] Audit log is created
- [ ] Existing cancellation/deletion stock adjustment still works if implemented

Do not rewrite the Donation module unless a real bug is found.

---

### Priority Task 5: Donor Eligibility & Schedule Testing

Verify:
- [ ] 56-day rule is correct
- [ ] Donor with no previous donation is eligible
- [ ] Recent donor is not eligible
- [ ] Next eligible date is correct
- [ ] Schedule connects to the correct donor
- [ ] Schedule can be completed
- [ ] Schedule can be cancelled
- [ ] Audit logs are created

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

Fix only confirmed issues.

---

### Priority Task 7: UI / Navigation Cleanup

Check for:
- duplicate links
- dead links
- missing routes
- inconsistent labels
- broken buttons
- staff seeing admin-only links
- responsive issues

Special check:
- If `/history` does not have an implemented route/page, either connect it to the existing Donation History page or remove the dead navigation item after confirming team intent.

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

Normal user actions should not result in raw exception pages.

---

### Priority Task 9: Audit Log Coverage

Confirm audit entries exist for:
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

---

### Priority Task 10: Final Integration & Merge Preparation

Before final submission / merge:

```bash
php artisan optimize:clear
php artisan route:list
composer run dev
```

Then:
- [ ] test all major pages
- [ ] test Admin
- [ ] test Staff
- [ ] verify inventory writes
- [ ] verify audit logs
- [ ] verify no dead routes
- [ ] check `git status`
- [ ] do not commit `database/database.sqlite`

---

## 6. Important Business Rules

### Blood Donation

When a donation is `Completed`:

```text
blood_inventory.total_units += units_donated
```

and:

```text
donors.last_donation_date = donation_date
```

Use `DB::transaction()`.

### Blood Dispensing

Before dispensing:

```text
blood_inventory.total_units >= blood_requests.units_needed
```

If valid:

```text
blood_inventory.total_units -= units_needed
status = Handed Over
reference_code = TRX-XXXXXX-BLD
released_to = recipient
dispensed_at = current datetime
```

If invalid:
- do not dispense
- do not allow negative inventory

### Donor Eligibility

```text
Minimum 56 days since last_donation_date
```

### Schedule Status Values

```text
Scheduled
Completed
Cancelled
```

### Roles

```text
admin
staff
```

---

## 7. Expected Modular Routes

The project should include:

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

Do not place all module routes directly inside `routes/web.php`.

---

## 8. Files That Should Not Be Rebuilt Without a Confirmed Bug

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

Inspect the repository first if a file name differs.

---

## 9. Updated Handoff Summary

### Completed

- Authentication
- RBAC
- Layout
- Dashboard
- Donors
- Inventory
- Donations
- Blood Requests / Dispensing
- Schedules
- Users
- Audit Logs
- Flash Notifications
- Admin-only navigation restrictions

### Remaining

- Profile verification/completion if needed
- Integration testing
- Role/access testing
- Regression testing
- Navigation cleanup
- Validation review
- Audit log verification
- Final merge/submission preparation

---

## 10. Copy-Paste Prompt for Teammate to Give Their AI

> **"Read the attached `Task.md` carefully. The main BBMS modules are already implemented. Do not rebuild completed controllers, routes, models, or React pages. Follow the existing Laravel + Inertia.js + React + Tailwind CSS + Spatie RBAC architecture, use the existing database schema only, preserve Fat Model / Thin Controller structure, and use `DB::transaction()` for multi-step database writes. Start with Section 5: verify the Profile module, then perform role-based access testing, blood request/dispensing integration testing, donation regression testing, donor eligibility and schedule testing, dashboard regression testing, navigation cleanup, validation/error handling checks, audit-log coverage, and final integration checks. Only fix confirmed missing or broken functionality."**
