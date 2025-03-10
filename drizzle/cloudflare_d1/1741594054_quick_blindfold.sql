CREATE TABLE `feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feedback_email_unique` ON `feedback` (`email`);--> statement-breakpoint
CREATE INDEX `feedback__email_idx` ON `feedback` (`email`);