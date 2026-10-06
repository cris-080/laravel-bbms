-- Clean & Merged Database Dump for FinalTermLaravel_BBMS
-- Combines Laravel 13 + Fortify + Spatie Permission + Blood Bank Management System
-- Database: `bbms_db`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- 1. Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default password for all seeded users below is: password123
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@bloodbank.com', NULL, '$2y$12$9LXanjhuUfQi4yFzGFuOgexJwTINbgJp6EJ1jAKGJWZFIkQoUQZKW', '2026-07-15 12:12:11', '2026-07-15 12:12:11'),
(5, 'John Doe', 'john@gmail.com', NULL, '$2y$12$9LXanjhuUfQi4yFzGFuOgexJwTINbgJp6EJ1jAKGJWZFIkQoUQZKW', '2026-07-18 10:07:27', '2026-07-18 10:07:27'),
(7, 'Christian B. Raguindin', 'grandrooster087@gmail.com', NULL, '$2y$12$9LXanjhuUfQi4yFzGFuOgexJwTINbgJp6EJ1jAKGJWZFIkQoUQZKW', '2026-07-18 10:19:51', '2026-07-18 10:19:51'),
(10, 'Rose Smith', 'smith@gmail.com', NULL, '$2y$12$9LXanjhuUfQi4yFzGFuOgexJwTINbgJp6EJ1jAKGJWZFIkQoUQZKW', '2026-07-20 03:32:31', '2026-07-20 03:32:31');

-- --------------------------------------------------------
-- 2. Table structure for table `password_reset_tokens`
-- --------------------------------------------------------

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table structure for table `sessions`
-- --------------------------------------------------------

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table structure for table `cache` & `cache_locks`
-- --------------------------------------------------------

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table structure for table `jobs`, `job_batches`, `failed_jobs`
-- --------------------------------------------------------

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table structure for table `passkeys` (Fortify)
-- --------------------------------------------------------

CREATE TABLE `passkeys` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `credential_id` varchar(255) NOT NULL,
  `credential` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`credential`)),
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `passkeys_credential_id_unique` (`credential_id`),
  KEY `passkeys_user_id_index` (`user_id`),
  CONSTRAINT `passkeys_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Spatie Permission Tables (`roles`, `permissions`, pivots)
-- --------------------------------------------------------

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'web',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`id`, `name`, `guard_name`) VALUES
(1, 'view donors', 'web'),
(2, 'create donors', 'web'),
(3, 'edit donors', 'web'),
(4, 'delete donors', 'web'),
(5, 'view donations', 'web'),
(6, 'create donations', 'web'),
(7, 'edit donations', 'web'),
(8, 'delete donations', 'web'),
(9, 'view inventory', 'web'),
(10, 'manage inventory', 'web'),
(11, 'view requests', 'web'),
(12, 'create requests', 'web'),
(13, 'update requests', 'web'),
(14, 'dispense blood', 'web'),
(15, 'delete requests', 'web'),
(16, 'view schedules', 'web'),
(17, 'create schedules', 'web'),
(18, 'update schedules', 'web'),
(19, 'delete schedules', 'web'),
(20, 'view audit logs', 'web'),
(21, 'manage users', 'web');

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'web',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `guard_name`) VALUES
(1, 'admin', 'web'),
(2, 'staff', 'web');

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 5),
(2, 'App\\Models\\User', 7),
(2, 'App\\Models\\User', 10);

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin gets all 21 permissions; Staff gets operational permissions
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1), (21, 1),
(1, 2), (2, 2), (3, 2), (5, 2), (6, 2), (7, 2), (9, 2), (11, 2), (12, 2), (13, 2), (14, 2), (16, 2), (17, 2), (18, 2);

-- --------------------------------------------------------
-- 8. Table structure for table `donors`
-- --------------------------------------------------------

CREATE TABLE `donors` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `address` text DEFAULT NULL,
  `last_donation_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `donors_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `donors` (`id`, `name`, `email`, `age`, `sex`, `blood_group`, `contact_number`, `address`, `last_donation_date`, `created_at`, `updated_at`) VALUES
(17, 'Kuromi', 'kuromi@gmail.com', 21, 'Male', 'A+', '09770487198', 'CLSU', '2026-07-19', '2026-07-19 12:24:01', '2026-07-19 12:24:01'),
(19, 'Rose Smith', 'smith@gmail.com', 24, 'Male', 'A+', '09770487198', 'POP', '2026-07-20', '2026-07-19 14:38:05', '2026-07-19 14:38:05'),
(20, 'John Doe', 'john@gmail.com', 25, 'Male', 'A+', '09874223654', 'Rizal', NULL, '2026-07-20 02:51:38', '2026-07-20 02:51:38'),
(21, 'Jane Doe', 'jane@gmail.com', 21, 'Female', 'AB+', '09874223654', 'Nueva Ecija', '2026-07-21', '2026-07-20 02:52:06', '2026-07-20 02:52:06'),
(22, 'Mark Bin', 'mark@gmail.com', 26, 'Male', 'B-', '09874223654', 'Nueva Ecija', NULL, '2026-07-20 02:52:37', '2026-07-20 02:52:37'),
(23, 'Jake Lim', 'jake@gmail.com', 30, 'Male', 'B+', '09770487198', 'CLSU', '2026-07-20', '2026-07-20 03:31:28', '2026-07-20 03:31:28'),
(24, 'Henry Williams', 'henry@gmail.com', 30, 'Male', 'O-', '09770487198', 'CLSU', '2026-07-21', '2026-07-21 03:59:22', '2026-07-21 03:59:22');

-- --------------------------------------------------------
-- 9. Table structure for table `blood_inventory`
-- --------------------------------------------------------

CREATE TABLE `blood_inventory` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `total_units` int(11) NOT NULL DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `blood_inventory_blood_group_unique` (`blood_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blood_inventory` (`id`, `blood_group`, `total_units`, `last_updated`, `created_at`, `updated_at`) VALUES
(1, 'A+', 16, '2026-07-19 11:34:09', '2026-07-19 11:34:09', '2026-07-19 11:34:09'),
(2, 'A-', 0, '2026-07-15 10:40:49', '2026-07-15 10:40:49', '2026-07-15 10:40:49'),
(3, 'B+', 1, '2026-07-18 16:38:15', '2026-07-18 16:38:15', '2026-07-18 16:38:15'),
(4, 'B-', 3, '2026-07-18 13:22:39', '2026-07-18 13:22:39', '2026-07-18 13:22:39'),
(5, 'AB+', 7, '2026-07-18 16:57:45', '2026-07-18 16:57:45', '2026-07-18 16:57:45'),
(6, 'AB-', 3, '2026-07-19 10:59:38', '2026-07-19 10:59:38', '2026-07-19 10:59:38'),
(7, 'O+', 4, '2026-07-17 09:19:52', '2026-07-17 09:19:52', '2026-07-17 09:19:52'),
(8, 'O-', 1, '2026-07-18 15:16:43', '2026-07-18 15:16:43', '2026-07-18 15:16:43');

-- --------------------------------------------------------
-- 10. Table structure for table `donations`
-- --------------------------------------------------------

CREATE TABLE `donations` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `donor_id` bigint(20) UNSIGNED NOT NULL,
  `donation_date` date NOT NULL,
  `units_donated` int(11) NOT NULL DEFAULT 1,
  `status` enum('Pending','Completed','Cancelled') NOT NULL DEFAULT 'Completed',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `donations_donor_id_foreign` (`donor_id`),
  CONSTRAINT `donations_donor_id_foreign` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `donations` (`id`, `donor_id`, `donation_date`, `units_donated`, `status`, `created_at`, `updated_at`) VALUES
(23, 17, '2026-07-19', 1, 'Completed', '2026-07-19 15:22:28', '2026-07-19 15:22:28'),
(24, 17, '2026-07-19', 2, 'Completed', '2026-07-19 15:49:16', '2026-07-19 15:49:16'),
(25, 23, '2026-07-20', 2, 'Completed', '2026-07-20 03:31:43', '2026-07-20 03:31:43'),
(26, 19, '2026-07-20', 2, 'Completed', '2026-07-20 03:54:20', '2026-07-20 03:54:20'),
(28, 24, '2026-07-21', 1, 'Completed', '2026-07-21 03:59:42', '2026-07-21 04:49:48'),
(29, 21, '2026-07-21', 2, 'Completed', '2026-07-21 04:02:58', '2026-07-21 04:02:58'),
(31, 24, '2026-07-21', 1, 'Completed', '2026-07-21 04:47:03', '2026-07-21 04:47:03'),
(32, 24, '2026-07-21', 1, 'Completed', '2026-07-21 04:49:37', '2026-07-21 04:49:37');

-- --------------------------------------------------------
-- 11. Table structure for table `donation_schedules`
-- --------------------------------------------------------

CREATE TABLE `donation_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `donor_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('Scheduled','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `donation_schedules_donor_id_foreign` (`donor_id`),
  CONSTRAINT `donation_schedules_donor_id_foreign` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `donation_schedules` (`id`, `donor_id`, `appointment_date`, `appointment_time`, `status`, `created_at`, `updated_at`) VALUES
(5, 19, '2026-07-20', '14:15:00', 'Completed', '2026-07-19 15:14:43', '2026-07-19 15:52:12'),
(8, 22, '2026-07-22', '15:35:00', 'Scheduled', '2026-07-20 03:32:57', '2026-07-20 03:32:57'),
(9, 22, '2026-07-22', '15:35:00', 'Scheduled', '2026-07-20 03:32:58', '2026-07-20 03:32:58'),
(10, 23, '2026-07-24', '02:37:00', 'Completed', '2026-07-20 03:34:05', '2026-07-20 05:05:18'),
(11, 19, '2026-07-21', '03:47:00', 'Scheduled', '2026-07-20 04:47:54', '2026-07-20 04:47:54'),
(13, 21, '2026-07-24', '13:40:00', 'Scheduled', '2026-07-21 03:40:30', '2026-07-21 03:40:30'),
(14, 21, '2026-07-23', '15:47:00', 'Scheduled', '2026-07-21 03:47:09', '2026-07-21 03:47:09'),
(15, 22, '2026-07-23', '11:55:00', 'Scheduled', '2026-07-21 03:53:29', '2026-07-21 03:53:29'),
(16, 19, '2026-07-23', '11:11:00', 'Scheduled', '2026-07-21 03:56:33', '2026-07-21 03:56:33'),
(17, 17, '2026-07-31', '11:11:00', 'Scheduled', '2026-07-21 03:56:58', '2026-07-21 03:56:58');

-- --------------------------------------------------------
-- 12. Table structure for table `blood_requests`
-- --------------------------------------------------------

CREATE TABLE `blood_requests` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `physician_name` varchar(255) NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `units_needed` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `reference_code` varchar(50) DEFAULT NULL,
  `released_to` varchar(100) DEFAULT NULL,
  `dispensed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blood_requests` (`id`, `physician_name`, `patient_name`, `blood_group`, `units_needed`, `status`, `request_date`, `reference_code`, `released_to`, `dispensed_at`, `created_at`, `updated_at`) VALUES
(15, 'Jane', 'John', 'A+', 1, 'Handed Over', '2026-07-18 16:00:00', 'TRX-170740-BLD', 'Jane', '2026-07-19 23:16:13', '2026-07-18 16:00:00', '2026-07-19 23:16:13'),
(16, 'Jane', 'Jake', 'B+', 1, 'Handed Over', '2026-07-18 16:00:00', 'TRX-125282-BLD', 'Jane', '2026-07-19 23:48:48', '2026-07-18 16:00:00', '2026-07-19 23:48:48'),
(17, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(18, 'Jane', 'Jake', 'A-', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(19, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(20, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(21, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(22, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(23, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(24, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-19 16:00:00', NULL, NULL, NULL, '2026-07-19 16:00:00', '2026-07-19 16:00:00'),
(26, 'Jane', 'Jake', 'A+', 1, 'Pending', '2026-07-20 16:00:00', NULL, NULL, NULL, '2026-07-20 16:00:00', '2026-07-20 16:00:00'),
(27, 'Jane', 'Jake', 'A+', 3, 'Pending', '2026-07-20 16:00:00', NULL, NULL, NULL, '2026-07-20 16:00:00', '2026-07-20 16:00:00'),
(28, 'Jenny', 'Paul', 'AB+', 1, 'Pending', '2026-07-20 16:00:00', NULL, NULL, NULL, '2026-07-20 16:00:00', '2026-07-20 16:00:00'),
(29, 'Ned', 'Luke', 'AB+', 2, 'Pending', '2026-07-20 16:00:00', NULL, NULL, NULL, '2026-07-20 16:00:00', '2026-07-20 16:00:00'),
(31, 'Lukas', 'Grif', 'A-', 2, 'Pending', '2026-07-20 16:00:00', NULL, NULL, NULL, '2026-07-20 16:00:00', '2026-07-20 16:00:00');

-- --------------------------------------------------------
-- 13. Table structure for table `audit_logs`
-- --------------------------------------------------------

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `details`, `created_at`, `updated_at`) VALUES
(3, 5, 'Added New Donor', 'Registered donor: Rose Smith (Blood Group: A+)', '2026-07-19 14:38:05', '2026-07-19 14:38:05'),
(4, 5, 'Edited Donor', 'Updated profile for donor ID: 19 (Rose Smith)', '2026-07-19 15:21:58', '2026-07-19 15:21:58'),
(5, 5, 'Logged Donation', 'Recorded 1 units of A+ for donor ID: 17', '2026-07-19 15:22:28', '2026-07-19 15:22:28'),
(6, 5, 'Edited Donor', 'Updated profile for donor ID: 18 (Christian B. Raguindin)', '2026-07-19 15:47:43', '2026-07-19 15:47:43'),
(7, 5, 'Updated Request', 'Changed request ID: 16 to Approved', '2026-07-19 15:48:31', '2026-07-19 15:48:31'),
(8, 5, 'Dispensed Blood', 'Handed over request ID: 16 to Jane (Ref: TRX-125282-BLD)', '2026-07-19 15:48:48', '2026-07-19 15:48:48'),
(9, 5, 'Edited Donation', 'Modified donation ID: 24 (2 units)', '2026-07-19 15:49:16', '2026-07-19 15:49:16'),
(10, 5, 'Edited Donor', 'Updated profile for donor ID: 17 (Kuromi)', '2026-07-19 15:49:35', '2026-07-19 15:49:35'),
(11, 5, 'Updated Schedule', 'Changed appointment ID: 5 to Completed', '2026-07-19 15:52:12', '2026-07-19 15:52:12'),
(12, 5, 'Edited Donor', 'Updated profile for donor ID: 19 (Rose Smith)', '2026-07-19 15:52:26', '2026-07-19 15:52:26'),
(13, 5, 'Booked Appointment', 'Scheduled donor ID: 18 on 2026-07-23 at 15:02', '2026-07-19 16:02:55', '2026-07-19 16:02:55'),
(14, 1, 'Deleted Request', 'Removed blood request ID: 14', '2026-07-20 01:23:57', '2026-07-20 01:23:57'),
(15, 1, 'Deleted Donor', 'Deleted donor ID: 18', '2026-07-20 01:56:54', '2026-07-20 01:56:54'),
(16, 1, 'Added New Donor', 'Registered donor: John Doe (Blood Group: A+)', '2026-07-20 02:51:38', '2026-07-20 02:51:38'),
(17, 1, 'Added New Donor', 'Registered donor: Jane Doe (Blood Group: AB+)', '2026-07-20 02:52:06', '2026-07-20 02:52:06'),
(18, 1, 'Added New Donor', 'Registered donor: Mark Bin (Blood Group: B-)', '2026-07-20 02:52:37', '2026-07-20 02:52:37'),
(19, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:30:38', '2026-07-20 03:30:38'),
(20, 1, 'Created Request', 'Requested 1 units of A- for Dr. Jane', '2026-07-20 03:30:56', '2026-07-20 03:30:56'),
(21, 1, 'Added New Donor', 'Registered donor: Jake Lim (Blood Group: B+)', '2026-07-20 03:31:28', '2026-07-20 03:31:28'),
(22, 1, 'Logged Donation', 'Recorded 2 units of B+ for donor ID: 23', '2026-07-20 03:31:43', '2026-07-20 03:31:43'),
(23, 1, 'Created Staff Account', 'Added new staff account for Rose Smith', '2026-07-20 03:32:31', '2026-07-20 03:32:31'),
(24, 1, 'Booked Appointment', 'Scheduled donor ID: 22 on 2026-07-22 at 15:35', '2026-07-20 03:32:57', '2026-07-20 03:32:57'),
(25, 1, 'Booked Appointment', 'Scheduled donor ID: 22 on 2026-07-22 at 15:35', '2026-07-20 03:32:58', '2026-07-20 03:32:58'),
(26, 1, 'Booked Appointment', 'Scheduled donor ID: 23 on 2026-07-24 at 02:37', '2026-07-20 03:34:05', '2026-07-20 03:34:05'),
(27, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:39:23', '2026-07-20 03:39:23'),
(28, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:47:30', '2026-07-20 03:47:30'),
(29, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:48:25', '2026-07-20 03:48:25'),
(30, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:48:25', '2026-07-20 03:48:25'),
(31, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:50:54', '2026-07-20 03:50:54'),
(32, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:52:47', '2026-07-20 03:52:47'),
(33, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-20 03:53:48', '2026-07-20 03:53:48'),
(34, 1, 'Logged Donation', 'Recorded 2 units of A+ for donor ID: 19', '2026-07-20 03:54:20', '2026-07-20 03:54:20'),
(35, 1, 'Booked Appointment', 'Scheduled donor ID: 19 on 2026-07-21 at 03:47', '2026-07-20 04:47:54', '2026-07-20 04:47:54'),
(36, 1, 'Updated Schedule', 'Changed appointment ID: 10 to Completed', '2026-07-20 05:05:18', '2026-07-20 05:05:18'),
(37, 1, 'Updated Staff Account', 'Modified user ID: 5 (John Doe)', '2026-07-20 14:11:07', '2026-07-20 14:11:07'),
(38, 1, 'Booked Appointment', 'Scheduled donor ID: 20 on 2026-07-23 at 13:40', '2026-07-21 03:39:13', '2026-07-21 03:39:13'),
(39, 1, 'Logged Donation', 'Recorded 2 units of B+ for donor ID: 23', '2026-07-21 03:39:22', '2026-07-21 03:39:22'),
(40, 1, 'Deleted Request', 'Removed blood request ID: 25', '2026-07-21 03:39:31', '2026-07-21 03:39:31'),
(41, 1, 'Deleted Request', 'Removed blood request ID: 25', '2026-07-21 03:39:35', '2026-07-21 03:39:35'),
(42, 1, 'Updated Schedule', 'Changed appointment ID: 12 to Completed', '2026-07-21 03:39:49', '2026-07-21 03:39:49'),
(43, 1, 'Deleted Schedule', 'Removed appointment ID: 12', '2026-07-21 03:40:14', '2026-07-21 03:40:14'),
(44, 1, 'Booked Appointment', 'Scheduled donor ID: 21 on 2026-07-24 at 13:40', '2026-07-21 03:40:30', '2026-07-21 03:40:30'),
(45, 1, 'Booked Appointment', 'Scheduled donor ID: 21 on 2026-07-23 at 15:47', '2026-07-21 03:47:09', '2026-07-21 03:47:09'),
(46, 1, 'Created Request', 'Requested 1 units of A+ for Dr. Jane', '2026-07-21 03:51:41', '2026-07-21 03:51:41'),
(47, 1, 'Created Request', 'Requested 3 units of A+ for Dr. Jane', '2026-07-21 03:52:00', '2026-07-21 03:52:00'),
(48, 1, 'Booked Appointment', 'Scheduled donor ID: 22 on 2026-07-23 at 11:55', '2026-07-21 03:53:29', '2026-07-21 03:53:29'),
(49, 1, 'Booked Appointment', 'Scheduled donor ID: 19 on 2026-07-23 at 11:11', '2026-07-21 03:56:33', '2026-07-21 03:56:33'),
(50, 1, 'Booked Appointment', 'Scheduled donor ID: 17 on 2026-07-31 at 11:11', '2026-07-21 03:56:58', '2026-07-21 03:56:58'),
(51, 1, 'Created Request', 'Requested 1 units of AB+ for Dr. Jenny', '2026-07-21 03:57:46', '2026-07-21 03:57:46'),
(52, 1, 'Created Request', 'Requested 2 units of AB+ for Dr. Ned', '2026-07-21 03:58:19', '2026-07-21 03:58:19'),
(53, 1, 'Added New Donor', 'Registered donor: Henry Williams (Blood Group: O-)', '2026-07-21 03:59:22', '2026-07-21 03:59:22'),
(54, 1, 'Logged Donation', 'Recorded 2 units of O- for donor ID: 24', '2026-07-21 03:59:42', '2026-07-21 03:59:42'),
(55, 1, 'Logged Donation', 'Recorded 2 units of AB+ for donor ID: 21', '2026-07-21 04:02:58', '2026-07-21 04:02:58'),
(56, 1, 'Logged Donation', 'Recorded 2 units of O- for donor ID: 24', '2026-07-21 04:03:39', '2026-07-21 04:03:39'),
(57, 1, 'Created Request', 'Requested 2 units of AB+ for Dr. Ned', '2026-07-21 04:04:32', '2026-07-21 04:04:32'),
(58, 1, 'Deleted Request', 'Removed blood request ID: 30', '2026-07-21 04:04:39', '2026-07-21 04:04:39'),
(59, 1, 'Created Request', 'Requested 2 units of A- for Dr. Lukas', '2026-07-21 04:05:04', '2026-07-21 04:05:04'),
(60, 1, 'Updated Profile', 'Updated personal profile information', '2026-07-21 04:26:01', '2026-07-21 04:26:01'),
(61, 1, 'Logged Donation', 'Recorded 1 units of O- for donor ID: 24', '2026-07-21 04:47:03', '2026-07-21 04:47:03'),
(62, 1, 'Deleted Donation', 'Removed donation record ID: 27', '2026-07-21 04:47:35', '2026-07-21 04:47:35'),
(63, 1, 'Logged Donation', 'Recorded 1 units of O- for donor ID: 24', '2026-07-21 04:49:37', '2026-07-21 04:49:37'),
(64, 1, 'Deleted Donation', 'Removed donation record ID: 30', '2026-07-21 04:49:41', '2026-07-21 04:49:41'),
(65, 1, 'Edited Donation', 'Modified donation ID: 28 (1 units)', '2026-07-21 04:49:48', '2026-07-21 04:49:48');

-- --------------------------------------------------------
-- 14. Table structure for table `migrations`
-- --------------------------------------------------------

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_10_05_041150_add_two_factor_columns_to_users_table', 1),
(5, '2026_10_05_041151_create_passkeys_table', 1),
(6, '2026_10_05_042416_create_permission_tables', 1);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;