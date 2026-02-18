import { listLinks } from "@features/shortener/links";
import { serverContext } from "lib/contexts";
import Inspect from "../components/inspect";
import type { Route } from "./+types/_internal";

const DEFAULT_PAGE_SIZE = 10;

export async function loader({ context, request }: Route.LoaderArgs) {
  const { isAuthenticated, session } = context.get(serverContext);

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

  let prevCursors = session.get("prevCursors") || [];

  if (cursor) {
    prevCursors = prevCursors.filter((c) => c !== cursor);
  } else {
    prevCursors = [];
  }

  const prevCursor = prevCursors.at(-1) || undefined;

  if (cursor) {
    session.flash("prevCursors", prevCursors.concat(cursor));
  } else {
    session.forget("prevCursors");
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
