import type { MiddlewareHandler } from "hono";
import type { ServerEnv } from "./types";

export function apiKeyAuth({
  soft = false
} = {}): MiddlewareHandler<ServerEnv> {
  return async (c, next) => {
    const session = c.get("session");
    const apiKeyCookie = session.get("adminKey");
    const apiKey =
      apiKeyCookie ||
      c.req.header("X-API-Key") ||
      c.req.query("api_key") ||
      c.req.query("apiKey") ||
      c.req.query("key");

    if (!apiKey || apiKey !== c.env.SECRET_KEY) {
      if (apiKeyCookie) {
        session.forget("adminKey");
      }
      c.set("isAuthenticated", false);
      if (!soft) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      // If the API key is valid, set it in the cookie
      if (!apiKeyCookie) {
        session.set("adminKey", apiKey);
      }

      c.set("isAuthenticated", true);
    }

    return next();
  };
}
