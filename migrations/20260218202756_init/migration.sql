CREATE TABLE `analytics` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL,
	`country` text,
	`city` text,
	`device` text,
	`browser` text,
	`referer` text,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT `fk_analytics_slug_links_slug_fk` FOREIGN KEY (`slug`) REFERENCES `links`(`slug`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `links` (
	`slug` text PRIMARY KEY,
	`url` text NOT NULL,
	`description` text,
	`visit_count` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_clicked_at` integer
);
--> statement-breakpoint
CREATE INDEX `analytics_slug_idx` ON `analytics` (`slug`);--> statement-breakpoint
CREATE INDEX `analytics_time_idx` ON `analytics` (`timestamp`);