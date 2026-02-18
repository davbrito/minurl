import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { logger } from "hono/logger";
import { createRequestHandler, RouterContextProvider } from "react-router";
import { serverContext } from "../lib/contexts";
import { apiKeyAuth } from "./middleware";
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
    env.KV,
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

app.use("*", apiKeyAuth({ soft: true }), (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
  );

  const context = new RouterContextProvider();

  context.set(serverContext, {
    env: c.env,
    kv: c.env.KV,
    executionCtx: c.executionCtx,
    session: c.get("session"),
    isAuthenticated: c.get("isAuthenticated")
  });

  return requestHandler(c.req.raw, context);
});

export default app;

export type AppType = typeof app;
