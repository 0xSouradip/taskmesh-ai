ALTER TYPE "public"."task_status" ADD VALUE 'IN_REVIEW' BEFORE 'COMPLETED';--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "ai_review_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "ai_feedback" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_missing" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ai_criteria" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "owner_note" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "attempts" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "reviewed_at" timestamp with time zone;--> statement-breakpoint
-- Carry over decisions made under the old AI-auto-accept flow.
UPDATE "submissions" SET "status" = CASE WHEN "accepted" THEN 'accepted' ELSE 'changes_requested' END, "reviewed_at" = "submitted_at";
