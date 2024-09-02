import { json } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const place = pgTable("place", {
  name: text("name").primaryKey(),
  image: json("image").$type<string[]>().notNull().default([]),
  review: json("review").$type<string[]>().notNull().default([]),
});
