import { Session } from "hono-sessions";
import type { SessionData } from "./session";

interface ServerVariables {
  isAuthenticated: boolean;
  session: Session<SessionData>;
}

export type ServerEnv = {
  Bindings: Env;
  Variables: ServerVariables;
};
