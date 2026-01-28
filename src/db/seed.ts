import "dotenv/config";
import { users } from "./schema";
import { db } from ".";
import { hash } from "bcryptjs";
import { sql } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

async function seed() {
  await db.insert(users).values([
    {
      name: "Admin User",
      email: "admin@example.com",
      username: "useradmin",
      password: await hash("Admin@123", 10),
    },
    {
      name: "Manager User",
      email: "manager@example.com",
      username: "usermanager",
      password: await hash("Manager@123", 10),
    },
    {
      name: "Member User",
      email: "member@example.com",
      username: "usermember",
      password: await hash("member@123", 10),
    },
  ]);

  await db.execute(sql`
    INSERT INTO categories (id, name, is_system)
    SELECT 1, 'Sem categoria', true
    WHERE NOT EXISTS (
      SELECT 1 FROM categories WHERE id = 1
    );
  `);

  console.log("Seed users executado");
  process.exit(0);
}

export async function down() {
  await db.execute(sql`
    DELETE FROM categories WHERE id = 1 AND is_system = true;
  `);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

down().catch((err) => {
  console.error(err);
  process.exit(1);
});
