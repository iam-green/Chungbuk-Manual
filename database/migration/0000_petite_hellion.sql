CREATE TABLE IF NOT EXISTS "place" (
	"place" text PRIMARY KEY NOT NULL,
	"review" json DEFAULT '[]'::json
);
