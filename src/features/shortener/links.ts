import { addCreatedUrlId, removeCreatedUrlId } from "@worker/session";
import { eq, sql } from "drizzle-orm";
import { serverContext } from "lib/contexts";
import type { RouterContextProvider } from "react-router";
import { analytics, links } from "src/db/schema";
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

  const result = await db
    .insert(links)
    .values({ slug, url, description })
    .returning();

  await kv.put(getSlugToUrlKey(slug), url);

  addCreatedUrlId(session, slug);

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
  const { db, kv, session } = context.get(serverContext);

  const link = await db.query.links.findFirst({
    where: { slug }
  });

  if (!link) return;

  await db.delete(links).where(eq(links.slug, slug));
  await kv.delete(getSlugToUrlKey(slug));

  removeCreatedUrlId(session, slug);
}

export async function listLinks(
  context: Readonly<RouterContextProvider>,
  cursor?: string,
  limit: number = 10
): Promise<{
  links: Link[];
  nextCursor?: string;
}> {
  const { db } = context.get(serverContext);

  const parts = cursor ? (cursor.split("/") as [string, string]) : undefined;
  const createdAtCursor = parts ? new Date(parts[0]) : undefined;
  const slugCursor = parts ? parts[1] : undefined;

  const links = await db.query.links.findMany({
    where:
      createdAtCursor && slugCursor
        ? {
            OR: [
              { createdAt: { lt: createdAtCursor } },
              {
                AND: [
                  { createdAt: { eq: createdAtCursor } },
                  { slug: { lt: slugCursor } }
                ]
              }
            ]
          }
        : undefined,
    orderBy: (link, { desc }) => [desc(link.createdAt), desc(link.slug)],
    limit
  });

  const lastLink = links[links.length - 1];

  const nextCursor =
    links.length === limit
      ? `${lastLink.createdAt.toISOString()}/${lastLink.slug}`
      : undefined;

  return { links, nextCursor };
}

export async function listLinksBySlugs(
  context: Readonly<RouterContextProvider>,
  slugs: string[]
): Promise<Link[]> {
  const { db } = context.get(serverContext);

  return await db.query.links.findMany({ where: { slug: { in: slugs } } });
}
