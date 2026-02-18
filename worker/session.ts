import type { Session } from "@hono/session";

export type AppSession = Session<SessionData>;

export interface SessionData {
  adminKey?: string;
}
