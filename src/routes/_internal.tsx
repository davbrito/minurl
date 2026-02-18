import { listLinks } from "@features/shortener/links";
import { deleteCookie, setCookie } from "hono/cookie";
import { serverContext } from "lib/contexts";
import Inspect from "../components/inspect";
import type { Route } from "./+types/_internal";

const DEFAULT_PAGE_SIZE = 10;

const PREV_CURSOR_COOKIE_KEY = "minurl_prev_cursors_flash";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { isAuthenticated, hono } = context.get(serverContext);

  if (!isAuthenticated) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let limit =
    Number(searchParams.get("limit") || DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE;
  limit = Math.min(limit, 50); // Max limit of 50
  const cursor = searchParams.get("cursor") || undefined;

  const { links, nextCursor } = await listLinks(context, cursor, limit);

  const prevCursorsFromCookie =
    deleteCookie(hono, PREV_CURSOR_COOKIE_KEY) ?? "";
  let prevCursors = prevCursorsFromCookie.split(",").filter(Boolean);

  if (cursor) {
    prevCursors = prevCursors.filter((c) => c !== cursor);
  } else {
    prevCursors = [];
  }

  const prevCursor = prevCursors.at(-1) || undefined;

  if (cursor) {
    setCookie(
      hono,
      PREV_CURSOR_COOKIE_KEY,
      prevCursors.concat(cursor).join(","),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 // 1 hour
      }
    );
  }

  return {
    links,
    prevCursor,
    cursor,
    nextCursor,
    baseUrl: url.origin
  };
}

export default function Internal({ loaderData }: Route.ComponentProps) {
  return (
    <Inspect
      links={loaderData.links}
      nextCursor={loaderData.nextCursor}
      cursor={loaderData.cursor}
      prevCursor={loaderData.prevCursor}
      baseUrl={loaderData.baseUrl}
    />
  );
}
