import type { Session } from "hono-sessions";

export type AppSession = Session<SessionData>;

export interface SessionData {
  adminKey: string;
  createdUrlIds: string[];
  prevCursors?: string[];
}

export function addCreatedUrlId(session: AppSession, id: string) {
  const createdUrlIds = session.get("createdUrlIds") || [];
  if (!createdUrlIds.includes(id)) {
    createdUrlIds.push(id);
    session.set("createdUrlIds", createdUrlIds);
  }
}

export function removeCreatedUrlId(session: AppSession, id: string) {
  const createdUrlIds = session.get("createdUrlIds") || [];
  session.set(
    "createdUrlIds",
    createdUrlIds.filter((urlId) => urlId !== id)
  );
}
