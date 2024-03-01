-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2024 at 08:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jmt`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `maximum_angle` float DEFAULT NULL,
  `patient_user_id` int(11) DEFAULT NULL,
  `doctor_user_id` int(11) DEFAULT NULL,
  `joint` varchar(255) DEFAULT NULL,
  `creation_date` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  `minimum_angle` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`id`, `maximum_angle`, `patient_user_id`, `doctor_user_id`, `joint`, `creation_date`, `notes`, `minimum_angle`) VALUES
(2, 90, 12, 11, 'elbow', '2024-03-01 07:43:52', '', 0),
(3, 133, 12, 11, '', '2024-03-01 09:37:03', '', 0),
(4, 191, 12, 11, 'elbow', '2024-03-01 18:06:30', 'jkjjkjk', 0);

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `user_id` int(11) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`user_id`, `specialization`) VALUES
(11, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `name`, `description`) VALUES
(1, 'Aviation', 'lorem ipsum');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `user_id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`user_id`, `age`) VALUES
(12, 23);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `patient_user_id` int(11) DEFAULT NULL,
  `doctor_user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `start_angle` int(11) DEFAULT NULL,
  `desired_angle` int(11) DEFAULT NULL,
  `target_score` int(11) DEFAULT NULL,
  `scheduled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_taken` int(11) DEFAULT NULL,
  `rra` int(11) DEFAULT NULL,
  `rra_user` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `played` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `joint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `patient_user_id`, `doctor_user_id`, `game_id`, `start_angle`, `desired_angle`, `target_score`, `scheduled_at`, `time_taken`, `rra`, `rra_user`, `score`, `played`, `is_active`, `joint`) VALUES
(9, 12, 11, 1, 0, 120, 2000, '2024-02-01 20:00:00', NULL, 2, 0, 72, NULL, 0, 'Knee'),
(19, 12, 11, 1, 100, 180, 2000, '2024-02-29 22:00:00', NULL, 7, NULL, NULL, NULL, 1, 'knee'),
(20, 12, 11, 1, 20, 180, 4000, '2024-02-29 22:00:00', NULL, 6, 0, 119, NULL, 1, 'knee');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('doctor','patient') DEFAULT 'patient'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`, `role`) VALUES
(11, 'omar@jmt.com', 'Omar', 'Draz', '$2b$12$xMye7ygDNdGhtvUSCW.y1ey9wY/LW8bRukiSC2yxjkaehBVaRfqki', 'doctor'),
(12, 'jon@jmt.com', 'Jon', 'Doe', '$2b$12$Y84pwzNMIIwijU5WrbaUbefS/iOksXAaXBB6V1DZbMiVCXuzCwDQK', 'patient');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_user_id` (`patient_user_id`),
  ADD KEY `doctor_user_id` (`doctor_user_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_user_id` (`patient_user_id`),
  ADD KEY `doctor_user_id` (`doctor_user_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`patient_user_id`) REFERENCES `patients` (`user_id`),
  ADD CONSTRAINT `assessments_ibfk_2` FOREIGN KEY (`doctor_user_id`) REFERENCES `doctors` (`user_id`);

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`patient_user_id`) REFERENCES `patients` (`user_id`),
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`doctor_user_id`) REFERENCES `doctors` (`user_id`),
  ADD CONSTRAINT `sessions_ibfk_3` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
