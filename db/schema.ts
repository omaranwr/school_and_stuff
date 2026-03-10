import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const post = sqliteTable("post", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subject.id),
  week: integer("week").notNull(),
  content: text("content").notNull(),
});

export const subject = sqliteTable("subject", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
