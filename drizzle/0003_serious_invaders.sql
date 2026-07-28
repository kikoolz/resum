CREATE TABLE `awards` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`issuer` text,
	`description` text,
	`date` integer,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`issuer` text,
	`description` text,
	`date` integer,
	`link` text,
	`credential_id` text,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`institution` text,
	`description` text,
	`date` integer,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `interests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `languages` (
	`id` text PRIMARY KEY NOT NULL,
	`language` text,
	`proficiency` text,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`subtitle` text,
	`description` text,
	`link` text,
	`start_date` integer,
	`end_date` integer,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`publisher` text,
	`authors` text,
	`description` text,
	`date` integer,
	`link` text,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resume_references` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`position` text,
	`company` text,
	`email` text,
	`phone` text,
	`visible` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`resume_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `educations` ADD `field_of_study` text;--> statement-breakpoint
ALTER TABLE `educations` ADD `gpa` text;--> statement-breakpoint
ALTER TABLE `educations` ADD `description` text;--> statement-breakpoint
ALTER TABLE `educations` ADD `location` text;--> statement-breakpoint
ALTER TABLE `educations` ADD `visible` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `educations` ADD `display_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `resumes` ADD `linkedin` text;--> statement-breakpoint
ALTER TABLE `resumes` ADD `website` text;--> statement-breakpoint
ALTER TABLE `resumes` ADD `section_order` text DEFAULT '["personal-info","profile","education","skills","experience","projects","awards","publications","certificates"]';--> statement-breakpoint
ALTER TABLE `resumes` ADD `section_visibility` text DEFAULT '{}';--> statement-breakpoint
ALTER TABLE `resumes` ADD `field_visibility` text DEFAULT '{}';--> statement-breakpoint
ALTER TABLE `work_experiences` ADD `location` text;--> statement-breakpoint
ALTER TABLE `work_experiences` ADD `subheading` text;--> statement-breakpoint
ALTER TABLE `work_experiences` ADD `visible` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `work_experiences` ADD `display_order` integer DEFAULT 0 NOT NULL;