import { Router } from "express";
import { db, knowledgeTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  ListKnowledgeQueryParams,
  CreateKnowledgeBody,
  GetKnowledgeParams,
  DeleteKnowledgeParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/knowledge", async (req, res) => {
  try {
    const parsed = ListKnowledgeQueryParams.safeParse(req.query);
    const { category, limit = 50 } = parsed.success ? parsed.data : {};

    let query = db.select().from(knowledgeTable).$dynamic();
    if (category) query = query.where(eq(knowledgeTable.category, category));

    const rows = await query
      .orderBy(asc(knowledgeTable.order), asc(knowledgeTable.createdAt))
      .limit(Number(limit ?? 50));

    res.json(rows.map(formatKnowledge));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/knowledge", async (req, res) => {
  try {
    const parsed = CreateKnowledgeBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [row] = await db.insert(knowledgeTable).values(parsed.data).returning();
    res.status(201).json(formatKnowledge(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/knowledge/:id", async (req, res) => {
  try {
    const { id } = GetKnowledgeParams.parse({ id: Number(req.params.id) });
    const [row] = await db.select().from(knowledgeTable).where(eq(knowledgeTable.id, id));
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(formatKnowledge(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/knowledge/:id", async (req, res) => {
  try {
    const { id } = DeleteKnowledgeParams.parse({ id: Number(req.params.id) });
    await db.delete(knowledgeTable).where(eq(knowledgeTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatKnowledge(row: typeof knowledgeTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    titleAr: row.titleAr,
    content: row.content,
    contentAr: row.contentAr,
    category: row.category,
    order: row.order,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;
