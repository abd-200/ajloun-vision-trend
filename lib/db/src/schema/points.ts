import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pointsTransactionsTable = pgTable("points_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull().default("activity"),
  points: integer("points").notNull(),
  description: text("description").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const badgesTable = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  icon: text("icon").notNull().default("shield"),
  color: text("color").notNull().default("green"),
  requiredPoints: integer("required_points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userBadgesTable = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  description: text("description").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  pointsCost: integer("points_cost").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rewardClaimsTable = pgTable("reward_claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBadgeSchema = createInsertSchema(badgesTable).omit({ id: true, createdAt: true });
export const insertRewardSchema = createInsertSchema(rewardsTable).omit({ id: true, createdAt: true });
export type Badge = typeof badgesTable.$inferSelect;
export type Reward = typeof rewardsTable.$inferSelect;
export type RewardClaim = typeof rewardClaimsTable.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
