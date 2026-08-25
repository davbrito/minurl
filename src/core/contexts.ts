import type { createDb } from "@core/db";
import type { AppSession } from "@worker/session";
import type { ServerEnv } from "@worker/types";
import type { ExecutionContext, Context as HonoContext } from "hono";
import { createContext } from "react-router";

export interface ServerContext {
  env: Env;
  executionCtx: ExecutionContext;
  session: AppSession;
  isAuthenticated: boolean;
  kv: KVNamespace<string>;
  db: ReturnType<typeof createDb>;
  hono: HonoContext<ServerEnv>;
}

// react-router's createContext is a router context, not a React UI context;
// @eslint-react's naming convention rule assumes the latter.
// eslint-disable-next-line @eslint-react/naming-convention-context-name
export const serverContext = createContext<ServerContext>();
