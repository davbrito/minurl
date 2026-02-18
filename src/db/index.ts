import { drizzle } from "drizzle-orm/d1";
import { relations } from "./relations";
import * as schema from "./schema";

export function createDb(env: Env) {
  return drizzle(env.DB, { schema, relations });
}
