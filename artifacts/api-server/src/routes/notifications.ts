import { Router } from "express";
import { db, notificationsTable, volunteerSignupsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SendNotificationBody } from "@workspace/api-zod";

const router = Router();

function fmt(r: typeof notificationsTable.$inferSelect) {
  return {
    id: r.id,
    userId: r.userId,
    type: r.type,
    title: r.title,
    titleAr: r.titleAr,
    body: r.body,
    bodyAr: r.bodyAr,
    isRead: r.isRead,
    link: r.link,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/notifications", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "غير مسجل" }); return; }
    const rows = await db.select().from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt)).limit(30);
    res.json(rows.map(fmt));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const parsed = SendNotificationBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const { userId, sendToAll, ...rest } = parsed.data;

    if (sendToAll) {
      const users = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.isActive, true));
      await Promise.all(users.map((u) =>
        db.insert(notificationsTable).values({ ...rest, userId: u.id, title: rest.title ?? "", body: rest.body ?? "", bodyAr: rest.bodyAr })
      ));
    } else if (userId) {
      await db.insert(notificationsTable).values({ ...rest, userId, title: rest.title ?? "", body: rest.body ?? "", bodyAr: rest.bodyAr });
    }

    res.status(201).json({ status: "sent" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/notifications/:id/read", async (req, res) => {
  try {
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, Number(req.params.id)));
    res.json({ status: "ok" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/notifications/read-all", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "غير مسجل" }); return; }
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, userId));
    res.json({ status: "ok" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── VOLUNTEER SIGNUPS ──────────────────────────────────────
router.post("/initiatives/:id/volunteer", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "يجب تسجيل الدخول" }); return; }
    const initiativeId = Number(req.params.id);
    const [row] = await db.insert(volunteerSignupsTable).values({ userId, initiativeId }).returning();
    res.status(201).json({ id: row.id, userId: row.userId, initiativeId: row.initiativeId, status: row.status, hoursLogged: row.hoursLogged, notes: row.notes, createdAt: row.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
