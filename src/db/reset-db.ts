import { db as connection } from "./index";
import { sql } from "drizzle-orm";

async function reset() {
  const db = connection;

  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  await db.execute(sql`DROP TABLE IF EXISTS todos`);
  await db.execute(sql`DROP TABLE IF EXISTS users`);
  await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations`);
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

  console.log("✅ Database reset!");
  process.exit(0);
}

reset();
