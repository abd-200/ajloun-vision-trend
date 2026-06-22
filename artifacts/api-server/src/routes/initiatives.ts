import { Router } from "express";
import { db, initiativesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  ListInitiativesQueryParams,
  CreateInitiativeBody,
  GetInitiativeParams,
  UpdateInitiativeParams,
  UpdateInitiativeBody,
  DeleteInitiativeParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/initiatives/featured", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(initiativesTable)
      .where(eq(initiativesTable.isFeatured, true))
      .orderBy(desc(initiativesTable.createdAt))
      .limit(6);
    res.json(rows.map(formatInitiative));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/initiatives", async (req, res) => {
  try {
    const parsed = ListInitiativesQueryParams.safeParse(req.query);
    const { status, category, limit = 50, offset = 0 } = parsed.success ? parsed.data : {};

    let query = db.select().from(initiativesTable).$dynamic();
    if (status) query = query.where(eq(initiativesTable.status, status));
    if (category) query = query.where(eq(initiativesTable.category, category));

    const rows = await query
      .orderBy(desc(initiativesTable.createdAt))
      .limit(Number(limit ?? 50))
      .offset(Number(offset ?? 0));

    res.json(rows.map(formatInitiative));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/initiatives", async (req, res) => {
  try {
    const parsed = CreateInitiativeBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db.insert(initiativesTable).values(parsed.data).returning();
    res.status(201).json(formatInitiative(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/initiatives/:id", async (req, res) => {
  try {
    const { id } = GetInitiativeParams.parse({ id: Number(req.params.id) });
    const [row] = await db.select().from(initiativesTable).where(eq(initiativesTable.id, id));
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(formatInitiative(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/initiatives/:id", async (req, res) => {
  try {
    const { id } = UpdateInitiativeParams.parse({ id: Number(req.params.id) });
    const parsed = UpdateInitiativeBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db
      .update(initiativesTable)
      .set(parsed.data)
      .where(eq(initiativesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(formatInitiative(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/initiatives/:id", async (req, res) => {
  try {
    const { id } = DeleteInitiativeParams.parse({ id: Number(req.params.id) });
    await db.delete(initiativesTable).where(eq(initiativesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatInitiative(row: typeof initiativesTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    titleAr: row.titleAr,
    description: row.description,
    descriptionAr: row.descriptionAr,
    status: row.status,
    category: row.category,
    imageUrl: row.imageUrl,
    location: row.location,
    participantsCount: row.participantsCount,
    targetParticipants: row.targetParticipants,
    progressPercent: row.progressPercent,
    isFeatured: row.isFeatured,
    startDate: row.startDate,
    endDate: row.endDate,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;
