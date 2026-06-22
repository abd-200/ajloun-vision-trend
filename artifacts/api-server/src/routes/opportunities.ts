import { Router } from "express";
import { db, opportunitiesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateOpportunityBody } from "@workspace/api-zod";

const router = Router();

function fmt(r: typeof opportunitiesTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    titleAr: r.titleAr,
    description: r.description,
    descriptionAr: r.descriptionAr,
    type: r.type,
    organization: r.organization,
    location: r.location,
    isRemote: r.isRemote,
    deadline: r.deadline,
    link: r.link,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/opportunities", async (req, res) => {
  try {
    const type = req.query.type as string | undefined;
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);

    let query = db.select().from(opportunitiesTable).where(eq(opportunitiesTable.isActive, true)).$dynamic();
    if (type) query = query.where(eq(opportunitiesTable.type, type));

    const rows = await query.orderBy(desc(opportunitiesTable.createdAt)).limit(limit).offset(offset);
    res.json(rows.map(fmt));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/opportunities", async (req, res) => {
  try {
    const parsed = CreateOpportunityBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.insert(opportunitiesTable).values(parsed.data).returning();
    res.status(201).json(fmt(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/opportunities/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [row] = await db.select().from(opportunitiesTable).where(eq(opportunitiesTable.id, id));
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/opportunities/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = CreateOpportunityBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const [row] = await db.update(opportunitiesTable).set(parsed.data).where(eq(opportunitiesTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/opportunities/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(opportunitiesTable).where(eq(opportunitiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
