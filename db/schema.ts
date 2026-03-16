import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const post = sqliteTable("post", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subject.id),
  week: integer("week").notNull(),
  content: text("content"),
  date: text("date").default(sql`(CURRENT_TIMESTAMP)`),
  type: text("type", { enum: ["تقييم", "أداء منزلي", "أداء صفي"] }).default(
    "تقييم",
  ),
});

export const subject = sqliteTable("subject", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const image = sqliteTable("image", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => post.id),
  url: text("url").notNull(),
  order: real("order").notNull(),
  width: integer("width"),
  height: integer("height"),
});
