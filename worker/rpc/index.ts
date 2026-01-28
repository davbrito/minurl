import { initTRPC, TRPCError } from "@trpc/server";
import type { RpcContext } from "./context";

export const t = initTRPC.context<RpcContext>().create();
export const router = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated to access this resource."
    });
  }

  return next({ ctx: { ...ctx, isAuthenticated: true } });
});
