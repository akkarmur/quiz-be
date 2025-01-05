-- m_user definition
CREATE TABLE
  `m_user` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(64) NOT NULL,
    `email` varchar(64) NOT NULL,
    `password` varchar(255) DEFAULT NULL,
    `google_sso` tinyint (1) NOT NULL DEFAULT '0',
    `role` enum ('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
    `profile_image` text,
    `is_archive` tinyint NOT NULL DEFAULT '0',
    `is_active` tinyint NOT NULL DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` varchar(64),
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` varchar(64),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- t_otp definition
CREATE TABLE
  `t_otp` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `email` varchar(64) NOT NULL,
    `otp` varchar(8) NOT NULL,
    `device_id` varchar(64) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- t_login definition
CREATE TABLE
  `t_login` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `user_id` bigint NULL,
    `refresh_token` text NULL,
    `device_id` varchar(255) NOT NULL,
    `os` varchar(64) NOT NULL,
    `device_token` text NULL,
    `is_active` tinyint NOT NULL DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` varchar(64),
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` varchar(64),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `t_login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `m_user` (`id`)
  );

-- t_vocabulary_group definition
CREATE TABLE
  `t_vocabulary_group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `is_active` tinyint NOT NULL DEFAULT '1',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` BIGINT NOT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` BIGINT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- t_vocabulary definition
CREATE TABLE
  `t_vocabulary` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `vocab_group_id` bigint NULL,
    `word` varchar(64) NOT NULL,
    `language` varchar(64) NOT NULL,
    `note_word` text NULL,
    `image` varchar(255),
    `meaning` varchar(64) NOT NULL,
    `pronunciation` varchar(64) NOT NULL,
    `note_meaning` text NULL,
    `level` INT NULL,
    `type` varchar(64) NULL DEFAULT NULL,
    `is_active` tinyint NOT NULL DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` bigint NOT NULL,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` bigint,
    PRIMARY KEY (`id`),
    KEY `vocab_group_id` (`vocab_group_id`),
    CONSTRAINT `t_vocabulary_ibfk_1` FOREIGN KEY (`vocab_group_id`) REFERENCES `t_vocabulary_group` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 790247 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;