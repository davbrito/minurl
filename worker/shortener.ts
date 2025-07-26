import { nanoid } from "nanoid";

export function getUrlKey(url: string = "") {
  return `url:${url}`;
}

export function getIdKey(id: string) {
  return `id:${id}`;
}

export function getMinifiedPath(id: string) {
  return `/x/${id}`;
}

export async function storeUrl(kv: KVNamespace, url: string) {
  let id = await kv.get(url);

  if (id !== null) {
    return id;
  }

  id = nanoid();

  await Promise.all([
    kv.put(getIdKey(id), url),
    kv.put(getUrlKey(url), "", { metadata: { id } })
  ]);

  return id;
}

export async function getUrl(kv: KVNamespace, id: string) {
  return await kv.get(getIdKey(id));
}

export async function visitUrl(
  c: ExecutionContext,
  kv: KVNamespace,
  id: string,
  _referrer?: string
) {
  const url = await kv.get(getIdKey(id));
  if (url === null) return null;

  c.waitUntil(addVisit(kv, url));

  return url;
}

async function addVisit(kv: KVNamespace, url: string) {
  const key = getUrlKey(url);
  const res = await kv.getWithMetadata<UrlMetadata>(key);

  if (!res.metadata) return;

  res.metadata.visits = (res.metadata.visits || 0) + 1;

  await kv.put(key, res.value || "", { metadata: res.metadata });
}

export type UrlMetadata = {
  id: string;
  visits?: number;
};

export async function getId(kv: KVNamespace, url: string) {
  const result = await kv.getWithMetadata<UrlMetadata>(getUrlKey(url));
  return result?.metadata?.id || null;
}

export async function removeUrl(kv: KVNamespace, id: string) {
  const url = await getUrl(kv, id);
  if (id === null) {
    return;
  }

  await Promise.all([
    kv.delete(getIdKey(id)),
    url && kv.delete(getUrlKey(url))
  ]);
}
