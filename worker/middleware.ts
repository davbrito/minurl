import type { MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { ServerEnv } from "./types";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 60 * 60 * 24 * 30,
} as const;

export function apiKeyAuth({
  soft = false,
} = {}): MiddlewareHandler<ServerEnv> {
  return async (c, next) => {
    const apiKeyCookie = getCookie(c, "ak");
    const apiKey =
      apiKeyCookie ||
      c.req.header("X-API-Key") ||
      c.req.query("api_key") ||
      c.req.query("apiKey") ||
      c.req.query("key");

    if (!apiKey || apiKey !== c.env.SECRET_KEY) {
      if (apiKeyCookie) {
        // If the cookie exists but the key is invalid, delete it
        deleteCookie(c, "ak");
      }
      c.set("isAuthenticated", false);
      if (!soft) {
        return c.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      // If the API key is valid, set it in the cookie
      if (!apiKeyCookie) {
        setCookie(c, "ak", apiKey, COOKIE_OPTIONS);
      }

      c.set("isAuthenticated", true);
    }

    return next();
  };
}
