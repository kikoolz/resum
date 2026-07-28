CREATE TABLE `educations` (
	`id` text PRIMARY KEY NOT NULL,
	`degree` text,
	`school` text,
	`start_date` integer,
	`end_date` integer,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text,
	`description` text,
	`photo_url` text,
	`color_hex` text DEFAULT '#000000' NOT NULL,
	`border_style` text DEFAULT 'squircle' NOT NULL,
	`summary` text,
	`first_name` text,
	`last_name` text,
	`job_title` text,
	`city` text,
	`country` text,
	`phone` text,
	`email` text,
	`skills` text DEFAULT '[]',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stripe_customer_id` text NOT NULL,
	`stripe_subscription_id` text NOT NULL,
	`stripe_price_id` text NOT NULL,
	`stripe_current_period_end` integer NOT NULL,
	`stripe_cancel_at_period_end` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_subscriptions_user_id_unique` ON `user_subscriptions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_subscriptions_stripe_customer_id_unique` ON `user_subscriptions` (`stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_subscriptions_stripe_subscription_id_unique` ON `user_subscriptions` (`stripe_subscription_id`);--> statement-breakpoint
CREATE TABLE `work_experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`position` text,
	`company` text,
	`start_date` integer,
	`end_date` integer,
	`description` text,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
