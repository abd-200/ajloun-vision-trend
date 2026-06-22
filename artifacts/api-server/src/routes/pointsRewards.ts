import { Router } from "express";
import { db, usersTable, pointsTransactionsTable, badgesTable, userBadgesTable, rewardsTable, rewardClaimsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { AwardPointsBody, CreateBadgeBody, AwardBadgeBody, CreateRewardBody, UpdateClaimStatusBody } from "@workspace/api-zod";

const router = Router();

// ─── POINTS ─────────────────────────────────────────────────
router.get("/points/my", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "غير مسجل" }); return; }
    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!u) { res.status(404).json({ error: "Not found" }); return; }
    res.json({
      userId: u.id,
      volunteerPoints: Number(u.volunteerPoints),
      trainingPoints: Number(u.trainingPoints),
      activityPoints: Number(u.activityPoints),
      totalPoints: Number(u.totalPoints),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/points/leaderboard", async (req, res) => {
  try {
    const rows = await db.select().from(usersTable).where(eq(usersTable.isActive, true))
      .orderBy(desc(sql`CAST(${usersTable.totalPoints} AS INTEGER)`)).limit(20);
    res.json(rows.map((u, i) => ({
      userId: u.id,
      fullName: u.fullName,
      fullNameAr: u.fullNameAr,
      avatarUrl: u.avatarUrl,
      totalPoints: Number(u.totalPoints),
      rank: i + 1,
    })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/points/award", async (req, res) => {
  try {
    const parsed = AwardPointsBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const { userId, points, category, description = "", descriptionAr } = parsed.data;

    await db.insert(pointsTransactionsTable).values({
      userId,
      type: "award",
      category,
      points,
      description,
      descriptionAr,
    });

    const col = category === "volunteer" ? usersTable.volunteerPoints
      : category === "training" ? usersTable.trainingPoints
      : usersTable.activityPoints;

    await db.update(usersTable).set({
      [col.name]: sql`CAST(${col} AS INTEGER) + ${points}`,
      totalPoints: sql`CAST(${usersTable.totalPoints} AS INTEGER) + ${points}`,
    }).where(eq(usersTable.id, userId));

    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    res.json({
      userId: u.id,
      volunteerPoints: Number(u.volunteerPoints),
      trainingPoints: Number(u.trainingPoints),
      activityPoints: Number(u.activityPoints),
      totalPoints: Number(u.totalPoints),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/points/transactions", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "غير مسجل" }); return; }
    const rows = await db.select().from(pointsTransactionsTable)
      .where(eq(pointsTransactionsTable.userId, userId))
      .orderBy(desc(pointsTransactionsTable.createdAt)).limit(50);
    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/points/users/:userId/transactions", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const rows = await db.select().from(pointsTransactionsTable)
      .where(eq(pointsTransactionsTable.userId, userId))
      .orderBy(desc(pointsTransactionsTable.createdAt)).limit(50);
    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── BADGES ─────────────────────────────────────────────────
router.get("/badges", async (req, res) => {
  try {
    const rows = await db.select().from(badgesTable).orderBy(badgesTable.requiredPoints);
    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/badges", async (req, res) => {
  try {
    const parsed = CreateBadgeBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.insert(badgesTable).values(parsed.data).returning();
    res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/badges/:id", async (req, res) => {
  try {
    await db.delete(badgesTable).where(eq(badgesTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/badges/award", async (req, res) => {
  try {
    const parsed = AwardBadgeBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    await db.insert(userBadgesTable).values(parsed.data);
    res.json({ status: "awarded" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/badges/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const rows = await db.select({ badge: badgesTable })
      .from(userBadgesTable)
      .innerJoin(badgesTable, eq(userBadgesTable.badgeId, badgesTable.id))
      .where(eq(userBadgesTable.userId, userId));
    res.json(rows.map((r) => ({ ...r.badge, createdAt: r.badge.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── REWARDS / STORE ────────────────────────────────────────
router.get("/rewards", async (req, res) => {
  try {
    const rows = await db.select().from(rewardsTable).where(eq(rewardsTable.isActive, true))
      .orderBy(rewardsTable.pointsCost);
    res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rewards", async (req, res) => {
  try {
    const parsed = CreateRewardBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.insert(rewardsTable).values(parsed.data).returning();
    res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/rewards/:id", async (req, res) => {
  try {
    const parsed = CreateRewardBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.update(rewardsTable).set(parsed.data).where(eq(rewardsTable.id, Number(req.params.id))).returning();
    res.json({ ...row, createdAt: row.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/rewards/:id", async (req, res) => {
  try {
    await db.delete(rewardsTable).where(eq(rewardsTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/rewards/:id/claim", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "يجب تسجيل الدخول" }); return; }

    const rewardId = Number(req.params.id);
    const [reward] = await db.select().from(rewardsTable).where(eq(rewardsTable.id, rewardId));
    if (!reward || !reward.isActive || reward.stock <= 0) {
      res.status(400).json({ error: "المكافأة غير متوفرة" }); return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (Number(user.totalPoints) < reward.pointsCost) {
      res.status(400).json({ error: "نقاطك غير كافية" }); return;
    }

    await db.insert(rewardClaimsTable).values({ userId, rewardId });
    await db.update(rewardsTable).set({ stock: reward.stock - 1 }).where(eq(rewardsTable.id, rewardId));
    await db.update(usersTable).set({
      totalPoints: String(Number(user.totalPoints) - reward.pointsCost),
    }).where(eq(usersTable.id, userId));

    await db.insert(pointsTransactionsTable).values({
      userId,
      type: "redeem",
      category: "activity",
      points: -reward.pointsCost,
      description: `Claimed: ${reward.title}`,
      descriptionAr: `استبدال: ${reward.titleAr}`,
    });

    res.json({ status: "claimed" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rewards/claims", async (req, res) => {
  try {
    const rows = await db.select({
      claim: rewardClaimsTable,
      rewardTitle: rewardsTable.title,
      rewardTitleAr: rewardsTable.titleAr,
    }).from(rewardClaimsTable)
      .innerJoin(rewardsTable, eq(rewardClaimsTable.rewardId, rewardsTable.id))
      .orderBy(desc(rewardClaimsTable.createdAt));
    res.json(rows.map((r) => ({
      id: r.claim.id,
      userId: r.claim.userId,
      rewardId: r.claim.rewardId,
      rewardTitle: r.rewardTitle,
      rewardTitleAr: r.rewardTitleAr,
      status: r.claim.status,
      createdAt: r.claim.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/rewards/claims/:id/status", async (req, res) => {
  try {
    const parsed = UpdateClaimStatusBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.update(rewardClaimsTable).set({ status: parsed.data.status })
      .where(eq(rewardClaimsTable.id, Number(req.params.id))).returning();
    const [reward] = await db.select().from(rewardsTable).where(eq(rewardsTable.id, row.rewardId));
    res.json({
      id: row.id,
      userId: row.userId,
      rewardId: row.rewardId,
      rewardTitle: reward?.title ?? "",
      rewardTitleAr: reward?.titleAr ?? "",
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
