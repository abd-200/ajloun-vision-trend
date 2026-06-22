import { Router } from "express";
import { db, initiativesTable, membersTable, activityTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";

const router = Router();

router.get("/stats/overview", async (req, res) => {
  try {
    const [allInitiatives] = await db.select({ count: count() }).from(initiativesTable);
    const [activeInitiatives] = await db
      .select({ count: count() })
      .from(initiativesTable)
      .where(eq(initiativesTable.status, "active"));
    const [completedInitiatives] = await db
      .select({ count: count() })
      .from(initiativesTable)
      .where(eq(initiativesTable.status, "completed"));
    const [allMembers] = await db.select({ count: count() }).from(membersTable);

    const totalImpact =
      Number(allInitiatives?.count ?? 0) * 12 +
      Number(allMembers?.count ?? 0) * 3;

    res.json({
      totalInitiatives: Number(allInitiatives?.count ?? 0),
      activeInitiatives: Number(activeInitiatives?.count ?? 0),
      completedInitiatives: Number(completedInitiatives?.count ?? 0),
      totalMembers: Number(allMembers?.count ?? 0),
      totalImpactActions: totalImpact,
      governoratesCovered: 1,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/initiatives-by-category", async (req, res) => {
  try {
    const rows = await db
      .select({ category: initiativesTable.category, count: count() })
      .from(initiativesTable)
      .groupBy(initiativesTable.category)
      .orderBy(desc(count()));
    res.json(rows.map((r) => ({ category: r.category, count: Number(r.count) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/recent-activity", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(activityTable)
      .orderBy(desc(activityTable.createdAt))
      .limit(10);
    res.json(
      rows.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        titleAr: r.titleAr,
        description: r.description,
        timestamp: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
