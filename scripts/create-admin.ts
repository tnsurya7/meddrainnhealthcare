import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "@node-rs/argon2";
import * as readline from "readline";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("=== Biomed Institute: Neon Administrator Provisioning Utility ===");

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes("placeholder")) {
    console.error("Error: DATABASE_URL is required in .env.local to provision administrator.");
    console.error("Example: DATABASE_URL=\"postgresql://neondb_owner:***@ep-***.us-east-2.aws.neon.tech/neondb?sslmode=require\"");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  const email =
    process.env.ADMIN_EMAIL ||
    (await prompt("Enter administrator email (e.g. admin@biomed.institute): "));

  if (!email || !email.includes("@")) {
    console.error("Error: A valid email address is required.");
    process.exit(1);
  }

  const cleanEmail = email.toLowerCase().trim();

  const name =
    process.env.ADMIN_NAME ||
    (await prompt("Enter administrator name (default: Biomed Administrator): ")) ||
    "Biomed Administrator";

  const password =
    process.env.ADMIN_PASSWORD ||
    (await prompt("Enter secure password (min 8 characters): "));

  if (!password || password.length < 8) {
    console.error("Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`\nHashing password using Argon2id for: ${cleanEmail}...`);
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // Check if admin already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, cleanEmail))
    .limit(1);

  if (existingUser) {
    console.log(`User ${cleanEmail} exists. Updating credentials and confirming admin role...`);
    await db
      .update(users)
      .set({
        name,
        passwordHash,
        role: "admin",
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id));

    console.log("\n=======================================================");
    console.log("✓ SUCCESS: Administrator credentials successfully updated in Neon!");
    console.log(`  Email: ${cleanEmail}`);
    console.log(`  Name:  ${name}`);
    console.log(`  Role:  admin`);
    console.log("=======================================================\n");
  } else {
    console.log(`Creating new administrator account for ${cleanEmail}...`);
    await db.insert(users).values({
      name,
      email: cleanEmail,
      passwordHash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("\n=======================================================");
    console.log("✓ SUCCESS: Administrator successfully created in Neon PostgreSQL!");
    console.log(`  Email: ${cleanEmail}`);
    console.log(`  Name:  ${name}`);
    console.log(`  Role:  admin`);
    console.log("=======================================================\n");
  }
}

main().catch((err) => {
  console.error("Fatal error during administrator provisioning:", err);
  process.exit(1);
});
