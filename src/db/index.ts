import { drizzle } from "drizzle-orm/d1";
import { relations } from "./relations";
import * as schema from "./schema";

export function createDb(db: D1Database) {
  return drizzle(db, { schema, relations });
}
