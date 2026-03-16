DROP INDEX "subject_name_unique";--> statement-breakpoint
ALTER TABLE `post` ALTER COLUMN "date" TO "date" integer DEFAULT (unixepoch());--> statement-breakpoint
CREATE UNIQUE INDEX `subject_name_unique` ON `subject` (`name`);