import { Router } from "express";
import { db, membersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  ListMembersQueryParams,
  CreateMemberBody,
  GetMemberParams,
  UpdateMemberParams,
  UpdateMemberBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/members", async (req, res) => {
  try {
    const parsed = ListMembersQueryParams.safeParse(req.query);
    const { role, limit = 50, offset = 0 } = parsed.success ? parsed.data : {};

    let query = db.select().from(membersTable).$dynamic();
    if (role) query = query.where(eq(membersTable.role, role));

    const rows = await query
      .orderBy(desc(membersTable.joinedAt))
      .limit(Number(limit ?? 50))
      .offset(Number(offset ?? 0));

    res.json(rows.map(formatMember));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/members", async (req, res) => {
  try {
    const parsed = CreateMemberBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db.insert(membersTable).values(parsed.data).returning();
    res.status(201).json(formatMember(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/members/:id", async (req, res) => {
  try {
    const { id } = GetMemberParams.parse({ id: Number(req.params.id) });
    const [row] = await db.select().from(membersTable).where(eq(membersTable.id, id));
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(formatMember(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/members/:id", async (req, res) => {
  try {
    const { id } = UpdateMemberParams.parse({ id: Number(req.params.id) });
    const parsed = UpdateMemberBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .update(membersTable)
      .set(parsed.data)
      .where(eq(membersTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(formatMember(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/members/:id/impact", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [member] = await db.select().from(membersTable).where(eq(membersTable.id, id));
    if (!member) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const badges: string[] = [];
    if (member.impactScore >= 100) badges.push("صانع التغيير");
    if (member.impactScore >= 50) badges.push("ناشط مجتمعي");
    if (member.initiativesCount >= 5) badges.push("قائد مبادرات");
    if (member.initiativesCount >= 1) badges.push("مشارك فاعل");
    if (member.role === "coordinator") badges.push("منسق");
    if (member.role === "admin") badges.push("مدير المنصة");

    res.json({
      memberId: member.id,
      initiativesJoined: member.initiativesCount,
      initiativesLed: Math.floor(member.initiativesCount / 3),
      impactScore: member.impactScore,
      badges,
      recentInitiatives: [],
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatMember(row: typeof membersTable.$inferSelect) {
  return {
    id: row.id,
    fullName: row.fullName,
    fullNameAr: row.fullNameAr,
    email: row.email,
    role: row.role,
    bio: row.bio,
    bioAr: row.bioAr,
    avatarUrl: row.avatarUrl,
    location: row.location,
    initiativesCount: row.initiativesCount,
    impactScore: row.impactScore,
    isActive: row.isActive,
    joinedAt: row.joinedAt.toISOString(),
  };
}

export default router;
