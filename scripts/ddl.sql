-- m_user definition
CREATE TABLE `m_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_sso` tinyint(1) NOT NULL DEFAULT '0',
  `role` enum('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
  `is_archive` tinyint NOT NULL DEFAULT '0',
  `is_active` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(64),
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(64),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `t_otp` (
 `id` bigint NOT NULL AUTO_INCREMENT,
 `email` varchar(64) NOT NULL,
 `otp` varchar(8) NOT NULL,
 `device_id` varchar(64) NOT NULL,
 `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `t_login` (
 `id` bigint NOT NULL AUTO_INCREMENT,
 `user_id` bigint NULL,
 `refresh_token` text NULL,
 `device_id` varchar(255) NOT NULL,
 `os` varchar(64) NOT NULL,
 `device_token` text NOT NULL,
 `is_active` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(64),
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(64),
 PRIMARY KEY (`id`),
 KEY `user_id` (`user_id`),
 CONSTRAINT `t_login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `m_user` (`id`)
) ;