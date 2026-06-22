import { Router } from "express";
import { db, usersTable, postsTable, volunteerSignupsTable } from "@workspace/db";
import { eq, desc, gt } from "drizzle-orm";
import { AdminUpdateUserBody } from "@workspace/api-zod";

const router = Router();

function fmtUser(row: typeof usersTable.$inferSelect) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    fullNameAr: row.fullNameAr,
    role: row.role,
    avatarUrl: row.avatarUrl,
    bio: row.bio,
    location: row.location,
    phone: row.phone,
    isActive: row.isActive,
    accessibilityFontLarge: row.accessibilityFontLarge,
    accessibilityHighContrast: row.accessibilityHighContrast,
    accessibilityScreenReader: row.accessibilityScreenReader,
    volunteerPoints: row.volunteerPoints,
    trainingPoints: row.trainingPoints,
    activityPoints: row.activityPoints,
    totalPoints: row.totalPoints,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/admin/users", async (req, res) => {
  try {
    const rows = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    res.json(rows.map(fmtUser));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = AdminUpdateUserBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmtUser(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(usersTable).where(eq(usersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/reported-posts", async (req, res) => {
  try {
    const rows = await db.select().from(postsTable).where(gt(postsTable.reportCount, 0))
      .orderBy(desc(postsTable.reportCount));
    res.json(rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      authorName: "",
      authorNameAr: "",
      authorAvatar: null,
      content: r.content,
      imageUrl: r.imageUrl,
      likesCount: r.likesCount,
      commentsCount: r.commentsCount,
      isApproved: r.isApproved,
      isPinned: r.isPinned,
      isHidden: r.isHidden,
      reportCount: r.reportCount,
      likedByMe: false,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/volunteer-signups", async (req, res) => {
  try {
    const rows = await db.select().from(volunteerSignupsTable).orderBy(desc(volunteerSignupsTable.createdAt));
    res.json(rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      initiativeId: r.initiativeId,
      status: r.status,
      hoursLogged: r.hoursLogged,
      notes: r.notes,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
