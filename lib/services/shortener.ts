import { addCreatedUrlId, type AppSession } from "worker/session";
import {
  getIdKey,
  getMinifiedPath,
  getUrlKey,
  storeUrl,
  type UrlMetadata
} from "@features/shortener";

export async function getUrlWithMetadata(
  kv: KVNamespace,
  id: string
): Promise<UrlWithMetadata | null> {
  const url = await kv.get<string>(getIdKey(id));
  if (!url) return null;
  const result = await kv.getWithMetadata<UrlMetadata>(getUrlKey(url));

  return {
    id,
    url,
    visits: result.metadata?.visits || 0
  };
}

export interface UrlWithMetadata {
  id: string;
  url: string;
  visits: number;
}

export async function shortenUrl(
  kv: KVNamespace,
  session: AppSession,
  executionCtx: ExecutionContext,
  url: string
) {
  const id = await storeUrl(kv, url);
  const minifiedUrl = getMinifiedPath(id);

  executionCtx.waitUntil(
    Promise.resolve().then(() => addCreatedUrlId(session, id))
  );

  return { id, minifiedUrl };
}
