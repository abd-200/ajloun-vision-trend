import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  fullNameAr: text("full_name_ar").notNull().default(""),
  role: text("role").notNull().default("member"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  accessibilityFontLarge: boolean("accessibility_font_large").notNull().default(false),
  accessibilityHighContrast: boolean("accessibility_high_contrast").notNull().default(false),
  accessibilityScreenReader: boolean("accessibility_screen_reader").notNull().default(false),
  volunteerPoints: text("volunteer_points").notNull().default("0"),
  trainingPoints: text("training_points").notNull().default("0"),
  activityPoints: text("activity_points").notNull().default("0"),
  totalPoints: text("total_points").notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire", { withTimezone: true }).notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
