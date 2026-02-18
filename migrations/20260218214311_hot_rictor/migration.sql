PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_links` (
	`slug` text PRIMARY KEY,
	`url` text NOT NULL,
	`description` text,
	`visit_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_clicked_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_links`(`slug`, `url`, `description`, `visit_count`, `created_at`, `last_clicked_at`) SELECT `slug`, `url`, `description`, `visit_count`, `created_at`, `last_clicked_at` FROM `links`;--> statement-breakpoint
DROP TABLE `links`;--> statement-breakpoint
ALTER TABLE `__new_links` RENAME TO `links`;--> statement-breakpoint
PRAGMA foreign_keys=ON;