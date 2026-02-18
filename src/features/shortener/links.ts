import { eq, sql } from "drizzle-orm";
import { serverContext } from "@core/contexts";
import type { RouterContextProvider } from "react-router";
import { analytics, links } from "@core/db/schema";
import { UAParser } from "ua-parser-js";
import { generateSlug, getSlugToUrlKey } from "./helpers";

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

  await kv.put(getSlugToUrlKey(slug), url);

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

export type Link = typeof links.$inferSelect;

export interface PaginationMetadata {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function visitUrl(
  context: Readonly<RouterContextProvider>,
  slug: string,
  request: Request
) {
  const { kv, executionCtx } = context.get(serverContext);
  const url = await kv.get(getSlugToUrlKey(slug));
  if (url === null) return null;

  // NO hacemos await aquí. Usamos waitUntil para no bloquear al usuario.
  executionCtx.waitUntil(addVisit(context, slug, request));

  return url;
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

  const partsAfter = after ? (after.split("/") as [string, string]) : undefined;
  const afterCreated = partsAfter ? new Date(partsAfter[0]) : undefined;
  const afterSlug = partsAfter ? partsAfter[1] : undefined;

  const partsBefore = before
    ? (before.split("/") as [string, string])
    : undefined;
  const beforeCreated = partsBefore ? new Date(partsBefore[0]) : undefined;
  const beforeSlug = partsBefore ? partsBefore[1] : undefined;

  let rows: Link[] = [];

  if (before) {
    // Fetch items newer than the start cursor, then reverse to keep descending order
    rows = await db.query.links.findMany({
      where: {
        OR: [
          { createdAt: { gt: beforeCreated } },
          {
            AND: [
              { createdAt: { eq: beforeCreated } },
              { slug: { gt: beforeSlug } }
            ]
          }
        ]
      },
      orderBy: (link, { asc }) => [asc(link.createdAt), asc(link.slug)],
      limit: limit + 1
    });

    // rows are ascending; reverse to descending for client
    rows = rows.reverse();
  } else if (after) {
    // Fetch items older than the end cursor
    rows = await db.query.links.findMany({
      where: {
        OR: [
          { createdAt: { lt: afterCreated } },
          {
            AND: [
              { createdAt: { eq: afterCreated } },
              { slug: { lt: afterSlug } }
            ]
          }
        ]
      },
      orderBy: (link, { desc }) => [desc(link.createdAt), desc(link.slug)],
      limit: limit + 1
    });
  } else {
    // First page
    rows = await db.query.links.findMany({
      orderBy: (link, { desc }) => [desc(link.createdAt), desc(link.slug)],
      limit: limit + 1
    });
  }

  const hasMore = rows.length > limit;
  if (hasMore) rows = rows.slice(0, limit);

  const start = rows[0];
  const end = rows[rows.length - 1];

  const startCursor = start
    ? `${start.createdAt.toISOString()}/${start.slug}`
    : undefined;
  const endCursor = end
    ? `${end.createdAt.toISOString()}/${end.slug}`
    : undefined;

  // compute has_previous_page (are there items newer than start?)
  let hasPreviousPage = false;
  if (start) {
    const exists = await db.query.links.findFirst({
      where: {
        OR: [
          { createdAt: { gt: start.createdAt } },
          {
            AND: [
              { createdAt: { eq: start.createdAt } },
              { slug: { gt: start.slug } }
            ]
          }
        ]
      }
    });
    hasPreviousPage = !!exists;
  }

  // compute has_next_page (are there items older than end?)
  let hasNextPage = false;
  if (end) {
    const exists = await db.query.links.findFirst({
      where: {
        OR: [
          { createdAt: { lt: end.createdAt } },
          {
            AND: [
              { createdAt: { eq: end.createdAt } },
              { slug: { lt: end.slug } }
            ]
          }
        ]
      }
    });
    hasNextPage = !!exists;
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
