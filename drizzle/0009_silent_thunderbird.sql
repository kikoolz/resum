CREATE TABLE `referrals` (
	`id` text PRIMARY KEY NOT NULL,
	`referrer_user_id` text NOT NULL,
	`referred_user_id` text NOT NULL,
	`referral_code` text NOT NULL,
	`reward_granted` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `referrals_referred_user_id_unique` ON `referrals` (`referred_user_id`);--> statement-breakpoint
CREATE INDEX `referrals_referrer_user_id_idx` ON `referrals` (`referrer_user_id`);--> statement-breakpoint
CREATE INDEX `referrals_referral_code_idx` ON `referrals` (`referral_code`);--> statement-breakpoint
ALTER TABLE `users` ADD `referral_code` text;--> statement-breakpoint
ALTER TABLE `users` ADD `referred_by` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_referral_code_unique` ON `users` (`referral_code`);