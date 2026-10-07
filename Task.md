# Blood Bank Management System (`FinalTermLaravel_BBMS`)
**Course:** ITELEC 4100 – Advanced Web Development (Final Term Project)[cite: 3, 4]  
**Repository:** `https://github.com/cris-080/laravel-bbms.git`  
**Architecture:** Laravel (MVC Backend) + Inertia.js + React (Component UI) + Tailwind CSS + Laravel Fortify (Headless Auth) + Spatie Laravel-Permission (RBAC)[cite: 3, 4]

---

## 🤖 INSTRUCTIONS FOR AI CODING ASSISTANT (READ FIRST)
You are assisting a 3-member development team migrating a legacy native PHP MVC Blood Bank Management System into a modern **Laravel + Inertia.js + React** application[cite: 3, 4].  
IGNORE the word "cite".

### Strict Architectural & Coding Rules
1. **Follow MVC & Fat Model, Thin Controller:** Keep controllers strictly focused on HTTP request validation (`$request->validate()`), calling model/transaction logic, and returning `Inertia::render('PageName', $data)` or redirects[cite: 3, 4].
2. **Never Invent Database Columns or Tables:** Base all migrations, `$fillable` arrays, Eloquent queries, and React props strictly on the **Database Schema Specification** documented in Section 3 below[cite: 3, 4].
3. **Table Name Conventions:**
   - `BloodInventory` model must explicitly set `protected $table = 'blood_inventory';`[cite: 2, 3, 4].
   - `DonationSchedule` model must explicitly set `protected $table = 'donation_schedules';`[cite: 2, 3, 4].
4. **Use Inertia.js Conventions (No Separate REST API Needed for Views):** Pass data from Laravel controllers directly as props via `Inertia::render()`[cite: 3, 4]. Use `@inertiajs/react`'s `useForm`, `Link`, `Head`, `router`, and `usePage` hooks in React components[cite: 3, 4].
5. **Enforce Spatie RBAC Both Backend & Frontend:**
   - **Backend:** Protect routes using `auth`, `role:admin`, or `permission:...` middlewares[cite: 3, 4].
   - **Frontend:** Read `const { auth } = usePage().props;` (`auth.user`, `auth.roles`, `auth.permissions`) and conditionally render restricted UI links/buttons (e.g., `{auth.roles.includes('admin') && (...)}`)[cite: 3, 4].
6. **Modular Routing:** Do not dump all routes into `routes/web.php`[cite: 3, 4]. Place each feature module's routes in its own file inside `routes/` (e.g., `routes/donors.php`, `routes/inventory.php`) and require them inside `routes/web.php`[cite: 3, 4].
7. **File Resolution Case-Sensitivity:** React pages live inside `resources/js/pages/` (lowercase `pages` folder) because `resources/js/app.jsx` resolves `./pages/${name}.jsx`[cite: 3, 4].

---

## 1. Local Setup Commands for Teammates Cloning the Repo
After cloning the repository, run these steps to get the project running locally[cite: 3, 4]:

1. **Clone the Repository:**
   ~~~bash
   git clone https://github.com/cris-080/laravel-bbms.git
   cd laravel-bbms
   ~~~

2. **Configure `.env` & Install Dependencies:**
   Copy `.env.example` to `.env` and set `DB_DATABASE=bbms_db` (create `bbms_db` in XAMPP phpMyAdmin)[cite: 1, 3, 4]:
   ~~~bash
   composer install
   npm install
   copy .env.example .env
   php artisan key:generate
   ~~~

3. **Import Database & Reset Cache:**
   - Open phpMyAdmin (`http://localhost/phpmyadmin`), select `bbms_db`, and import **`bbms_db_clean.sql`** from the project root (contains all 18 tables, roles, permissions, users, donors, inventory, donations, schedules, requests, and audit logs)[cite: 1, 2, 3, 4].
   - Or if running fresh migrations and seeding roles/permissions[cite: 3, 4]:
   ~~~bash
   php artisan migrate
   php artisan db:seed --class=RolePermissionSeeder
   php artisan permission:cache-reset
   php artisan optimize:clear
   ~~~

4. **Start the Concurrent Development Servers (Laravel + Queue + Vite):**[cite: 3, 4]
   ~~~bash
   composer run dev
   ~~~

5. **Default Test Credentials (seeded in `RolePermissionSeeder.php` & `bbms_db_clean.sql`):**[cite: 2, 3, 4]
   - **Admin Account:** `admin@bloodbank.com` / `password123` (Role: `admin` — full access)[cite: 2, 3, 4]
   - **Staff Account:** `john@gmail.com` / `password123` (Role: `staff` — operational access)[cite: 2, 3, 4]

---

## 2. Completed Tasks Log (Done by Member 1)
Do **NOT** redo or overwrite the following completed setup tasks[cite: 3, 4]:
- [x] **Base Project Initialization:** Laravel installed with MySQL (`bbms_db`) configured in `.env`[cite: 1, 3, 4].
- [x] **Windows Dev Script Fix (`composer.json`):** Removed `php artisan pail` from `"dev"` script in `composer.json` because Windows PHP lacks the `pcntl` extension[cite: 3, 4]. `composer run dev` runs cleanly[cite: 3, 4].
- [x] **Vite 8 & React Integration:** Installed `react`, `react-dom`, `@inertiajs/react`, `vite@^8.0.0`, `@vitejs/plugin-react@^6.1.1`, and `@tailwindcss/vite@^4.2.2`[cite: 3, 4]. Configured `vite.config.js`, `resources/js/app.jsx`, and root `resources/views/app.blade.php`[cite: 3, 4].
- [x] **Inertia Middleware (`app/Http/Middleware/HandleInertiaRequests.php`):** Registered in `bootstrap/app.php` and configured `share()` to pass `auth.user`, `auth.roles`, and `auth.permissions` globally to all React pages[cite: 3, 4].
- [x] **Laravel Fortify Headless Auth:** Installed `laravel/fortify`, ran `fortify:install`, set `'home' => '/dashboard'` in `config/fortify.php`, and bound `Login`, `Register`, `ForgotPassword`, and `ResetPassword` Inertia views inside `app/Providers/FortifyServiceProvider.php`[cite: 3, 4].
- [x] **Login UI (`resources/js/pages/Auth/Login.jsx`):** Built and verified login form using Inertia's `useForm` hook[cite: 3, 4].
- [x] **Spatie Roles & Permissions (`spatie/laravel-permission`):** Published migrations, added `HasRoles` trait to `app/Models/User.php`, and registered `role`, `permission`, and `role_or_permission` middleware aliases in `bootstrap/app.php`[cite: 1, 3, 4].
- [x] **Role & Permission Seeder (`database/seeders/RolePermissionSeeder.php`):** Seeded `admin` and `staff` roles, 21 granular Blood Bank permissions, and default Admin/Staff accounts using `updateOrCreate` and `syncRoles`[cite: 3, 4].
- [x] **Clean Merged SQL Dump (`bbms_db_clean.sql`):** Merged all 18 tables (`users`, `roles`, `permissions`, `donors`, `blood_inventory`, `donations`, `donation_schedules`, `blood_requests`, `audit_logs`, etc.) with valid `bcrypt('password123')` hashes[cite: 1, 2].
- [x] **Initial Dashboard Verification (`resources/js/pages/Dashboard.jsx`):** Verified login redirect to `/dashboard`, logout via `router.post('/logout')`, and role-based button hiding[cite: 3, 4].

---

## 3. Exact Database Schema Specification (From Legacy `blood_bank_db.sql` & `bbms_db_clean.sql`)
All migrations, Eloquent models, controllers, and React views must strictly follow these table structures from our system[cite: 1, 2, 3, 4]:

### 3.1 `users` (Already migrated via Laravel + Spatie `HasRoles`)[cite: 1, 3, 4]
- `id`, `name`, `email`, `password`, `timestamps` (Roles `'admin'` and `'staff'` are managed via Spatie's `model_has_roles` table instead of the legacy `role` enum column)[cite: 1, 2, 3, 4].

### 3.2 `donors` (`App\Models\Donor`)[cite: 2, 3, 4]
- `id` (Primary Key)[cite: 2, 3, 4]
- `name` (`string`, 100)[cite: 2, 3, 4]
- `email` (`string`, 100, unique, nullable)[cite: 2, 3, 4]
- `age` (`integer`, nullable)[cite: 2, 3, 4]
- `sex` (`string`, 10, nullable — e.g., `'Male'`, `'Female'`)[cite: 2, 3, 4]
- `blood_group` (`enum`: `'A+'`, `'A-'`, `'B+'`, `'B-'`, `'AB+'`, `'AB-'`, `'O+'`, `'O-'`)[cite: 2, 3, 4]
- `contact_number` (`string`, 15)[cite: 2, 3, 4]
- `address` (`text`, nullable)[cite: 2, 3, 4]
- `last_donation_date` (`date`, nullable)[cite: 2, 3, 4]
- `timestamps()`[cite: 3, 4]
- **Relationships:** `hasMany(Donation::class)`, `hasMany(DonationSchedule::class)`[cite: 3, 4]

### 3.3 `blood_inventory` (`App\Models\BloodInventory`)[cite: 2, 3, 4]
- `id` (Primary Key)[cite: 2, 3, 4]
- `blood_group` (`enum`: `'A+'`, `'A-'`, `'B+'`, `'B-'`, `'AB+'`, `'AB-'`, `'O+'`, `'O-'`, unique)[cite: 2, 3, 4]
- `total_units` (`integer`, default `0`)[cite: 2, 3, 4]
- `last_updated` (`timestamp`, default current_timestamp on update current_timestamp) & `timestamps()`[cite: 2, 3, 4]

### 3.4 `donations` (`App\Models\Donation`)[cite: 2, 3, 4]
- `id` (Primary Key)[cite: 2, 3, 4]
- `donor_id` (`foreignId` constrained to `donors` with `cascadeOnDelete()`)[cite: 2, 3, 4]
- `donation_date` (`date`)[cite: 2, 3, 4]
- `units_donated` (`integer`, default `0`)[cite: 2, 3, 4]
- `status` (`enum`: `'Pending'`, `'Completed'`, `'Cancelled'`, default `'Completed'`)[cite: 2, 3, 4]
- `timestamps()`[cite: 3, 4]
- **Relationships:** `belongsTo(Donor::class)`[cite: 3, 4]

### 3.5 `donation_schedules` (`App\Models\DonationSchedule`)[cite: 2, 3, 4]
- `id` (Primary Key)[cite: 2, 3, 4]
- `donor_id` (`foreignId` constrained to `donors` with `cascadeOnDelete()`)[cite: 2, 3, 4]
- `appointment_date` (`date`)[cite: 2, 3, 4]
- `appointment_time` (`time`)[cite: 2, 3, 4]
- `status` (`enum`: `'Scheduled'`, `'Completed'`, `'Cancelled'`, default `'Scheduled'`)[cite: 2, 3, 4]
- `timestamps()`[cite: 2, 3, 4]
- **Relationships:** `belongsTo(Donor::class)`[cite: 3, 4]

### 3.6 `blood_requests` (`App\Models\BloodRequest`)[cite: 2, 3, 4]
- `id` (Primary Key)[cite: 2, 3, 4]
- `physician_name` (`string`, 255)[cite: 2, 3, 4]
- `patient_name` (`string`, 100)[cite: 2, 3, 4]
- `blood_group` (`enum`: `'A+'`, `'A-'`, `'B+'`, `'B-'`, `'AB+'`, `'AB-'`, `'O+'`, `'O-'`)[cite: 2, 3, 4]
- `units_needed` (`integer`)[cite: 2, 3, 4]
- `status` (`string`, 50, default `'Pending'` — values used: `'Pending'`, `'Approved'`, `'Handed Over'`, `'Rejected'`)[cite: 2, 3, 4]
- `request_date` (`timestamp`, useCurrent)[cite: 2, 3, 4]
- `reference_code` (`string`, 50, nullable — e.g., `'TRX-170740-BLD'`)[cite: 2, 3, 4]
- `released_to` (`string`, 100, nullable)[cite: 2, 3, 4]
- `dispensed_at` (`dateTime`, nullable)[cite: 2, 3, 4]
- `timestamps()`[cite: 3, 4]

### 3.7 `audit_logs` (`App\Models\AuditLog`)[cite: 2, 3, 4]
- `id` (Primary Key)[cite: 2, 3, 4]
- `user_id` (`foreignId` constrained to `users` with `cascadeOnDelete()`)[cite: 3, 4]
- `action` (`string`, 255 — e.g., `'Added New Donor'`, `'Logged Donation'`, `'Dispensed Blood'`, `'Booked Appointment'`)[cite: 2, 3, 4]
- `details` (`text`, nullable)[cite: 2, 3, 4]
- `timestamps()`[cite: 2, 3, 4]
- **Relationships:** `belongsTo(User::class)`[cite: 3, 4]

---

## 4. IMMEDIATE NEXT TASKS (Start Here!)

When a teammate uploads this `Task.md` to an AI assistant, execute **Priority Tasks 1, 2, and 3** first before building individual CRUD pages[cite: 3, 4]:

### Priority Task 1: Create the 6 Core Migrations, Eloquent Models & Initial Data Seeder
1. Create migrations and models (`php artisan make:model ModelName -m`) for[cite: 3, 4]:
   - `Donor` (`donors`)[cite: 2, 3, 4]
   - `BloodInventory` (`blood_inventory` — set `protected $table = 'blood_inventory';`)[cite: 2, 3, 4]
   - `Donation` (`donations`)[cite: 2, 3, 4]
   - `DonationSchedule` (`donation_schedules` — set `protected $table = 'donation_schedules';`)[cite: 2, 3, 4]
   - `BloodRequest` (`blood_requests`)[cite: 2, 3, 4]
   - `AuditLog` (`audit_logs`)[cite: 2, 3, 4]
2. Define `$fillable` arrays and explicit Eloquent relationships (`hasMany`, `belongsTo`) on every model[cite: 3, 4].
3. Create a `BloodBankSeeder.php` (and call it in `DatabaseSeeder.php`) that seeds:
   - The 8 blood groups in `blood_inventory` (`A+`: 16, `A-`: 0, `B+`: 1, `B-`: 3, `AB+`: 7, `AB-`: 3, `O+`: 4, `O-`: 1)[cite: 2, 3, 4].
   - Sample donors, donations, schedules, blood requests, and audit logs from Section 3 (`blood_bank_db.sql`) so the Analytical Dashboard has realistic data immediately[cite: 2, 3, 4].

### Priority Task 2: Build the Reusable System Layout (`resources/js/Layouts/AuthenticatedLayout.jsx`)
Replace the legacy `admin_header.php`, `admin_sidebar.php`, and `footer.php` files with a modern React layout component (`resources/js/Layouts/AuthenticatedLayout.jsx`)[cite: 3, 4]:
1. **Left Sidebar Navigation:**[cite: 3, 4]
   - Brand header: **Blood Bank Management System** with blood drop icon/badge[cite: 3, 4].
   - Navigation Links using Inertia `<Link>` with active route highlighting (`usePage().url`)[cite: 3, 4]:
     - **Dashboard** (`/dashboard`) — visible to `admin` & `staff`[cite: 3, 4]
     - **Blood Inventory** (`/inventory`) — visible to `admin` & `staff`[cite: 3, 4]
     - **Manage Donors** (`/donors`) — visible to `admin` & `staff`[cite: 3, 4]
     - **Blood Collection / Donations** (`/donations`) — visible to `admin` & `staff`[cite: 3, 4]
     - **Donation Schedules** (`/schedules`) — visible to `admin` & `staff`[cite: 3, 4]
     - **Blood Requests** (`/blood-requests`) — visible to `admin` & `staff`[cite: 3, 4]
     - **Manage Users / Staff** (`/users`) — strictly gated with `{auth.roles.includes('admin') && (...)}`[cite: 3, 4]
     - **Audit Logs** (`/audit-logs`) — strictly gated with `{auth.roles.includes('admin') && (...)}`[cite: 3, 4]
2. **Top Navbar (Header):**[cite: 3, 4]
   - Displays current page title prop (`title`)[cite: 3, 4].
   - Displays authenticated user's name (`auth.user.name`) and role badge (`auth.roles[0]`)[cite: 3, 4].
   - Profile link (`/profile`) and Logout button (`router.post('/logout')`)[cite: 3, 4].
   - Flash message banner for `flash.success` / `flash.error` (add `'flash' => ['success' => fn () => $request->session()->get('success')]` in `HandleInertiaRequests.php`)[cite: 3, 4].
3. **Responsive Content Area:**[cite: 3, 4]
   - Renders `{children}` inside a clean, scrollable container with a footer[cite: 3, 4].

### Priority Task 3: Build the Admin Analytical Dashboard (`DashboardController.php` + `resources/js/pages/Dashboard.jsx`)
Upgrade `/dashboard` from a static placeholder into a full analytical dashboard wrapped in `AuthenticatedLayout`[cite: 3, 4]:
1. **Backend (`app/Http/Controllers/DashboardController.php`):**[cite: 3, 4]
   - Update `routes/web.php` so `GET /dashboard` points to `[DashboardController::class, 'index']`[cite: 3, 4].
   - Query and pass the following props via `Inertia::render('Dashboard', [...])`[cite: 3, 4]:
     - `stats`:
       - `totalDonors`: `Donor::count()`[cite: 3, 4]
       - `totalUnitsAvailable`: `BloodInventory::sum('total_units')`[cite: 3, 4]
       - `pendingRequestsCount`: `BloodRequest::where('status', 'Pending')->count()`[cite: 3, 4]
       - `scheduledAppointmentsCount`: `DonationSchedule::where('status', 'Scheduled')->count()`[cite: 3, 4]
       - `completedDonationsCount`: `Donation::where('status', 'Completed')->count()`[cite: 3, 4]
     - `bloodInventory`: `BloodInventory::orderBy('id')->get()` (All 8 blood types with `total_units` and `last_updated`)[cite: 2, 3, 4].
     - `recentRequests`: `BloodRequest::latest('request_date')->take(5)->get()`[cite: 2, 3, 4].
     - `upcomingSchedules`: `DonationSchedule::with('donor')->where('status', 'Scheduled')->orderBy('appointment_date')->orderBy('appointment_time')->take(5)->get()`[cite: 2, 3, 4].
     - `recentAuditLogs`: `$request->user()->hasRole('admin') ? AuditLog::with('user')->latest()->take(6)->get() : []`[cite: 2, 3, 4].
2. **Frontend (`resources/js/pages/Dashboard.jsx`):**[cite: 3, 4]
   - **Row 1 (KPI Stat Cards):** 5 metric cards showing Total Donors, Total Blood Units, Pending Requests, Upcoming Schedules, and Completed Donations[cite: 3, 4].
   - **Row 2 (Blood Group Stock Analytics Grid):** 8 visual cards for `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-` displaying unit counts, percentage bar or status badge (`Out of Stock` if `0`, `Low Stock` in amber if `<= 2`, `Healthy` in green if `>= 3`)[cite: 2, 3, 4].
   - **Row 3 (Two-Column Operational Tables):**[cite: 3, 4]
     - *Left Column:* **Recent Blood Requests** table (`patient_name`, `physician_name`, `blood_group` badge, `units_needed`, `status` badge) with a "View All" link to `/blood-requests`[cite: 2, 3, 4].
     - *Right Column:* **Upcoming Donation Appointments** list (`donor.name`, `donor.blood_group`, `appointment_date`, `appointment_time`, `status`) with a "View All" link to `/schedules`[cite: 2, 3, 4].
   - **Row 4 (Admin-Only Recent Audit Trail):** Rendered only when `auth.roles.includes('admin')`, displaying the latest system actions from `audit_logs`[cite: 2, 3, 4].

---

# Blood Bank Management System (BBMS) - Project Handoff & Task List

## 1. Project Overview & Architectural Rules
This is a Capstone project for a Blood Bank Management System. The foundational architecture and Member 2's modules are 100% complete. The AI agent assisting with the remaining tasks MUST strictly adhere to the following constraints:
*   **Tech Stack:** Laravel (Backend) + Inertia.js + React (Frontend) + Tailwind CSS.
*   **Permissions:** Spatie Laravel Permission for RBAC (Roles: `admin`, `staff`).
*   **Architecture:** Strictly enforce MVC and the Fat Model/Thin Controller pattern. Keep controllers focused strictly on HTTP handling. 
*   **Logic Isolation:** Use Form Requests for all validation. Use Models for relationships. Wrap all multi-step database writes in `DB::transaction()`.
*   **Schema Integrity:** Do NOT invent files, database fields, APIs, methods, or framework behavior. Use only the existing migrated schema.

---

## 2. Current Progress (Completed Tasks)
The following features have already been built, tested, and pushed to the `main` branch. **Do not rebuild these.** You may reference them for layout and logic structure.

*   **Core Foundation & Schema:** All migrations, Eloquent Models (with `$fillable` and relationships), and `BloodBankSeeder.php` are complete. **[COMPLETED]**
*   **Layout & UI:** `AuthenticatedLayout.jsx` (Sidebar, Navbar) is complete. **[COMPLETED]**
*   **Dashboard:** `DashboardController.php` and `Dashboard.jsx` (Analytical KPI cards, charts) are complete. **[COMPLETED]**
*   **Member 2 Scope (Blood Inventory & Collection):**
    *   `BloodInventoryController.php` & `Inventory/Index.jsx` (Live stock tracking) **[COMPLETED]**
    *   `DonationController.php` & `Donations/Create.jsx`, `Donations/Index.jsx` **[COMPLETED]**
    *   *Logic:* Completed donations automatically increment `blood_inventories` and update `donors.last_donation_date` via DB transactions. **[COMPLETED]**
*   **System Audit Logs:** `AuditLogController.php` & `AuditLogs/Index.jsx` are complete. **[COMPLETED]**

---

## 3. Pending Tasks (To Be Completed)
The following modules must be built to complete the BBMS. The AI should tackle these systematically, generating the Controller, modular routing file (e.g., `routes/donors.php`), and React Views (`Index`, `Create`, `Edit`) for each.

### Member 1: Donor Management & Appointments
**Module 1: Donors (`DonorController.php`)**
*   **Objective:** CRUD operations for blood donors.
*   **Requirements:** Must validate blood types and calculate eligibility (e.g., minimum 56 days since `last_donation_date`).
*   **Views:** `Donors/Index.jsx` (table of donors), `Donors/Create.jsx`, `Donors/Edit.jsx`.

**Module 2: Schedules (`DonationScheduleController.php`)**
*   **Objective:** Manage upcoming blood drive appointments.
*   **Requirements:** Link schedules to specific `donor_id`s and track their `status` (Scheduled, Completed, No Show).
*   **Views:** `Schedules/Index.jsx`, `Schedules/Create.jsx`.

### Member 3: Dispensing & System Security
**Module 3: Blood Requests (`BloodRequestController.php`)**
*   **Objective:** Manage the outflow of blood to hospitals/patients.
*   **Requirements:** 
    *   Approving a request MUST automatically decrement `blood_inventories.total_units` for the matching blood group using a `DB::transaction()`.
    *   Must include strict Form Request validation preventing approval if requested units exceed available inventory stock (prevent negative stock).
    *   Log all approvals/rejections to `audit_logs`.
*   **Views:** `BloodRequests/Index.jsx`, `BloodRequests/Create.jsx`.

**Module 4: User & Role Management (`UserController.php`)**
*   **Objective:** Manage staff accounts and Spatie RBAC assignment.
*   **Requirements:** CRUD for users, allowing the `admin` to assign `staff` or `admin` roles. Restrict access to this module to `admin` only.
*   **Views:** `Users/Index.jsx`, `Users/Create.jsx`, `Users/Edit.jsx`.

## 5. Remaining Task Division for the 3-Member Team

After Priority Tasks 1–3 are merged, each member builds their assigned vertical module (Controller + Modular Route File + React CRUD Views)[cite: 3, 4]:

| Member | Assigned Modules | Controllers (`app/Http/Controllers/`) | Modular Routes (`routes/`) | React Pages (`resources/js/pages/`) | Key Business Logic & Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Donors, Staff Users & Profile**[cite: 3, 4] | • `DonorController.php`<br>• `UserController.php`<br>• `ProfileController.php`[cite: 3, 4] | • `routes/donors.php`<br>• `routes/users.php`[cite: 3, 4] | • `Donors/Index.jsx`, `Create.jsx`, `Edit.jsx`<br>• `Users/Index.jsx`<br>• `Profile/Edit.jsx`[cite: 3, 4] | • CRUD for `donors` table + search/filter by `blood_group`[cite: 2, 3, 4].<br>• Admin-only Staff account creation & role assignment (`role:admin` middleware)[cite: 3, 4].<br>• Log actions in `audit_logs`[cite: 2, 3, 4]. |
| **Member 2** | **Blood Inventory & Donations (Collection)**[cite: 3, 4] | • `BloodInventoryController.php`<br>• `DonationController.php`[cite: 3, 4] | • `routes/inventory.php`<br>• `routes/donations.php`[cite: 3, 4] | • `Inventory/Index.jsx`<br>• `Donations/Index.jsx` (History)<br>• `Donations/Create.jsx` (Blood Collection)[cite: 3, 4] | • Recording a `Completed` donation automatically increments `blood_inventory.total_units` for the donor's `blood_group` and updates `donors.last_donation_date` inside a `DB::transaction()`[cite: 2, 3, 4].<br>• Deleting/cancelling a donation adjusts stock accordingly and logs to `audit_logs`[cite: 2, 3, 4]. |
| **Member 3** | **Layout, Analytical Dashboard, Blood Requests, Schedules & Audit Logs**[cite: 3, 4] | • `DashboardController.php`<br>• `BloodRequestController.php`<br>• `ScheduleController.php`<br>• `AuditLogController.php`[cite: 3, 4] | • `routes/blood-requests.php`<br>• `routes/schedules.php`<br>• `routes/audit-logs.php`[cite: 3, 4] | • `Layouts/AuthenticatedLayout.jsx`<br>• `Dashboard.jsx`<br>• `Requests/Index.jsx`, `Create.jsx`<br>• `Schedules/Index.jsx`, `Create.jsx`<br>• `AuditLogs/Index.jsx`[cite: 3, 4] | • Approving & dispensing a `BloodRequest` checks if `blood_inventory.total_units >= units_needed`, deducts units, sets status to `'Handed Over'`, generates `reference_code` (`TRX-XXXXXX-BLD`), records `released_to` and `dispensed_at`, and logs to `audit_logs`[cite: 2, 3, 4].<br>• Scheduling appointments & marking `'Completed'` or `'Cancelled'`[cite: 2, 3, 4].<br>• Admin-only `AuditLogs/Index.jsx` (`role:admin`)[cite: 3, 4]. |

---

## 6. Copy-Paste Prompt for Teammate to Give Their AI

> **"Read the attached `Task.md` carefully. Follow all architectural rules in `Task.md` (Laravel + Inertia.js + React + Spatie RBAC, Fat Model/Thin Controller, no invented database columns). Please start with Section 4: Priority Task 1 (create the 6 migrations, Eloquent models with `$fillable` and relationships, and `BloodBankSeeder.php`), followed by Priority Task 2 (`AuthenticatedLayout.jsx` with Sidebar and Navbar) and Priority Task 3 (`DashboardController.php` and `Dashboard.jsx` Analytical Dashboard)."**[cite: 3, 4]