import "dotenv/config";
import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");

export default {
  dialect: "postgresql",
  schema: "./database/schema/**/*.{js,ts}",
  out: "./database/migration",
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;
