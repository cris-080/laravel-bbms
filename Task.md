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

*   **Core Foundation & Schema:** All migrations, Eloquent Models (with `$fillable` and relationships), and `BloodBankSeeder.php` are complete.
*   **Layout & UI:** `AuthenticatedLayout.jsx` (Sidebar, Navbar) is complete.
*   **Dashboard:** `DashboardController.php` and `Dashboard.jsx` (Analytical KPI cards, charts) are complete.
*   **Member 2 Scope (Blood Inventory & Collection):**
    *   `BloodInventoryController.php` & `Inventory/Index.jsx` (Live stock tracking).
    *   `DonationController.php` & `Donations/Create.jsx`, `Donations/Index.jsx`.
    *   *Logic:* Completed donations automatically increment `blood_inventories` and update `donors.last_donation_date` via DB transactions.
*   **System Audit Logs:** `AuditLogController.php` & `AuditLogs/Index.jsx` are complete. 

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