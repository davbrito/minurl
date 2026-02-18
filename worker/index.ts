import { visitUrl } from "@features/shortener/links";
import { env } from "cloudflare:workers";
import { Hono, type Context } from "hono";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { logger } from "hono/logger";
import { createRequestHandler, RouterContextProvider } from "react-router";
import { createDb } from "src/db";
import { serverContext } from "../lib/contexts";
import { apiKeyAuth } from "./middleware";
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
  const { req } = ctx;
  const { id } = req.param();

  if (!id) {
    return ctx.text("Invalid request. Please provide an id in the url.", {
      status: 400
    });
  }
  const context = createRouterContext(ctx);
  const fullUrl = await visitUrl(context, id, req.raw);

  if (fullUrl === null) {
    return ctx.text("Invalid request. Please provide a valid id in the url.", {
      status: 400
    });
  }

  return ctx.redirect(fullUrl, 303);
});

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

app.use("*", apiKeyAuth({ soft: true }), (c) => {
  const context = createRouterContext(c);

  return requestHandler(c.req.raw, context);
});

export default app;

export type AppType = typeof app;

function createRouterContext(c: Context<ServerEnv>) {
  const context = new RouterContextProvider();

  context.set(serverContext, {
    env: c.env,
    kv: c.env.KV,
    executionCtx: c.executionCtx,
    session: c.get("session"),
    isAuthenticated: c.get("isAuthenticated"),
    db: createDb(c.env.DB)
  });

  return context;
}
