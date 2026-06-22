import { Router } from "express";
import { db, postsTable, commentsTable, postLikesTable, postReportsTable, usersTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { CreatePostBody, CreateCommentBody, ReportPostBody, UpdatePostBody } from "@workspace/api-zod";

const router = Router();

const BANNED_WORDS = ["إرهاب", "كره", "عنصرية", "سب", "شتيمة"];

function moderateContent(text: string): boolean {
  return BANNED_WORDS.some((w) => text.includes(w));
}

async function enrichPost(row: typeof postsTable.$inferSelect, userId?: number) {
  const [author] = await db.select({ fullName: usersTable.fullName, fullNameAr: usersTable.fullNameAr, avatarUrl: usersTable.avatarUrl })
    .from(usersTable).where(eq(usersTable.id, row.userId));

  let likedByMe = false;
  if (userId) {
    const [like] = await db.select().from(postLikesTable)
      .where(and(eq(postLikesTable.postId, row.id), eq(postLikesTable.userId, userId)));
    likedByMe = !!like;
  }

  return {
    id: row.id,
    userId: row.userId,
    authorName: author?.fullName ?? "عضو",
    authorNameAr: author?.fullNameAr ?? "عضو",
    authorAvatar: author?.avatarUrl ?? null,
    content: row.content,
    imageUrl: row.imageUrl,
    likesCount: row.likesCount,
    commentsCount: row.commentsCount,
    isApproved: row.isApproved,
    isPinned: row.isPinned,
    isHidden: row.isHidden,
    reportCount: row.reportCount,
    likedByMe,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/posts", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const limit = Number(req.query.limit ?? 20);
    const offset = Number(req.query.offset ?? 0);

    const rows = await db.select().from(postsTable)
      .where(and(eq(postsTable.isHidden, false), eq(postsTable.isApproved, true)))
      .orderBy(desc(postsTable.isPinned), desc(postsTable.createdAt))
      .limit(limit).offset(offset);

    const enriched = await Promise.all(rows.map((r) => enrichPost(r, userId)));
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "يجب تسجيل الدخول" }); return; }

    const parsed = CreatePostBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const isHidden = moderateContent(parsed.data.content);
    const [row] = await db.insert(postsTable).values({
      userId,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl ?? null,
      isHidden,
    }).returning();

    res.status(201).json(await enrichPost(row, userId));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/posts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = UpdatePostBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const [row] = await db.update(postsTable).set(parsed.data).where(eq(postsTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }

    res.json(await enrichPost(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(commentsTable).where(eq(commentsTable.postId, id));
    await db.delete(postLikesTable).where(eq(postLikesTable.postId, id));
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts/:id/like", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "يجب تسجيل الدخول" }); return; }
    const postId = Number(req.params.id);

    const [existing] = await db.select().from(postLikesTable)
      .where(and(eq(postLikesTable.postId, postId), eq(postLikesTable.userId, userId)));

    let liked: boolean;
    if (existing) {
      await db.delete(postLikesTable).where(eq(postLikesTable.id, existing.id));
      await db.update(postsTable).set({ likesCount: sql`${postsTable.likesCount} - 1` }).where(eq(postsTable.id, postId));
      liked = false;
    } else {
      await db.insert(postLikesTable).values({ postId, userId });
      await db.update(postsTable).set({ likesCount: sql`${postsTable.likesCount} + 1` }).where(eq(postsTable.id, postId));
      liked = true;
    }

    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
    res.json({ liked, likesCount: post?.likesCount ?? 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/posts/:id/comments", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const rows = await db.select().from(commentsTable)
      .where(and(eq(commentsTable.postId, postId), eq(commentsTable.isHidden, false)))
      .orderBy(desc(commentsTable.createdAt));

    const enriched = await Promise.all(rows.map(async (c) => {
      const [author] = await db.select({ fullName: usersTable.fullName, fullNameAr: usersTable.fullNameAr, avatarUrl: usersTable.avatarUrl })
        .from(usersTable).where(eq(usersTable.id, c.userId));
      return {
        id: c.id,
        postId: c.postId,
        userId: c.userId,
        authorName: author?.fullName ?? "عضو",
        authorNameAr: author?.fullNameAr ?? "عضو",
        authorAvatar: author?.avatarUrl ?? null,
        content: c.content,
        isHidden: c.isHidden,
        createdAt: c.createdAt.toISOString(),
      };
    }));
    res.json(enriched);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts/:id/comments", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "يجب تسجيل الدخول" }); return; }

    const postId = Number(req.params.id);
    const parsed = CreateCommentBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const isHidden = moderateContent(parsed.data.content);
    const [comment] = await db.insert(commentsTable).values({ postId, userId, content: parsed.data.content, isHidden }).returning();
    await db.update(postsTable).set({ commentsCount: sql`${postsTable.commentsCount} + 1` }).where(eq(postsTable.id, postId));

    const [author] = await db.select({ fullName: usersTable.fullName, fullNameAr: usersTable.fullNameAr, avatarUrl: usersTable.avatarUrl })
      .from(usersTable).where(eq(usersTable.id, userId));

    res.status(201).json({
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      authorName: author?.fullName ?? "عضو",
      authorNameAr: author?.fullNameAr ?? "عضو",
      authorAvatar: author?.avatarUrl ?? null,
      content: comment.content,
      isHidden: comment.isHidden,
      createdAt: comment.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts/:id/report", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "يجب تسجيل الدخول" }); return; }

    const postId = Number(req.params.id);
    const parsed = ReportPostBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    await db.insert(postReportsTable).values({ postId, userId, reason: parsed.data.reason });
    await db.update(postsTable).set({ reportCount: sql`${postsTable.reportCount} + 1` }).where(eq(postsTable.id, postId));

    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
    if (post && post.reportCount >= 3) {
      await db.update(postsTable).set({ isHidden: true }).where(eq(postsTable.id, postId));
    }

    res.json({ status: "reported" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
