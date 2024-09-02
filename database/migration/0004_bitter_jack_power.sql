ALTER TABLE "place" ALTER COLUMN "image" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "place" ALTER COLUMN "image" SET DEFAULT '[]'::json;