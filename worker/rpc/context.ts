import type { Context } from "hono";
import type { ServerEnv } from "../types";

export const createContext = async (
  //   ops: FetchCreateContextFnOptions,
  hono: Context<ServerEnv>
) => {
  return {
    isAuthenticated: hono.get("isAuthenticated") ?? false,
    env: hono.env,
    hono: hono
  };
};

export type RpcContext = Awaited<ReturnType<typeof createContext>>;
