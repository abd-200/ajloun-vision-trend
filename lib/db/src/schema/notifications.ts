import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull().default("info"),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  body: text("body").notNull().default(""),
  bodyAr: text("body_ar").notNull().default(""),
  isRead: boolean("is_read").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const volunteerSignupsTable = pgTable("volunteer_signups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  initiativeId: integer("initiative_id").notNull(),
  status: text("status").notNull().default("pending"),
  hoursLogged: integer("hours_logged").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Notification = typeof notificationsTable.$inferSelect;
