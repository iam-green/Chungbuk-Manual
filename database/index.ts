import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Client } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
const queryClient = new Client(process.env.DATABASE_URL);
(async () => await queryClient.connect())();
export const db = drizzle(queryClient, { schema });
