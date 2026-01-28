import type { ExecutionContext } from "hono";
import { createContext } from "react-router";
import type { AppSession } from "worker/session";

export interface ServerContext {
  env: Env;
  executionCtx: ExecutionContext;
  session: AppSession;
  isAuthenticated: boolean;
  kv: KVNamespace<string>;
}

export const serverContext = createContext<ServerContext>();
