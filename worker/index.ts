import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { createContext } from "./rpc/context";
import { appRouter } from "./rpc/router";
import { visitUrl } from "./shortener";
import type { ServerEnv } from "./types";
import { apiKeyAuth } from "./middleware";

const app = new Hono<ServerEnv>();

app.use(logger());

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

app.use("/rpc/*", apiKeyAuth({ soft: true }), async (c) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext() {
      return createContext(c);
    }
  });
});

export default app;

export type AppType = typeof app;
