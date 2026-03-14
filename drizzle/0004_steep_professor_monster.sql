DROP INDEX "subject_name_unique";--> statement-breakpoint
ALTER TABLE `post` ALTER COLUMN "content" TO "content" text;--> statement-breakpoint
CREATE UNIQUE INDEX `subject_name_unique` ON `subject` (`name`);