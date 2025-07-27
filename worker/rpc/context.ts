import type { Context } from "hono";
import type { ServerEnv } from "../types";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(
  _ops: FetchCreateContextFnOptions,
  hono: Context<ServerEnv>
) {
  return {
    isAuthenticated: hono.get("isAuthenticated") ?? false,
    env: hono.env,
    hono: hono,
    session: hono.get("session")
  };
}

export type RpcContext = Awaited<ReturnType<typeof createContext>>;
