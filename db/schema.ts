import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const post = sqliteTable("post", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subject.id),
  week: integer("week").notNull(),
  content: text("content"),
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
});
