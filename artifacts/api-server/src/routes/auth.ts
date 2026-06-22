import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody, UpdateAccessibilityBody, UpdateProfileBody } from "@workspace/api-zod";

const router = Router();

function formatUser(row: typeof usersTable.$inferSelect) {
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

router.post("/auth/register", async (req, res) => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { email, password, fullName, fullNameAr, location, phone } = parsed.data;

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "البريد الإلكتروني مستخدم بالفعل" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      fullName,
      fullNameAr,
      location: location ?? null,
      phone: phone ?? null,
    }).returning();

    (req.session as any).userId = user.id;
    res.status(201).json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { email, password } = parsed.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || !user.isActive) {
      res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
      return;
    }

    (req.session as any).userId = user.id;
    res.json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", async (req, res) => {
  req.session.destroy(() => {
    res.json({ status: "ok" });
  });
});

router.get("/auth/me", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      res.status(401).json({ error: "غير مسجل" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      res.status(401).json({ error: "المستخدم غير موجود" });
      return;
    }
    res.json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/auth/me/accessibility", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "غير مسجل" }); return; }

    const parsed = UpdateAccessibilityBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, userId)).returning();
    res.json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/auth/me/profile", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) { res.status(401).json({ error: "غير مسجل" }); return; }

    const parsed = UpdateProfileBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, userId)).returning();
    res.json(formatUser(user));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { formatUser };
export default router;
