import { pgTable, text, serial, timestamp, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const initiativesTable = pgTable("initiatives", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  description: text("description").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  status: text("status").notNull().default("planned"),
  category: text("category").notNull().default("general"),
  imageUrl: text("image_url"),
  location: text("location"),
  participantsCount: integer("participants_count").notNull().default(0),
  targetParticipants: integer("target_participants"),
  progressPercent: integer("progress_percent"),
  isFeatured: boolean("is_featured").notNull().default(false),
  startDate: date("start_date", { mode: "string" }),
  endDate: date("end_date", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertInitiativeSchema = createInsertSchema(initiativesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Initiative = typeof initiativesTable.$inferSelect;
