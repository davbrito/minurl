import type { ServerEnv } from "@worker/types";
import type { ExecutionContext, Context as HonoContext } from "hono";
import { createContext } from "react-router";
import type { createDb } from "src/db";
import type { AppSession } from "worker/session";

export interface ServerContext {
  env: Env;
  executionCtx: ExecutionContext;
  session: AppSession;
  isAuthenticated: boolean;
  kv: KVNamespace<string>;
  db: ReturnType<typeof createDb>;
  hono: HonoContext<ServerEnv>;
}

export const serverContext = createContext<ServerContext>();
