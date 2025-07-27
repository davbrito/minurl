import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { addCreatedUrlId, removeCreatedUrlId } from "../session";
import {
  getMinifiedPath,
  getUrlKey,
  getUrls,
  getUrlWithMetadata,
  removeUrl,
  storeUrl,
  type UrlMetadata
} from "../shortener";
import { protectedProcedure, publicProcedure, router } from "./index";

export const appRouter = router({
  shorten: publicProcedure
    .input(
      z.object({
        url: z.url()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { env } = ctx;
      const id = await storeUrl(env.MinifiedUrls, input.url);
      const minifiedUrl = getMinifiedPath(id);

      ctx.hono.executionCtx.waitUntil(
        Promise.resolve().then(() => addCreatedUrlId(ctx.session, id))
      );

      return { id, minifiedUrl };
    }),
  isAuthenticated: publicProcedure.query(({ ctx }) => {
    return { isAuthenticated: ctx.isAuthenticated };
  }),

  listUrls: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(100),
        cursor: z.string().optional()
      })
    )
    .query(
      async ({
        input,
        ctx
      }): Promise<{
        urls: { id: string; url: string; visits: number }[];
        nextCursor: string | undefined;
      }> => {
        const { env } = ctx;
        const { limit, cursor } = input;

        const keys = await env.MinifiedUrls.list<UrlMetadata>({
          cursor,
          limit,
          prefix: getUrlKey()
        });

        return {
          urls: keys.keys.map((key) => ({
            id: key.metadata!.id,
            visits: key.metadata!.visits ?? 0,
            url: key.name.replace(getUrlKey(), "")
          })),
          nextCursor: keys.list_complete ? undefined : keys.cursor
        };
      }
    ),
  deleteUrl: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { env } = ctx;
      await removeUrl(env.MinifiedUrls, input.id);

      ctx.hono.executionCtx.waitUntil(
        Promise.resolve().then(() => removeCreatedUrlId(ctx.session, input.id))
      );

      return { success: true };
    }),
  myUrls: publicProcedure.query(async ({ ctx }) => {
    const { env, session } = ctx;
    const ids = session.get("createdUrlIds") || [];
    return getUrls(env.MinifiedUrls, ids);
  }),
  getUrlById: publicProcedure
    .input(z.object({ id: z.string().nonempty() }))
    .query(async ({ input, ctx }) => {
      const { env } = ctx;
      const item = getUrlWithMetadata(env.MinifiedUrls, input.id);

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `URL with id ${input.id} not found`
        });
      }

      return item;
    })
});

export type AppRouter = typeof appRouter;
