import { serverContext } from "@core/contexts";
import { analytics, links } from "@core/db/schema";
import { and, asc, desc, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import type { RouterContextProvider } from "react-router";
import { UAParser } from "ua-parser-js";
import { generateSlug, getSlugToUrlKey } from "./helpers";

function cacheUrl(kv: KVNamespace, slug: string, url: string) {
  return kv.put(getSlugToUrlKey(slug), url);
}

function getCachedUrl(kv: KVNamespace, slug: string) {
  return kv.get(getSlugToUrlKey(slug));
}

export async function createLink(
  context: Readonly<RouterContextProvider>,
  url: string,
  description?: string
): Promise<Link> {
  if (!URL.canParse(url)) {
    throw new Error("Invalid URL");
  }

  const { session, db, kv } = context.get(serverContext);

  const slug = generateSlug(url);

  const sessionId = session.id;

  const result = await db
    .insert(links)
    .values({ slug, url, description, sessionId })
    .returning();

  await cacheUrl(kv, slug, url);

  return result[0];
}

export async function findLink(
  context: Readonly<RouterContextProvider>,
  slug: string
): Promise<Link | undefined> {
  const { db } = context.get(serverContext);
  const link = await db.query.links.findFirst({
    where: { slug }
  });

  return link;
}

export async function getAnalyticsForLink(
  context: Readonly<RouterContextProvider>,
  slug: string,
  limit = 10
) {
  const { db } = context.get(serverContext);

  return await db.query.analytics.findMany({
    where: { slug },
    orderBy: (a) => [desc(a.timestamp)],
    limit
  });
}

export type Link = typeof links.$inferSelect;

export interface PaginationMetadata {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function parseCursor(
  cursor: string | undefined
): { createdAt: Date; slug: string } | undefined {
  if (!cursor) return undefined;
  const idx = cursor.indexOf("/");
  if (idx === -1) throw new Error("Invalid cursor: missing separator");
  const datePart = cursor.slice(0, idx);
  const slugPart = cursor.slice(idx + 1);
  const createdAt = new Date(datePart);
  if (Number.isNaN(createdAt.getTime()))
    throw new Error("Invalid cursor: invalid date");
  if (!slugPart) throw new Error("Invalid cursor: missing slug");
  return { createdAt, slug: slugPart };
}

export async function visitUrl(
  context: Readonly<RouterContextProvider>,
  slug: string,
  request: Request
) {
  const { kv, executionCtx } = context.get(serverContext);
  let url = await getCachedUrl(kv, slug);

  if (!url) {
    url = await fallbackVisitUrl(context, slug);
  }

  if (!url) return null;

  // NO hacemos await aquí. Usamos waitUntil para no bloquear al usuario.
  executionCtx.waitUntil(addVisit(context, slug, request));

  return url;
}

async function fallbackVisitUrl(
  context: Readonly<RouterContextProvider>,
  slug: string
) {
  const { db, kv } = context.get(serverContext);

  const link = await db.query.links.findFirst({
    where: { slug },
    columns: { url: true }
  });

  if (!link) return null;

  // Cache the URL for future requests
  await cacheUrl(kv, slug, link.url);

  return link.url;
}

export async function addVisit(
  context: Readonly<RouterContextProvider>,
  slug: string,
  request: Request
) {
  const { db } = context.get(serverContext);

  const link = await db.query.links.findFirst({
    where: { slug }
  });

  if (!link) return;

  const ua = UAParser(request.headers.get("user-agent") || "");
  const referer = request.headers.get("referer") || null;

  await db.batch([
    db.insert(analytics).values({
      slug: slug,
      country: request.cf?.country as string,
      city: request.cf?.city as string,
      browser: ua.browser.name || "Unknown",
      device: ua.device.type || "desktop",
      referer
    }),
    db
      .update(links)
      .set({
        visitCount: sql`${links.visitCount} + 1`,
        lastClickedAt: sql`(unixepoch())`
      })
      .where(eq(links.slug, slug))
  ]);
}

export async function deleteLink(
  context: Readonly<RouterContextProvider>,
  slug: string
) {
  const { db, kv } = context.get(serverContext);

  const link = await db.query.links.findFirst({
    where: { slug }
  });

  if (!link) return;

  await db.delete(links).where(eq(links.slug, slug));
  await kv.delete(getSlugToUrlKey(slug));
}

export async function listLinks(
  context: Readonly<RouterContextProvider>,
  params?: { after?: string; before?: string; limit?: number }
): Promise<{ links: Link[]; meta: PaginationMetadata }> {
  const { db } = context.get(serverContext);

  const limit = params?.limit ?? 10;
  const after = params?.after;
  const before = params?.before;

  const afterCursor = parseCursor(after);
  const beforeCursor = parseCursor(before);

  const where = beforeCursor
    ? // Fetch items newer than the start cursor, then reverse to keep descending order
      or(
        gt(links.createdAt, beforeCursor.createdAt),
        and(
          eq(links.createdAt, beforeCursor.createdAt),
          gt(links.slug, beforeCursor.slug)
        )
      )
    : // Fetch items older than the end cursor
      afterCursor
      ? or(
          lt(links.createdAt, afterCursor.createdAt),
          and(
            eq(links.createdAt, afterCursor.createdAt),
            lt(links.slug, afterCursor.slug)
          )
        )
      : // First page
        undefined;

  const rows: Link[] = await db
    .select()
    .from(links)
    .where(where)
    .orderBy((links) =>
      before
        ? [asc(links.createdAt), asc(links.slug)]
        : [desc(links.createdAt), desc(links.slug)]
    )
    .limit(limit + 1);

  if (before) {
    // rows are ascending; reverse to descending for client
    rows.reverse();
  }

  const hasMore = rows.length > limit;
  if (hasMore) {
    if (before) rows.shift();
    else rows.pop();
  }

  const start = rows[0];
  const end = rows[rows.length - 1];

  const startCursor = start
    ? `${start.createdAt.toISOString()}/${start.slug}`
    : undefined;
  const endCursor = end
    ? `${end.createdAt.toISOString()}/${end.slug}`
    : undefined;

  // Determine pagination flags from fetched rows and request direction to avoid extra queries.

  let hasPreviousPage = false;
  let hasNextPage = false;

  if (before) {
    // We fetched newer items than `before`. There is a next page (the page containing `before`).
    hasNextPage = true;
    hasPreviousPage = hasMore;
  } else if (after) {
    // We fetched older items than `after`. There is a previous page (the page containing `after`).
    hasPreviousPage = true;
    hasNextPage = hasMore;
  } else {
    // First page
    hasPreviousPage = false;
    hasNextPage = hasMore;
  }

  return {
    links: rows,
    meta: { startCursor, endCursor, hasNextPage, hasPreviousPage }
  };
}

export async function listLinksBySession(
  context: Readonly<RouterContextProvider>
): Promise<Link[]> {
  const { db, session } = context.get(serverContext);

  if (!session.id) return [];

  return await db.query.links.findMany({ where: { sessionId: session.id } });
}

export async function claimAnonymousLinks(
  context: Readonly<RouterContextProvider>,
  userId: string
) {
  const { db, session } = context.get(serverContext);

  if (!userId || !session.id) return;

  // Actualizar todos los links que tengan MI session_id pero NO tengan user_id
  await db
    .update(links)
    .set({ userId, sessionId: null })
    .where(
      and(
        eq(links.sessionId, session.id),
        isNull(links.userId) // Importar isNull de drizzle-orm
      )
    );
}
