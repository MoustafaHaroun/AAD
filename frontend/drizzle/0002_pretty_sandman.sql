PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_attachment` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`path` text NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_attachment`("id", "listing_id", "path") SELECT "id", "listing_id", "path" FROM `attachment`;--> statement-breakpoint
DROP TABLE `attachment`;--> statement-breakpoint
ALTER TABLE `__new_attachment` RENAME TO `attachment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_listing` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location` text NOT NULL,
	`user` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_listing`("id", "title", "description", "location", "user") SELECT "id", "title", "description", "location", "user" FROM `listing`;--> statement-breakpoint
DROP TABLE `listing`;--> statement-breakpoint
ALTER TABLE `__new_listing` RENAME TO `listing`;