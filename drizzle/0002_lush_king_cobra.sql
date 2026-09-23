CREATE TABLE `portfolio` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`alt` text NOT NULL,
	`kind` text NOT NULL,
	`mime` text NOT NULL,
	`asset_key` text NOT NULL,
	`caption_key` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_portfolio_status_order` ON `portfolio` (`status`,`sort_order`);