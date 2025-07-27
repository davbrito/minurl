import { trpcServer } from "@hono/trpc-server";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { logger } from "hono/logger";
import { apiKeyAuth } from "./middleware";
import { createContext } from "./rpc/context";
import { appRouter } from "./rpc/router";
import { visitUrl } from "./shortener";
import type { ServerEnv } from "./types";

const app = new Hono<ServerEnv>();

app.use(logger());

app.use(
  "*",
  sessionMiddleware({
    encryptionKey: env.ENCRYPTION_KEY,
    store: new CookieStore(),
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    }
  })
);

app.get("/x/:id", async (ctx) => {
  const { env, req } = ctx;
  const { id } = req.param();

  if (!id) {
    return ctx.text("Invalid request. Please provide an id in the url.", {
      status: 400
    });
  }

  const fullUrl = await visitUrl(
    ctx.executionCtx,
    env.MinifiedUrls,
    id,
    req.header("referer")
  );

  if (fullUrl === null) {
    return ctx.text("Invalid request. Please provide a valid id in the url.", {
      status: 400
    });
  }

  return ctx.redirect(fullUrl, 303);
});

app.use(
  "/rpc/*",
  apiKeyAuth({ soft: true }),
  trpcServer({
    endpoint: "/rpc",
    router: appRouter,
    createContext
  })
);

export default app;

export type AppType = typeof app;
