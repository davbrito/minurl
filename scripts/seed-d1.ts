import "dotenv/config";

import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/d1";
import { relations } from "../src/core/db/relations.ts";
import * as schema from "../src/core/db/schema.ts";

// Seed Cloudflare D1 with random links via the D1 HTTP API.
// Requires env: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN

const db = drizzle({} as any, { schema, relations });

const argv = process.argv.slice(2);
const count = Number(argv[0] || 100);
const domain = argv[1] || "https://example.com";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

if (!accountId || !databaseId || !token) {
  console.error(
    "Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID or CLOUDFLARE_D1_TOKEN in env"
  );
  process.exit(1);
}
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`;

async function main() {
  for (let i = 0; i < count; i++) {
    const slug = faker.string.alpha({ length: 8, casing: "lower" });
    const url = `${domain}/r/${slug}`;
    const description = faker.lorem.sentence();
    const visitCount = faker.number.int({ min: 0, max: 2000 });
    // spread createdAt over a recent range
    const createdAt = faker.date.recent({ days: 365 - (count - i) });
    const lastClickedAt =
      Math.random() > 0.7
        ? faker.date.between({ from: createdAt, to: new Date() })
        : null;
    const userId =
      Math.random() > 0.85
        ? `user_${faker.string.numeric({ length: { min: 10, max: 50 } })}`
        : null;
    const sessionId = userId ? null : `sess_${faker.string.alphanumeric(20)}`;

    const insert = db.insert(schema.links).values({
      slug,
      url,
      description,
      visitCount,
      createdAt,
      lastClickedAt,
      userId,
      sessionId
    });
    const query = insert.toSQL();

    await executeSql(query.sql, query.params);
  }
}

void main();

async function executeSql(sql: string, params: any[]) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sql, params })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error executing SQL:", error);
    process.exit(1);
  }

  console.log(`Successfully inserted ${count} records into D1`);
  console.log("Response:", await response.json());
}
