import { serverContext } from "lib/contexts";
import { getUrlKey, type UrlMetadata } from "worker/shortener";
import Inspect from "../components/inspect";
import type { Route } from "./+types/_internal";

const DEFAULT_PAGE_SIZE = 10;

export async function loader({ context, request }: Route.LoaderArgs) {
  const { kv, isAuthenticated, session } = context.get(serverContext);

  if (!isAuthenticated) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let limit =
    Number(searchParams.get("limit") || DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE;
  limit = Math.min(limit, 50); // Max limit of 50
  const cursor = searchParams.get("cursor") || undefined;

  const keys = await kv.list<UrlMetadata>({
    cursor,
    limit,
    prefix: getUrlKey()
  });

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
    urls: keys.keys.map((key) => ({
      id: key.metadata!.id,
      visits: key.metadata!.visits ?? 0,
      url: key.name.replace(getUrlKey(), "")
    })),

    prevCursor,
    cursor,
    nextCursor: keys.list_complete ? undefined : keys.cursor,
    baseUrl: url.origin
  };
}

export default function Internal({ loaderData }: Route.ComponentProps) {
  return (
    <Inspect
      urls={loaderData.urls}
      nextCursor={loaderData.nextCursor}
      cursor={loaderData.cursor}
      prevCursor={loaderData.prevCursor}
      baseUrl={loaderData.baseUrl}
    />
  );
}
