CREATE INDEX `name_idx` ON `categories` (`name`);--> statement-breakpoint
CREATE INDEX `user_deleted_created_idx` ON `todos` (`user_id`,`deleted_at`,`created_at`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `todos` (`category_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `todos` (`title`);--> statement-breakpoint
CREATE INDEX `description_idx` ON `todos` (`description`);--> statement-breakpoint
CREATE INDEX `end_date_idx` ON `todos` (`end_date`);--> statement-breakpoint
CREATE INDEX `user_category_idx` ON `todos` (`user_id`,`category_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `users` (`username`);