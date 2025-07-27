import type { Session } from "hono-sessions";

export interface SessionData {
  adminKey: string;
  createdUrlIds: string[];
}

export function addCreatedUrlId(session: Session<SessionData>, id: string) {
  const createdUrlIds = session.get("createdUrlIds") || [];
  if (!createdUrlIds.includes(id)) {
    createdUrlIds.push(id);
    session.set("createdUrlIds", createdUrlIds);
  }
}

export function removeCreatedUrlId(session: Session<SessionData>, id: string) {
  const createdUrlIds = session.get("createdUrlIds") || [];
  session.set(
    "createdUrlIds",
    createdUrlIds.filter((urlId) => urlId !== id)
  );
}
