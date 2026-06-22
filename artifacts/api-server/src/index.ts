process.env.NODE_ENV = process.env.NODE_ENV || "development";

import app from "./app";
import { logger } from "./lib/logger";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function seedAdmin() {
  try {
    const adminEmail = "smadiabdalrahman446@gmail.com";
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail));
    if (!existing) {
      const passwordHash = await bcrypt.hash("Abd@2004", 12);
      await db.insert(usersTable).values({
        email: adminEmail,
        passwordHash,
        fullName: "Abdulrahman Smadi",
        fullNameAr: "عبدالرحمن الصمادي",
        role: "admin",
        phone: "0775775812",
        location: "عجلون",
        isActive: true,
      });
      logger.info("SUCCESS: Default admin user seeded (smadiabdalrahman446@gmail.com / Abd@2004)");
    } else {
      logger.info("Admin user already exists, skipping seeding.");
    }
  } catch (error) {
    logger.error({ error }, "Failed to seed default admin user");
  }
}

// Seed admin before server starts listening
seedAdmin().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
});
