CREATE TABLE `attachment` (
	`id` integer PRIMARY KEY NOT NULL,
	`listing_id` integer NOT NULL,
	`path` text,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
