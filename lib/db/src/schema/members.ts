import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  fullNameAr: text("full_name_ar").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("member"),
  bio: text("bio"),
  bioAr: text("bio_ar"),
  avatarUrl: text("avatar_url"),
  location: text("location"),
  initiativesCount: integer("initiatives_count").notNull().default(0),
  impactScore: integer("impact_score").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({
  id: true,
  joinedAt: true,
  updatedAt: true,
});
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;
