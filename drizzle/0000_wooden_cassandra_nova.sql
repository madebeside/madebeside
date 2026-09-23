CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`received_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`consent_version` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_expires_at` ON `inquiries` (`expires_at`);