import type { Session } from "@hono/session";
import type { SessionData } from "./session";

interface ServerVariables {
  isAuthenticated: boolean;
  session: Session<SessionData>;
}

export type ServerEnv = {
  Bindings: Env;
  Variables: ServerVariables;
};
