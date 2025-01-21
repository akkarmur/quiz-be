-- m_user definition with indexes
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
    UNIQUE KEY `idx_email` (`email`),
    KEY `idx_is_active` (`is_active`)
  );

-- t_otp definition with indexes
CREATE TABLE
  `t_otp` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `email` varchar(64) NOT NULL,
    `otp` varchar(8) NOT NULL,
    `device_id` varchar(64) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_device_id` (`device_id`)
  );

-- t_login definition with indexes
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
    KEY `idx_user_id` (`user_id`),
    KEY `idx_device_id` (`device_id`),
    KEY `idx_is_active` (`is_active`),
    CONSTRAINT `t_login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `m_user` (`id`)
  );

-- t_vocabulary_group definition with indexes
CREATE TABLE
  `t_vocabulary_group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `is_public` TINYINT NOT NULL DEFAULT '1',
    `is_active` tinyint NOT NULL DEFAULT '1',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` BIGINT NOT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` BIGINT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_is_public` (`is_public`),
    KEY `idx_is_active` (`is_active`),
    KEY `idx_created_by` (`created_by`)
  );

-- t_vocabulary definition with indexes
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
    KEY `idx_vocab_group_id` (`vocab_group_id`),
    KEY `idx_is_active` (`is_active`),
    KEY `idx_level` (`level`),
    KEY `idx_type` (`type`),
    CONSTRAINT `t_vocabulary_ibfk_1` FOREIGN KEY (`vocab_group_id`) REFERENCES `t_vocabulary_group` (`id`)
  );

-- t_user_vocabulary_score definition with indexes
CREATE TABLE
  `t_user_vocabulary_score` (
    `vocab_id` bigint NOT NULL,
    `attempt_count` INT NOT NULL,
    `correct_count` INT NOT NULL,
    `is_active` tinyint NOT NULL DEFAULT '1',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` bigint NOT NULL,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` bigint,
    PRIMARY KEY (`vocab_id`, `created_by`),
    KEY `idx_vocab_id` (`vocab_id`),
    KEY `idx_created_by` (`created_by`),
    KEY `idx_is_active` (`is_active`),
    CONSTRAINT `t_user_vocab_score_ibfk_1` FOREIGN KEY (`vocab_id`) REFERENCES `t_vocabulary` (`id`),
    CONSTRAINT `t_user_vocab_score_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `m_user` (`id`)
  );