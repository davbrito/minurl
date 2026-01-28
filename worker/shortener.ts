import type { ExecutionContext } from "hono";
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

export function getPreviewPath(id: string) {
  return `/minified/${id}`;
}

const MIN_ID_LENGTH = 5;

function generateId(url: string) {
  const initials = url
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .split(/[^a-zA-Z0-9]/)
    .slice(0, 5)
    .map((part) => part.charAt(0));

  const prefix = sample(initials, Math.max(3, initials.length))
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const suffixLength = Math.max(MIN_ID_LENGTH - initials.length, 5);

  const suffix = nanoid(suffixLength);

  return `${prefix}-${suffix}`;
}

export async function storeUrl(kv: KVNamespace, url: string) {
  let id = await kv
    .getWithMetadata<UrlMetadata>(getUrlKey(url))
    .then((res) => res?.metadata?.id || null);

  if (id !== null) {
    return id;
  }

  id = generateId(url);

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

export async function getUrls(kv: KVNamespace, ids: string[], baseUrl: string) {
  if (ids.length === 0) {
    return [];
  }

  const urls = await kv.get<string>(ids.map((id) => getIdKey(id)));

  return ids.map((id) => ({
    id,
    url: urls.get(getIdKey(id)) || "",

    minifiedUrl: new URL(getMinifiedPath(id), baseUrl).href
  }));
}

function sample<T>(array: ArrayLike<T>, size: number): T[] {
  const result: T[] = [];
  const taken = new Set<number>();
  const n = array.length;

  size = Math.min(size, n);

  const replace = size > n;

  while (result.length < size) {
    const index = Math.floor(Math.random() * n);
    if (!taken.has(index) || replace) {
      taken.add(index);
      result.push(array[index]);
    }
  }

  return result;
}
