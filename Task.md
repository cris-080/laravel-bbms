# Blood Bank Management System (`FinalTermLaravel_BBMS`)
**Course:** ITELEC 4100 – Advanced Web Development (Final Term Project) 
**Architecture:** Laravel (MVC Backend) + Inertia.js + React (Component UI) + Tailwind CSS + Laravel Fortify (Headless Auth) + Spatie Laravel-Permission (RBAC)

---

## 🤖 INSTRUCTIONS FOR AI CODING ASSISTANT (READ FIRST)
You are assisting a 3-member development team migrating a legacy native PHP MVC Blood Bank Management System into a modern **Laravel + Inertia.js + React** application.
IGNORE the word "cite"

### Strict Architectural & Coding Rules
1. **Follow MVC & Fat Model, Thin Controller:** Keep controllers strictly focused on HTTP request validation (`$request->validate()`), calling model/transaction logic, and returning `Inertia::render('PageName', $data)` or redirects.
2. **Never Invent Database Columns or Tables:** Base all migrations, `$fillable` arrays, Eloquent queries, and React props strictly on the **Database Schema Specification** documented in Section 3 belo.
3. **Use Inertia.js Conventions (No Separate REST API Needed for Views):** Pass data from Laravel controllers directly as props via `Inertia::render()`[cite: 52, 107]. Use `@inertiajs/react`'s `useForm`, `Link`, `Head`, `router`, and `usePage` hooks in React components.
4. **Enforce Spatie RBAC Both Backend & Frontend:**
   - **Backend:** Protect routes using `auth`, `role:admin`, or `permission:...` middlewares.
   - **Frontend:** Read `const { auth } = usePage().props;` (`auth.user`, `auth.roles`, `auth.permissions`) and conditionally render restricted UI links/buttons (e.g., `{auth.roles.includes('admin') && (...)}`).
5. **Modular Routing:** Do not dump all routes into `routes/web.php`. Place each feature module's routes in its own file inside `routes/` (e.g., `routes/donors.php`, `routes/inventory.php`) and require them inside `routes/web.php`.
6. **File Resolution Case-Sensitivity:** React pages live inside `resources/js/pages/` (lowercase `pages` folder) because `resources/js/app.jsx` resolves `./pages/${name}.jsx`[cite: 56, 60].

---

## 1. Local Setup Commands for Teammates Cloning the Repo
After cloning the repository, run these steps to get the project running locally:
1. Copy `.env.example` to `.env` and set `DB_DATABASE=bbms_db` (create `bbms_db` in XAMPP phpMyAdmin).
2. Install backend & frontend dependencies:
   ```bash
   composer install
   npm install
   php artisan key:generate
   ```
3. Run migrations and seed roles, permissions, and default users:
   ```bash
   php artisan migrate
   php artisan db:seed --class=RolePermissionSeeder
   ```
4. Start the concurrent development servers (Laravel + Queue + Vite):
   ```bash
   composer run dev
   ```
5. Default Test Credentials (seeded in `RolePermissionSeeder.php`):
   - **Admin Account:** `admin@bloodbank.com` / `password123` (Role: `admin` — full access)
   - **Staff Account:** `john@gmail.com` / `password123` (Role: `staff` — operational access)

---

## 2. Completed Tasks Log (Done by Member 1)
Do **NOT** redo or overwrite the following completed setup tasks:
- [x] **Base Project Initialization:** Laravel installed with MySQL (`bbms_db`) configured in `.env`.
- [x] **Windows Dev Script Fix (`composer.json`):** Removed `php artisan pail` from `"dev"` script in `composer.json` because Windows PHP lacks the `pcntl` extension. `composer run dev` runs cleanly.
- [x] **Vite 8 & React Integration:** Installed `react`, `react-dom`, `@inertiajs/react`, `vite@^8.0.0`, `@vitejs/plugin-react@^6.1.1`, and `@tailwindcss/vite@^4.2.2`[cite: 55, 57]. Configured `vite.config.js`, `resources/js/app.jsx`, and root `resources/views/app.blade.php`[cite: 55, 56, 58].
- [x] **Inertia Middleware (`app/Http/Middleware/HandleInertiaRequests.php`):** Registered in `bootstrap/app.php` and configured `share()` to pass `auth.user`, `auth.roles`, and `auth.permissions` globally to all React pages[cite: 54, 59, 102].
- [x] **Laravel Fortify Headless Auth:** Installed `laravel/fortify`, ran `fortify:install`, set `'home' => '/dashboard'` in `config/fortify.php`, and bound `Login`, `Register`, `ForgotPassword`, and `ResetPassword` Inertia views inside `app/Providers/FortifyServiceProvider.php`[cite: 78, 79, 80, 82].
- [x] **Login UI (`resources/js/pages/Auth/Login.jsx`):** Built and verified login form using Inertia's `useForm` hook[cite: 85, 86].
- [x] **Spatie Roles & Permissions (`spatie/laravel-permission`):** Published migrations, added `HasRoles` trait to `app/Models/User.php`, and registered `role`, `permission`, and `role_or_permission` middleware aliases in `bootstrap/app.php`[cite: 76, 92, 93, 95, 99].
- [x] **Role & Permission Seeder (`database/seeders/RolePermissionSeeder.php`):** Seeded `admin` and `staff` roles, 21 granular Blood Bank permissions, and default Admin/Staff accounts[cite: 96, 97].
- [x] **Initial Dashboard Verification (`resources/js/pages/Dashboard.jsx`):** Verified login redirect to `/dashboard`, logout via `router.post('/logout')`, and role-based button hiding[cite: 88, 89, 90, 101, 103].

---

## 3. Exact Database Schema Specification (From Legacy `blood_bank_db.sql`)
All migrations, Eloquent models, controllers, and React views must strictly follow these table structures from our previous system[cite: 108]:

### 3.1 `users` (Already migrated via Laravel + Spatie `HasRoles`)[cite: 23, 95]
- `id`, `name`, `email`, `password`, `timestamps` (Roles `'admin'` and `'staff'` are managed via Spatie's `model_has_roles` table instead of the legacy `role` enum column)[cite: 94, 95, 108].

### 3.2 `donors` (`App\Models\Donor`)[cite: 108]
- `id` (Primary Key)[cite: 108]
- `name` (`string`, 100)[cite: 108]
- `email` (`string`, 100, unique, nullable)[cite: 108]
- `age` (`integer`, nullable)[cite: 108]
- `sex` (`string`, 10, nullable — e.g., `'Male'`, `'Female'`)[cite: 108]
- `blood_group` (`enum`: `'A+'`, `'A-'`, `'B+'`, `'B-'`, `'AB+'`, `'AB-'`, `'O+'`, `'O-'`)[cite: 108]
- `contact_number` (`string`, 15)[cite: 108]
- `address` (`text`, nullable)[cite: 108]
- `last_donation_date` (`date`, nullable)[cite: 108]
- `timestamps()`[cite: 27, 108]
- **Relationships:** `hasMany(Donation::class)`, `hasMany(DonationSchedule::class)`[cite: 29, 106, 108]

### 3.3 `blood_inventory` (`App\Models\BloodInventory`)[cite: 108]
- `id` (Primary Key)[cite: 108]
- `blood_group` (`enum`: `'A+'`, `'A-'`, `'B+'`, `'B-'`, `'AB+'`, `'AB-'`, `'O+'`, `'O-'`, unique)[cite: 108]
- `total_units` (`integer`, default `0`)[cite: 108]
- `last_updated` (`timestamp`, default current_timestamp on update current_timestamp) & `timestamps()`[cite: 27, 108]

### 3.4 `donations` (`App\Models\Donation`)[cite: 108]
- `id` (Primary Key)[cite: 108]
- `donor_id` (`foreignId` constrained to `donors` with `cascadeOnDelete()`)[cite: 28, 106, 108]
- `donation_date` (`date`)[cite: 108]
- `units_donated` (`integer`, default `0`)[cite: 108]
- `status` (`enum`: `'Pending'`, `'Completed'`, `'Cancelled'`, default `'Completed'`)[cite: 108]
- `timestamps()`[cite: 27, 106]
- **Relationships:** `belongsTo(Donor::class)`[cite: 30, 106, 108]

### 3.5 `donation_schedules` (`App\Models\DonationSchedule`)[cite: 108]
- `id` (Primary Key)[cite: 108]
- `donor_id` (`foreignId` constrained to `donors` with `cascadeOnDelete()`)[cite: 28, 106, 108]
- `appointment_date` (`date`)[cite: 108]
- `appointment_time` (`time`)[cite: 108]
- `status` (`enum`: `'Scheduled'`, `'Completed'`, `'Cancelled'`, default `'Scheduled'`)[cite: 108]
- `timestamps()`[cite: 27, 108]
- **Relationships:** `belongsTo(Donor::class)`[cite: 30, 106, 108]

### 3.6 `blood_requests` (`App\Models\BloodRequest`)[cite: 108]
- `id` (Primary Key)[cite: 108]
- `physician_name` (`string`, 255)[cite: 108]
- `patient_name` (`string`, 100)[cite: 108]
- `blood_group` (`enum`: `'A+'`, `'A-'`, `'B+'`, `'B-'`, `'AB+'`, `'AB-'`, `'O+'`, `'O-'`)[cite: 108]
- `units_needed` (`integer`)[cite: 108]
- `status` (`string`, 50, default `'Pending'` — values used: `'Pending'`, `'Approved'`, `'Handed Over'`, `'Rejected'`)[cite: 108]
- `request_date` (`timestamp`, useCurrent)[cite: 108]
- `reference_code` (`string`, 50, nullable — e.g., `'TRX-170740-BLD'`)[cite: 108]
- `released_to` (`string`, 100, nullable)[cite: 108]
- `dispensed_at` (`dateTime`, nullable)[cite: 108]
- `timestamps()`[cite: 27, 106]

### 3.7 `audit_logs` (`App\Models\AuditLog`)[cite: 108]
- `id` (Primary Key)[cite: 108]
- `user_id` (`foreignId` constrained to `users` with `cascadeOnDelete()`)[cite: 28, 106, 108]
- `action` (`string`, 255 — e.g., `'Added New Donor'`, `'Logged Donation'`, `'Dispensed Blood'`, `'Booked Appointment'`)[cite: 108]
- `details` (`text`, nullable)[cite: 108]
- `timestamps()`[cite: 27, 108]
- **Relationships:** `belongsTo(User::class)`[cite: 30, 106, 108]

---

## 4. IMMEDIATE NEXT TASKS (Start Here!)

When a teammate uploads this `Task.md` to an AI assistant, execute **Priority Tasks 1, 2, and 3** first before building individual CRUD pages:

### Priority Task 1: Create the 6 Core Migrations, Eloquent Models & Initial Data Seeder
1. Create migrations and models (`php artisan make:model ModelName -m`) for[cite: 25, 26]:
   - `Donor` (`donors`)[cite: 108]
   - `BloodInventory` (`blood_inventory`)[cite: 108]
   - `Donation` (`donations`)[cite: 108]
   - `DonationSchedule` (`donation_schedules`)[cite: 108]
   - `BloodRequest` (`blood_requests`)[cite: 108]
   - `AuditLog` (`audit_logs`)[cite: 108]
2. Define `$fillable` arrays and explicit Eloquent relationships (`hasMany`, `belongsTo`) on every model[cite: 8, 29, 30, 106].
3. Create a `BloodBankSeeder.php` (and call it in `DatabaseSeeder.php`) that seeds:
   - The 8 blood groups in `blood_inventory` (`A+`: 16, `A-`: 0, `B+`: 1, `B-`: 3, `AB+`: 7, `AB-`: 3, `O+`: 4, `O-`: 1)[cite: 108].
   - Sample donors, donations, schedules, blood requests, and audit logs from Section 3 (`blood_bank_db.sql`) so the Analytical Dashboard has realistic data immediately[cite: 108].

### Priority Task 2: Build the Reusable System Layout (`resources/js/Layouts/AuthenticatedLayout.jsx`)
Replace the legacy `admin_header.php`, `admin_sidebar.php`, and `footer.php` files with a modern React layout component (`resources/js/Layouts/AuthenticatedLayout.jsx`):
1. **Left Sidebar Navigation:**
   - Brand header: **Blood Bank Management System** with blood drop icon/badge.
   - Navigation Links using Inertia `<Link>` with active route highlighting (`usePage().url`):
     - **Dashboard** (`/dashboard`) — visible to `admin` & `staff`[cite: 88, 101]
     - **Blood Inventory** (`/inventory`) — visible to `admin` & `staff`
     - **Manage Donors** (`/donors`) — visible to `admin` & `staff`
     - **Blood Collection / Donations** (`/donations`) — visible to `admin` & `staff`
     - **Donation Schedules** (`/schedules`) — visible to `admin` & `staff`
     - **Blood Requests** (`/blood-requests`) — visible to `admin` & `staff`
     - **Manage Users / Staff** (`/users`) — strictly gated with `{auth.roles.includes('admin') && (...)}`[cite: 101, 103, 107]
     - **Audit Logs** (`/audit-logs`) — strictly gated with `{auth.roles.includes('admin') && (...)}`[cite: 101, 103, 107]
2. **Top Navbar (Header):**
   - Displays current page title prop (`title`).
   - Displays authenticated user's name (`auth.user.name`) and role badge (`auth.roles[0]`)[cite: 101, 102].
   - Profile link (`/profile`) and Logout button (`router.post('/logout')`)[cite: 89, 101].
   - Flash message banner for `flash.success` / `flash.error` (add `'flash' => ['success' => fn () => $request->session()->get('success')]` in `HandleInertiaRequests.php`)[cite: 42, 102].
3. **Responsive Content Area:**
   - Renders `{children}` inside a clean, scrollable container with a footer.

### Priority Task 3: Build the Admin Analytical Dashboard (`DashboardController.php` + `resources/js/pages/Dashboard.jsx`)
Upgrade `/dashboard` from a static placeholder into a full analytical dashboard wrapped in `AuthenticatedLayout`:
1. **Backend (`app/Http/Controllers/DashboardController.php`):**
   - Update `routes/web.php` so `GET /dashboard` points to `[DashboardController::class, 'index']`[cite: 6, 88].
   - Query and pass the following props via `Inertia::render('Dashboard', [...])`[cite: 52, 107]:
     - `stats`:
       - `totalDonors`: `Donor::count()`[cite: 108]
       - `totalUnitsAvailable`: `BloodInventory::sum('total_units')`[cite: 108]
       - `pendingRequestsCount`: `BloodRequest::where('status', 'Pending')->count()`[cite: 108]
       - `scheduledAppointmentsCount`: `DonationSchedule::where('status', 'Scheduled')->count()`[cite: 108]
       - `completedDonationsCount`: `Donation::where('status', 'Completed')->count()`[cite: 108]
     - `bloodInventory`: `BloodInventory::orderBy('id')->get()` (All 8 blood types with `total_units` and `last_updated`)[cite: 108].
     - `recentRequests`: `BloodRequest::latest('request_date')->take(5)->get()`[cite: 108].
     - `upcomingSchedules`: `DonationSchedule::with('donor')->where('status', 'Scheduled')->orderBy('appointment_date')->orderBy('appointment_time')->take(5)->get()`[cite: 108].
     - `recentAuditLogs`: `$request->user()->hasRole('admin') ? AuditLog::with('user')->latest()->take(6)->get() : []`[cite: 95, 108].
2. **Frontend (`resources/js/pages/Dashboard.jsx`):**
   - **Row 1 (KPI Stat Cards):** 5 metric cards showing Total Donors, Total Blood Units, Pending Requests, Upcoming Schedules, and Completed Donations.
   - **Row 2 (Blood Group Stock Analytics Grid):** 8 visual cards for `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-` displaying unit counts, percentage bar or status badge (`Out of Stock` if `0`, `Low Stock` in amber if `<= 2`, `Healthy` in green if `>= 3`)[cite: 108].
   - **Row 3 (Two-Column Operational Tables):**
     - *Left Column:* **Recent Blood Requests** table (`patient_name`, `physician_name`, `blood_group` badge, `units_needed`, `status` badge) with a "View All" link to `/blood-requests`[cite: 108].
     - *Right Column:* **Upcoming Donation Appointments** list (`donor.name`, `donor.blood_group`, `appointment_date`, `appointment_time`, `status`) with a "View All" link to `/schedules`[cite: 108].
   - **Row 4 (Admin-Only Recent Audit Trail):** Rendered only when `auth.roles.includes('admin')`[cite: 101, 107], displaying the latest system actions from `audit_logs`[cite: 108].

---

## 5. Remaining Task Division for the 3-Member Team

After Priority Tasks 1–3 are merged, each member builds their assigned vertical module (Controller + Modular Route File + React CRUD Views):

| Member | Assigned Modules | Controllers (`app/Http/Controllers/`) | Modular Routes (`routes/`) | React Pages (`resources/js/pages/`) | Key Business Logic & Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Donors, Staff Users & Profile** | • `DonorController.php`<br>• `UserController.php`<br>• `ProfileController.php` | • `routes/donors.php`<br>• `routes/users.php` | • `Donors/Index.jsx`, `Create.jsx`, `Edit.jsx`<br>• `Users/Index.jsx`<br>• `Profile/Edit.jsx` | • CRUD for `donors` table + search/filter by `blood_group`[cite: 108].<br>• Admin-only Staff account creation & role assignment (`role:admin` middleware)[cite: 99, 107, 108].<br>• Log actions in `audit_logs`[cite: 108]. |
| **Member 2** | **Blood Inventory & Donations (Collection)** | • `BloodInventoryController.php`<br>• `DonationController.php` | • `routes/inventory.php`<br>• `routes/donations.php` | • `Inventory/Index.jsx`<br>• `Donations/Index.jsx` (History)<br>• `Donations/Create.jsx` (Blood Collection) | • Recording a `Completed` donation automatically increments `blood_inventory.total_units` for the donor's `blood_group` and updates `donors.last_donation_date` inside a `DB::transaction()`[cite: 108].<br>• Deleting/cancelling a donation adjusts stock accordingly and logs to `audit_logs`[cite: 108]. |
| **Member 3** | **Layout, Analytical Dashboard, Blood Requests, Schedules & Audit Logs** | • `DashboardController.php`<br>• `BloodRequestController.php`<br>• `ScheduleController.php`<br>• `AuditLogController.php` | • `routes/blood-requests.php`<br>• `routes/schedules.php`<br>• `routes/audit-logs.php` | • `Layouts/AuthenticatedLayout.jsx`<br>• `Dashboard.jsx`<br>• `Requests/Index.jsx`, `Create.jsx`<br>• `Schedules/Index.jsx`, `Create.jsx`<br>• `AuditLogs/Index.jsx` | • Approving & dispensing a `BloodRequest` checks if `blood_inventory.total_units >= units_needed`, deducts units, sets status to `'Handed Over'`, generates `reference_code` (`TRX-XXXXXX-BLD`), records `released_to` and `dispensed_at`, and logs to `audit_logs`[cite: 108].<br>• Scheduling appointments & marking `'Completed'` or `'Cancelled'`[cite: 108].<br>• Admin-only `AuditLogs/Index.jsx` (`role:admin`)[cite: 99, 107, 108]. |

---

## 6. Copy-Paste Prompt for Teammate to Give Their AI

> **"Read the attached `Task.md` carefully. Follow all architectural rules in the README (Laravel + Inertia.js + React + Spatie RBAC, Fat Model/Thin Controller, no invented database columns). Please start with Section 4: Priority Task 1 (create the 6 migrations, Eloquent models with `$fillable` and relationships, and `BloodBankSeeder.php`), followed by Priority Task 2 (`AuthenticatedLayout.jsx` with Sidebar and Navbar) and Priority Task 3 (`DashboardController.php` and `Dashboard.jsx` Analytical Dashboard)."**