ALTER TABLE `processed_stripe_events` ADD `status` text DEFAULT 'pending' NOT NULL;
--> statement-breakpoint
ALTER TABLE `processed_stripe_events` ADD `created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL;
--> statement-breakpoint
ALTER TABLE `processed_stripe_events` ADD `completed_at` integer;
