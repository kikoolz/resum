CREATE TABLE `ai_results` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_file_id` text NOT NULL,
	`result_type` text NOT NULL,
	`result_data` text NOT NULL,
	`model_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_file_id`) REFERENCES `user_files`(`id`) ON UPDATE no action ON DELETE cascade
);
