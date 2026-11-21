DROP TABLE "project_templates" CASCADE;--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN "accepted";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "xp";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bounties_earned";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "tasks_completed";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "acceptance_rate";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "speed_rating";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_founding_team";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "team";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "skills";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "badges";